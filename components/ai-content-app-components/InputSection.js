import React from 'react'

const InputSection = () => {
    return (
        <div className='space-y-4'>
            {/* Toggele buttons */}
            <div className='flex gap-2 bg-gray-800 p-1 rounded-lg'>
                <button
                    aria-label='Switch to text input'
                    className='flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all'
                >
                    {/* File icon */}
                    <span className='font-medium'>Text Input</span>
                </button>
                <button
                    aria-label='Switch to text input'
                    className='flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all'
                >
                    {/* URL icon */}
                    <span className='font-medium'>URL Input</span>
                </button>
            </div>
            {/* Conditional */}
            {/* Text Mode */}
            <div className=''>
                <textarea
                    placeholder='Paste your text here to transfrorm it...'
                    className='w-full h-64 p-4 rounded-lg border border-gray-700 bg-gray-800 text-gray-100
                 placeholder:text-gray-500 focus:ring-blue-50 focus:border-transparent resize-none transition-all'
                />
                <div className='text-sm text-gray-400 mt-2'>
                    <span>Too long content will be trimmed</span>
                </div>
            </div>
            {/* Mode url  */}
           {/*  <div>
                <div className='relative'>
                    <link 
                    className=' absolute left-4 top-1/2 translate-y-1/2 w-5 h-5 text-gray-400'
                    />
                    <input 
                    type="url"
                    placeholder='https://example.com'
                    className='w-full pl-12 pr-4 py-4 rounded-lg border-2 border-gray-700 bg-gray-800 text-gray-100
                     placeholder-gray-500 focus-ring-2 focusring-blue-500 focus:border-transparent transition-all'
                    />
                </div>
                <p className='text-sm text-gray-400 mt-2'>
                    Enter a url to fetch and transform its content
                </p>
            </div> */}
        </div>
    )
}

export default InputSection
