"use client"
import { ConfirmToast } from '@/components/ConfirmToast'
import QuizAppHeader from '@/components/quize-app-components/QuizAppHeader'
import QuizScreen from '@/components/quize-app-components/QuizScreen'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const QuizPdf = () => {
    const [loading, setLoading] = useState(false)
    const [topic, setTopic] = useState('')
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadLoader, setUploadLoader] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [quizData, setQuizData] = useState({})


    const uploadPDF = async () => {
        const formData = new FormData();
        formData.append('file', file);
        setUploadLoader(true)
        try {
            const res = await fetch('/api/quize/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message)
                setFile(null)
                getAllUploadedFiles()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error('Server Error, Please try after some time!')
        } finally {
            setUploadLoader(false)
        }
    };



    const getAllUploadedFiles = async () => {
        setUploadLoader(true)
        try {
            const res = await fetch('/api/quize/getpdf');
            const result = await res.json()
            if (result.success) {
                setUploadedFiles(result.data)
            } else {
                toast.error(result.message)
            }
            console.log(result, 'result')
        } catch (error) {
            toast.error('Server Error')
        } finally {
            setUploadLoader(false)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile)
            // setFile(droppedFile);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        console.log('files', selectedFile)
        if (selectedFile) {
            validateAndSetFile(selectedFile)
        }
    };

    const validateAndSetFile = (f) => {
        if (f.type !== "application/pdf") {
            setUploadError("Only PDF files are allowed.");
            setFile(null);
            return;
        }
        setUploadError(null);
        setFile(f);
    };

    const clearAll = () => {

    }
    useEffect(() => {
        getAllUploadedFiles()
    }, [])


    const goBackToMain = () => {
        setQuizData({})
        setTopic('')
    }

    const createQuiz = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/quize/pdf-quiz', {
                method: 'POST',
                body: JSON.stringify({ topic }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            if (data.success) {
                setQuizData(data.data)
            } else {
                toast.error(data.message)
            }
            console.log('data', data)
        } catch (error) {
            toast.error("Server Error")
        } finally {
            setLoading(false)
        }
    }

    const deleteUploadedFile = async (id, confirm) => {
        if (confirm) {
            setUploadLoader(true)
            try {
                const res = await fetch(`/api/quize/delete/${id}`, {
                    method: "DELETE",
                });

                const data = await res.json();

                if (data.success) {
                    toast.success(data.message)
                    getAllUploadedFiles()
                } else {
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error('Server Error')
            } finally {
                setUploadLoader(false)
            }
        } else {
            const confirmed = await ConfirmToast(
                "Upload new file?",
                "This will delete your existing document from database."
            );
            if (confirmed) {
                setUploadLoader(true)
                try {
                    const res = await fetch(`/api/quize/delete/${id}`, {
                        method: "DELETE",
                    });

                    const data = await res.json();

                    if (data.success) {
                        toast.success(data.message)
                        getAllUploadedFiles()
                    } else {
                        toast.error(data.message)
                    }
                } catch (error) {
                    toast.error('Server Error')
                } finally {
                    setUploadLoader(false)
                }
            }
        }

    }

    const handleNewUpload = async () => {
        if (uploadedFiles.length > 0) {
            const confirmed = await ConfirmToast(
                "Upload new file?",
                "This will remove your existing document."
            );
            if (confirmed) {
                console.log('deleid', uploadedFiles[0]._id)
                deleteUploadedFile(uploadedFiles[0]._id, true)
                // getAllUploadedFiles()
                // setUploadedFiles([])
            }
        }

    }

    if (uploadLoader) {
        return (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                {/* <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div> */}
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/30"></div>
                <p className="text-white mt-4 text-lg font-medium animate-pulse">
                    Loading, please wait...
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className='flex p-4 justify-between items-center bg-[#292a2d] sticky top-0 z-30'>
                <Link href={'/'} prefetch>
                    <button className='p-2 cursor-pointer flex items-center gap-2 bg-black text-[16px] rounded-lg'
                    // onClick={backToAiOptions}
                    >
                                <i className="fa-solid fa-party-horn text-blue-500"></i>

                        <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i>
                        <span className=' hidden md:flex'>Back to My AI</span>
                    </button>
                </Link>

                <h1 className="text-2xl font-bold mb-4">PDF Quiz App</h1>
                <button
                    className='p-2 flex gap-2 items-center cursor-pointer bg-blue-500 hover:bg-blue-600 transition transform hover:scale-105 text-[16px] rounded-lg'
                    onClick={handleNewUpload}
                >
                    <i className="fa-solid fa-plus"></i>
                    <span className=' hidden md:flex'>Upload New file</span>
                </button>
            </div>

            <div className='flex md:flex-row flex-col'>
                {
                    uploadedFiles.length > 0 &&
                    <div className='w-full md:w-[30%] max-h-screen bg-[#212327] p-4 md:shadow-2xl'>
                        {
                            uploadedFiles.map((file) => (
                                <div
                                    key={file._id}
                                >
                                    <div
                                        // className="mt-4 flex items-center space-x-3 bg-gray-500 hover:bg-gray-600 p-3 rounded-lg shadow-sm border border-gray-200"
                                        className="mt-4 flex items-center justify-between space-x-3 bg-gray-500 hover:bg-gray-600 p-3 rounded-lg shadow-sm border border-gray-200"

                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 text-green-500"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M6 2a2 2 0 00-2 2v16c0 1.104.896 2 2 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 14h8v2H8v-2zm0 4h8v2H8v-2z" />
                                        </svg>
                                        <p className="text-sm text-white font-medium">{file.fileName}</p>
                                        <i className="fa-solid fa-trash-can text-red-500 cursor-pointer"
                                            onClick={() => deleteUploadedFile(file._id)}
                                        ></i>
                                    </div>

                                </div>
                            ))
                        }

                    </div>
                }

                <div
                    className={`w-full ${uploadedFiles.length === 0 ? 'md:w-full' : 'md:w-[70%]'}  h-screen p-4`}
                >
                    {
                        uploadedFiles.length === 0 &&
                        <>
                            <div className='text-center mx-auto md:w-md p-2'>
                                <p className='font-semibold text-[24px] m-4'>Feed me your file below.</p>
                                {
                                    file ?
                                        <p className='font-semibold text-[14px]'>Click on upload button below to extract, summarize, and help you to create a quiz application with your content in seconds.</p>
                                        :
                                        <p className='font-semibold text-[14px]'>Drag & drop your PDF below — I’ll extract, summarize, and help you to create a quiz application with your content in seconds.</p>

                                }

                            </div>
                        </>
                    }

                    {/* <div className="flex flex-col mt-6 items-center justify-center w-full"> */}
                    {
                        !file && uploadedFiles.length === 0 &&
                        <div className="flex flex-col mt-6 items-center justify-center w-full">

                            <label
                                htmlFor="file-upload"
                                className={`w-full max-w-md flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all 
                                ${isDragging
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    }
                                ${uploadError ? "border-rose-500" : "border-gray-300"}
                                `}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <p className="font-semibold text-blue-600 mb-6 flex justify-center items-center gap-2">
                                    {/* <i className="fa-solid fa-file-pdf text-blue-600 " aria-hidden="true"></i> */}
                                    <i className="fa-regular fa-file-pdf text-blue-600 "></i>
                                    <span>Quiz with your files</span>
                                </p>


                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-12 h-12 text-gray-400 mb-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6H16a4 4 0 010 8h-1"
                                    />
                                </svg>
                                <p className="text-gray-600 text-center">
                                    <span className="font-semibold text-blue-600">Click to upload</span>{" "}
                                    or Drag & drop your PDF here.

                                </p>
                                <p className="text-gray-400 text-sm mt-1">PDF Only</p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {
                                uploadError && <p className='text-rose-500 text-[14px]'>{uploadError}</p>
                            }

                        </div>
                    }


                    {/* </div> */}

                    {file && (
                        <div className='text-center md:w-md mx-auto mt-6'>
                            <div
                                // className="mt-4 flex justify-between items-center space-x-3 bg-white p-3 w-md rounded-lg shadow-sm border border-gray-200"
                                className="mt-4 flex justify-between items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200"

                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M6 2a2 2 0 00-2 2v16c0 1.104.896 2 2 2h12a2 2 0 002-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 14h8v2H8v-2zm0 4h8v2H8v-2z" />
                                </svg>
                                <p className="text-sm text-gray-700 font-medium">{file.name}</p>
                                <i className="fa-solid fa-xmark text-red-500 font-medium text-sm cursor-pointer"
                                    onClick={() => setFile(null)}
                                ></i>
                            </div>
                            <div className='flex justify-center items-center p-4 gap-6 mt-4'>
                                <button
                                    onClick={uploadPDF}
                                    className="bg-blue-500 rounded-lg text-white px-4 py-2 mt-2 cursor-pointer">
                                    Upload PDF
                                </button>
                                {/* <button
                                    onClick={uploadPDF}
                                    className="bg-blue-500 rounded-lg text-white px-4 py-2 mt-2 cursor-pointer">
                                    Clear file
                                </button> */}
                            </div>
                        </div>
                    )}

                    {
                        uploadedFiles.length > 0 &&
                        <>
                            {
                                topic && Object.keys(quizData).length === 0 &&
                                <div className='flex justify-center items-center'>
                                    <button
                                        className='p-4 bg-gray-500 rounded-lg hover:bg-gray-600 transform transition duration-300 hover:scale-105'
                                        onClick={clearAll}
                                    >
                                        Clear all
                                    </button>
                                </div>
                            }
                            {
                                Object.keys(quizData).length === 0 &&
                                <div
                                    // className="mt-6"
                                    className="flex w-full max-w-xl mx-auto mt-6 gap-2 relative"
                                >
                                    <input
                                        type="text"
                                        placeholder="Type your topic here..."
                                        value={topic}
                                        onChange={e => setTopic(e.target.value)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition "
                                    />

                                    {topic && Object.keys(quizData).length === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setTopic('')}
                                            // className="absolute right-23 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer transform transition duration-300 hover:scale-150 "
                                            className={`${loading ? 'hidden' : 'absolute'}  right-26 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer transform transition duration-300 hover:scale-150`}

                                        >
                                            &#x2715;
                                        </button>
                                    )}

                                    {/* Button */}
                                    <button
                                        className="px-6 py-3 cursor-pointer bg-blue-600 text-white font-semibold rounded-r-xl hover:bg-blue-700 transition disabled:bg-gray-600"
                                        onClick={createQuiz}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Ask'}
                                    </button>
                                </div>
                            }


                            {
                                Object.keys(quizData).length > 0 &&
                                <div className=' text-white'>
                                    {/* <QuizAppHeader back={goBackToMain} /> */}
                                    <div className='flex p-2 justify-between items-center'>
                                        <button className='p-2 bg-blue-500 rounded-lg'>Crete new</button>
                                        <p className='text-3xl'>Quiz</p>
                                        <div />
                                    </div>
                                    <QuizScreen
                                        questions={topic}

                                        quizData={quizData}
                                        goBackToMain={goBackToMain}
                                    />
                                </div>
                            }
                        </>
                    }

                </div>
            </div>


        </div>
    )
}

export default QuizPdf
