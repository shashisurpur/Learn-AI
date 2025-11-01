"use client"
import { Check, Copy, Download } from 'lucide-react'
import React, { useState } from 'react'
import Markdown from 'react-markdown'

const OutputSection = ({
    loading,
    result
}) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!result) return;

        try {
            await navigator.clipboard.writeText(result)
            setCopied(true)
        } catch (err) {

        }
    }

    const handleDownload = () => {
        if (!result) return;

        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url;
        a.download = `transformed-text-${Date.now()}.text`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a)

        URL.revokeObjectURL(url)
    }

    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-white'>
                    Transform Text
                </h3>

                {
                    result && !loading &&
                    <div className='flex gap-2'>
                        <button
                            className={`flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300
                     rounded-lg text-sm font-medium transition-all`}
                            onClick={handleCopy}
                        >
                            {/* copy icon and check icon */}
                            {
                                copied ? <Check className='w-4 h-4' />
                                    : <Copy className='w-4 h-4 ' />
                            }
                        </button>
                        {/* Download button */}
                        <button
                            className={`flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300
                     rounded-lg text-sm font-medium transition-all`}
                            onClick={handleDownload}

                        >
                            <Download className='w-4 h-4'/>
                            Download
                        </button>
                    </div>
                }

            </div>
            <div className='relative'>
                {/* <textarea
                    value={loading ? 'Processing your request...' : result}
                    readOnly={true}
                    placeholder='Your transformed text will be appear here...'
                    className='w-full h-64 p-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100
                 placeholder:text-gray-500 focus:ring-blue-50 focus:border-transparent resize-none transition-all'
                /> */}
                {/* Loader overlay */}
                <div
                    className='w-full h-64 p-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100
                 placeholder:text-gray-500 overflow-auto focus:ring-blue-50 focus:border-transparent resize-none transition-all'>
                    {
                        result &&!loading ?
                        <Markdown>{result}</Markdown>
                        :loading?
                        <div className=' absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg'>
                            <div className='flex flex-col items-center gap-3'>
                                <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'>
                                </div>
                                <p className='text-sm text-gray-400'>
                                    Processing...
                                </p>
                            </div>
                        </div>
                        :null
                    }
                    
                </div>
                {/* {
                    loading && (
                        <div className=' absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg'>
                            <div className='flex flex-col items-center gap-3'>
                                <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'>
                                </div>
                                <p className='text-sm text-gray-400'>
                                    Processing...
                                </p>
                            </div>
                        </div>
                    )
                } */}


            </div>
            <div className='text-sm text-gray-400'>
                {result.length} Characters
            </div>
        </div>
    )
}

export default OutputSection
