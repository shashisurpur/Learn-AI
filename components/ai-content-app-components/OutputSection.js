import React from 'react'

const OutputSection = () => {
    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-white'>
                    Transform Text
                </h3>
                <div className='flex gap-2'>
                    <button
                        className={`flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300
                     rounded-lg text-sm font-medium transition-all`}
                    >
                        {/* copy icon and check icon */}

                    </button>
                    {/* Download button */}
                    <button
                        className={`flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300
                     rounded-lg text-sm font-medium transition-all`}
                    >
                        {/* download icon */}
                        Download
                    </button>
                </div>
            </div>
            <div className='relative'>
                <textarea
                    placeholder='Paste your text here to transfrorm it...'
                    className='w-full h-64 p-4 rounded-lg border border-gray-700 bg-gray-900 text-gray-100
                 placeholder:text-gray-500 focus:ring-blue-50 focus:border-transparent resize-none transition-all'
                />
                {/* Loader overlay */}
                {/* <div className=' absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg'>
                    <div className='flex flex-col items-center gap-3'>
                        <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'>
                        </div>
                        <p className='text-sm text-gray-400'>
                            Processing...
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default OutputSection
