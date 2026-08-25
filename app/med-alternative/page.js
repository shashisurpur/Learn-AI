"use client";

import React, { useState } from "react";
import {
    Search,
    UploadCloud,
    FileImage,
    X,
    Activity,
    IndianRupee,
    AlertTriangle,
    Info,
    Pill,
    Loader2,
    MoveLeft
} from "lucide-react";
import Link from "next/link";

export default function Home() {
    const [medicineName, setMedicineName] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) {
                setError("Image size should be less than 4MB");
                return;
            }
            setError(null);
            setImagePreview(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!medicineName && !image) {
            setError("Please enter a medicine name or upload an image.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setStatus(image ? "Identifying medicine from image using AI..." : "Running AI agent...");

        try {
            const response = await fetch("/api/alternate-tab/agent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    medicineName: medicineName,
                    image: image,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to process request");
            }

            setResult(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setStatus("");
        }
    };

    return (
        <div className='min-h-screen  transition-all'>
            {/* Header */}
            <div className=''>
                {/* <div className="text-center mb-12"> */}

                    <header className='flex py-4 justify-between items-center gap-6 md:gap-0 mb-12 sticky top-0 z-50 bg-[#292a2d] shadow-2xl'>
                        <div className="relative group ">
                            <Link href={'/'} prefetch>
                                <button className='p-2 md:ml-10 cursor-pointer flex items-center gap-2 bg-black text-[16px] rounded-lg'
                                // onClick={backToAiOptions}
                                >
                                    {/* <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i> */}
                                    <MoveLeft className='w-6 h-6 text-white' />
                                    <span className=' hidden md:flex'>Back to My AI</span>
                                    <div className="max-w-xs absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[13px] right-0 left-0 mx-auto w-max -bottom-10 rounded before:w-4 before:h-4 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:-top-1 before:left-0  before:right-0 before:mx-auto">
                                        Back to My AI</div>
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 mb-4">

                            <div className="bg-emerald-600 p-3 rounded-full text-white shadow-lg">
                                <Pill size={36} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-600 sm:text-5xl">
                                Med<span className="text-emerald-600">Alternative</span>
                            </h1>
                        </div>
                        <button className='md:pr-10'></button>
                    </header>
                    <p className="max-w-2xl text-center mx-auto text-lg text-slate-300">
                        Identify pills and find alternative medications (tablets) instantly. Powered by Gemini, RxNorm, and openFDA.
                    </p>
                {/* </div> */}

                <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Input Form Card */}
                        <div className="bg-gray-800/80 p-6 rounded-2xl shadow-md border border-slate-100 lg:col-span-1 h-fit">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                Search or Upload
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image upload area */}
                                <div className="">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Upload Pill / Pack Image
                                    </label>
                                    {!imagePreview ? (
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-500 transition cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <UploadCloud className="mx-auto text-slate-400 group-hover:text-emerald-500 transition mb-2" size={32} />
                                            <p className="text-sm font-medium text-slate-600">
                                                Click to upload or drag & drop
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max 4MB)</p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-gray-800/80 p-2">
                                            <img
                                                src={imagePreview}
                                                alt="Uploaded preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-4 right-4 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Separator */}
                                {!image && (
                                    <div className="flex items-center my-4">
                                        <hr className="flex-grow border-slate-200" />
                                        <span className="px-3 text-xs text-slate-400 font-bold uppercase tracking-wider">OR</span>
                                        <hr className="flex-grow border-slate-200" />
                                    </div>
                                )}

                                {/* Text input */}
                                {!image && (
                                    <div>
                                        <label htmlFor="med-name" className="block text-sm font-medium text-white mb-2">
                                            Medicine Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="med-name"
                                                type="text"
                                                placeholder="e.g. Advil, Tylenol, Lipitor..."
                                                value={medicineName}
                                                onChange={(e) => setMedicineName(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border text-slate-700 border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-slate-50"
                                            />
                                            <Search className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 px-4 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 ${loading
                                        ? "bg-slate-400 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Search size={20} />
                                            Find Alternatives
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Status logs/indicators */}
                            {loading && status && (
                                <div className="mt-4 p-3 bg-gray-800/80  text-emerald-800 rounded-xl text-xs flex items-center gap-2 border border-emerald-100">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    {status}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-2 bg-gray-800/80 overflow-hidden text-rose-800 rounded-xl text-sm block gap-2 border border-rose-100">
                                    <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                                    <div>{`${error}`}</div>
                                </div>
                            )}
                        </div>

                        {/* Results / Details Area */}
                        <div className="lg:col-span-2 ">
                            {!result && !loading && (
                                <div className="bg-gray-800/80 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full min-h-[300px]">
                                    <Pill size={48} className="text-white mb-3" />
                                    <h3 className="font-bold text-lg text-white">No Search Performed</h3>
                                    <p className="text-sm max-w-sm mt-1">
                                        Enter a medicine name or upload a pill picture on the left to discover equivalent and class-related alternatives.
                                    </p>
                                </div>
                            )}

                            {loading && (
                                <div className="bg-gray-800/80 border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[350px] shadow-sm">
                                    <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
                                    <h3 className="font-bold text-lg text-white">AI Agent is Working</h3>
                                    <p className="text-sm text-slate-400 max-w-sm mt-1">
                                        Our agent is connecting to RxNorm for ingredients, querying openFDA for precautions and symptoms, and looking up pictures and prices...
                                    </p>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-6">
                                    {/* Query Drug Banner */}
                                    <div className="bg-gray-800/80  border border-emerald-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Searched Medication</span>
                                            <h3 className="text-2xl font-black text-white capitalize mt-0.5">
                                                {result.identifiedName}
                                            </h3>
                                        </div>
                                        <div className="bg-emerald-600 text-white font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                                            {result.alternatives.length} Alternatives Found
                                        </div>
                                    </div>

                                    {/* Grid of alternative drugs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {result.alternatives.map((alt, idx) => (
                                            <div key={idx} className="bg-gray-800/80  border border-slate-100 rounded-2xl overflow-hidden shadow-md flex flex-col h-full hover:shadow-lg transition">

                                                {/* Tablet picture */}
                                                <div className="relative h-44 bg-gray-800/80  border-b border-slate-100">
                                                    {alt.pictures ? (
                                                        <img
                                                            src={alt.pictures}
                                                            alt={alt.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                            <Pill size={36} className="mb-2" />
                                                            <span className="text-xs">No image available</span>
                                                        </div>
                                                    )}

                                                    {/* Price tag */}
                                                    {alt.price && (
                                                        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-emerald-400 px-3 py-1 rounded-lg text-xs font-black flex items-center shadow-md">
                                                            <IndianRupee size={13} className="text-emerald-500 mr-0.5" />
                                                            {alt.price.split('for')[0].trim()}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Details */}
                                                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                                                    <div>
                                                        <h4 className="text-lg font-extrabold text-white capitalize mb-1">
                                                            {alt.name}
                                                        </h4>

                                                        {/* Ingredients */}
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            <span className="bg-gray-800/80  text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                                                {alt.content || "Active Ingredients"}
                                                            </span>
                                                        </div>

                                                        {/* Symptoms */}
                                                        <div className="text-xs text-slate-400 line-clamp-3 mb-2">
                                                            <strong className="text-slate-300  mb-0.5 flex items-center gap-1 font-bold">
                                                                <Activity size={12} className="text-emerald-600" />
                                                                Symptoms / Indications
                                                            </strong>
                                                            {alt.symptoms}
                                                        </div>
                                                    </div>

                                                    {/* Precautions */}
                                                    <div className="pt-3 border-t border-slate-100">
                                                        <div className="bg-gray-800/80 border border-rose-100 rounded-lg p-2.5 text-[11px] text-rose-800 flex gap-2">
                                                            <Info size={14} className="flex-shrink-0 mt-0.5 text-rose-500" />
                                                            <div className="line-clamp-3">
                                                                <strong className="font-bold">Precautions: </strong>
                                                                {alt.precaution}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
