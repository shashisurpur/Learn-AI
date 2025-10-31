'use client'
import InputSection from '@/components/ai-content-app-components/InputSection'
import ModeSelector from '@/components/ai-content-app-components/ModeSelector'
import OutputSection from '@/components/ai-content-app-components/OutputSection'
import React, { useState } from 'react'

const ContentRewriter = () => {

    const [selectedMode, setSelectedMode] = useState('');

    const onSelectMode = (id) => {
        setSelectedMode(id)
    }

    return (
        <div className='min-h-screen  transition-all'>
            <div className='relative container mx-auto px-4 py-8 max-w-7xl'>
                <header className='flex justify-between items-center mb-12'>
                    <div className='flex items-center gap-4'>

                        <div className='relative'>
                            <div className=' absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 
                            rounded-2xl blur-lg opacity-60'></div>
                            <div className='relative p-3 bg-gradient-to-br from-blue-600 to-cyan-600 
                            rounded-2xl shadow-lg'>
                                {/* wand icon of className="w-8 h-8 text-white" */}
                            </div>
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold bg-gradient-to-r from-white to-gray-300
                            bg-clip-text text-transparent'>AI Content Rewriter</h1>
                            <p className='text-sm text-gray-400 mt-1'>
                                Transform your content with AI-powered intelligence
                            </p>
                        </div>
                    </div>
                    {/* dark button */}
                    <button></button>
                </header>
                {/* section */}
                <div className=' space-y-8'>
                    <div className='bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8
                         border border-gray-700/50'>
                        <h2 className='text-xl font-bold text-white mb-6'>
                            Choose Transformation mode
                        </h2>
                        {/* component */}
                        <ModeSelector
                            selectedMode={selectedMode}
                            onSelectMode={onSelectMode}
                        />
                    </div>
                    {/* Input and output */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <div className='bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8
                             border border-gray-700/50' >
                            <h2 className='text-xl font-bold text-white mb-6'>
                                Input
                            </h2>
                            <InputSection />
                        </div>

                        {/* Output section */}
                        <div className='bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8
                             border border-gray-700/50'>
                            <OutputSection />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className='flex justify-center'>
                        <button className='group relative px-12 py-4 rounded-xl font-bold text-white
                             transition-all duration-300 disabled:opacity-50 cursor-not-allowed shadow-xl
                              hover:shadow-2xl overflow-hidden'>
                            <div className=' absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600
                                 bg-[length:200%_100%]'></div>
                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100
                                 transition-all bg-gradient-to-r from-blue-700 via-cyan-700 to-blue-700'></div>
                            <div className=' relative flex items-center gap-3'>
                                {/* wand icon */}
                                Transform Content
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ContentRewriter
