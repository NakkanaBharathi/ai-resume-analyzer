import { type FormEvent, useState, useEffect } from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { auth, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (!auth.isAuthenticated) {
            auth.signIn().catch(err => {
                console.error('Sign-in failed', err);
            });
        }
    }, [auth]);

    const handleFileSelect = (file: File | null) => setFile(file);

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        if (!auth.isAuthenticated) {
            setStatusText('Please sign in first.');
            return;
        }

        setIsProcessing(true);
        setStatusText('Uploading the file...');

        let uploadedFile;
        try {
            uploadedFile = await fs.upload([file]);
            if (!uploadedFile || !uploadedFile.path) {
                throw new Error('File upload failed');
            }
        } catch (err) {
            console.error(err);
            setStatusText('Error: Failed to upload file');
            setIsProcessing(false);
            return;
        }

        setStatusText('Converting to image...');
        let imageFile;
        try {
            imageFile = await convertPdfToImage(file);
            if (!imageFile.file) throw new Error('PDF to image conversion failed');
        } catch (err) {
            console.error(err);
            setStatusText('Error: Failed to convert PDF to image');
            setIsProcessing(false);
            return;
        }

        setStatusText('Uploading the image...');
        let uploadedImage;
        try {
            uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage || !uploadedImage.path) {
                throw new Error('Image upload failed');
            }
        } catch (err) {
            console.error(err);
            setStatusText('Error: Failed to upload image');
            setIsProcessing(false);
            return;
        }

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: null as null | Record<string, any>
        };

        try {
            const kvSetResult = await kv.set(`resume:${uuid}`, JSON.stringify(data));
            if (!kvSetResult) throw new Error('Failed to save data in KV');
        } catch (err) {
            console.error(err);
            setStatusText('Error: Failed to save resume data');
            setIsProcessing(false);
            return;
        }

        setStatusText('Analyzing resume...');
        try {
            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback || !feedback.message) {
                throw new Error('AI feedback failed');
            }

            let feedbackContent: any;
            // Handle different feedback formats
            if (typeof feedback.message.content === 'string') {
                feedbackContent = JSON.parse(feedback.message.content);
            } else if (Array.isArray(feedback.message.content)) {
                feedbackContent = JSON.parse(feedback.message.content[0].text);
            } else {
                feedbackContent = null;
            }

            data.feedback = feedbackContent;
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
        } catch (err) {
            console.error(err);
            setStatusText('Error: Failed to analyze resume');
            setIsProcessing(false);
            return;
        }

        setStatusText('Analysis complete! Redirecting...');
        navigate(`/resume/${uuid}`);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            setStatusText('Please upload a resume file first.');
            return;
        }

        const formData = new FormData(e.currentTarget);
        handleAnalyze({
            companyName: formData.get('company-name') as string,
            jobTitle: formData.get('job-title') as string,
            jobDescription: formData.get('job-description') as string,
            file
        });
    };

    return (
        <main className="bg-gradient-to-b from-[#e0f7fa] to-[#f1f8e9] min-h-screen flex flex-col">
            <Navbar />
            <section className="flex flex-1 justify-center items-center px-6 md:px-16 py-16">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2b6777] mb-4">
                        Smart feedback for your dream job
                    </h1>

                    {isProcessing ? (
                        <>
                            <h2 className="text-lg text-[#4a7081] font-medium mb-4">{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full max-w-xl mx-auto rounded-lg shadow-md" />
                        </>
                    ) : (
                        <h2 className="text-lg text-[#4a7081] mb-8">
                            Drop your resume for an ATS score and improvement tips
                        </h2>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
                            <div className="flex flex-col w-full">
                                <label htmlFor="company-name" className="mb-1 font-semibold text-[#2b6777]">Company Name</label>
                                <input
                                    type="text"
                                    name="company-name"
                                    placeholder="Company Name"
                                    id="company-name"
                                    className="w-full border border-[#2b6777] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2b6777] focus:ring-opacity-50 shadow-sm transition duration-300 hover:shadow-md"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="job-title" className="mb-1 font-semibold text-[#2b6777]">Job Title</label>
                                <input
                                    type="text"
                                    name="job-title"
                                    placeholder="Job Title"
                                    id="job-title"
                                    className="w-full border border-[#2b6777] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2b6777] focus:ring-opacity-50 shadow-sm transition duration-300 hover:shadow-md"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="job-description" className="mb-1 font-semibold text-[#2b6777]">Job Description</label>
                                <textarea
                                    rows={5}
                                    name="job-description"
                                    placeholder="Job Description"
                                    id="job-description"
                                    className="w-full border border-[#2b6777] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2b6777] focus:ring-opacity-50 shadow-sm transition duration-300 hover:shadow-md resize-none"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <label htmlFor="uploader" className="mb-1 font-semibold text-[#2b6777]">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button
                                type="submit"
                                disabled={!file}
                                className={`mt-4 w-full py-3 rounded-xl text-white font-semibold shadow-md transition-all duration-300
                  ${file ? 'bg-[#2b6777] hover:bg-[#24555e] hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
                            >
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
