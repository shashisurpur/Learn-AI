'use client'
import InputSection from '@/components/ai-content-app-components/InputSection'
import ModeSelector from '@/components/ai-content-app-components/ModeSelector'
import OutputSection from '@/components/ai-content-app-components/OutputSection'
import { MoveLeft, Wand, WandSparkles } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const ContentRewriter = () => {

    const [selectedMode, setSelectedMode] = useState('summarise');
    const [inputMode, setInputMode] = useState('text');
    const [inputText, setInputText] = useState('');
    const [urlText, setUrlText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    console.log(inputText, 'inputText');

    const handleTransform = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/content-rewriter', {
                method: 'POST',
                body: JSON.stringify({ mode: selectedMode, context: inputText }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            console.log(data, 'data');
            if (data.success) {
                setResult(data.data)
            }

        } catch (error) {

        } finally {
            setLoading(false)
        }

    }

    const onSelectMode = (id) => {
        setSelectedMode(id)
    }

    const canTransform = inputMode === 'text' ? inputText.trim().length > 0 : urlText.trim().length > 0
    console.log(canTransform, 'canTransform');
    return (
        <div className='min-h-screen  transition-all'>
            <div className='relative container mx-auto  max-w-7xl'>
                <header className='flex py-4 justify-between items-center mb-12 sticky top-0 z-50 bg-[#292a2d]'>
                    <Link href={'/'} prefetch>
                        <button className='p-2 cursor-pointer flex items-center gap-2 bg-black text-[16px] rounded-lg'
                        // onClick={backToAiOptions}
                        >
                            {/* <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i> */}
                            <MoveLeft className='w-4 h-4 text-white'/>
                            <span className=' hidden md:flex'>Back to My AI</span>
                        </button>
                    </Link>
                    <div className='flex items-center gap-4'>

                        <div className='relative'>
                            <div className=' absolute inset-0 bg-linear-to-br from-blue-600 to-cyan-600 
                            rounded-2xl blur-lg opacity-60'></div>
                            <div className='relative p-3 bg-linear-to-br from-blue-600 to-cyan-600 
                            rounded-2xl shadow-lg'>
                                {/* wand icon of className="w-8 h-8 text-white" */}
                                {/* <i className="fa-solid fa-wand-magic-sparkles  text-white"></i> */}
                                <WandSparkles className='w-8 h-8 text-white' />
                            </div>
                        </div>
                        <div>
                            <h1 className='text-3xl font-bold bg-linear-to-br from-white to-gray-300
                            bg-clip-text text-transparent'>AI Content Rewriter</h1>
                            <p className='text-sm text-gray-400 mt-1'>
                                Transform your content with AI-powered intelligence
                            </p>
                        </div>
                    </div>
                    {/* dark button */}
                    <button className='pr-10'></button>
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
                            <InputSection
                                text={inputText}
                                url={urlText}
                                inputMode={inputMode}
                                onTextChange={setInputText}
                                onUrlChange={setUrlText}
                                onInputChange={setInputMode}
                            />
                        </div>

                        {/* Output section */}
                        <div className='bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8
                             border border-gray-700/50'>
                            <OutputSection
                                loading={loading}
                                result={result}
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className='flex justify-center'>
                        <button className='group relative px-12 py-4 rounded-xl font-bold text-white
                             transition-all cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl
                              hover:shadow-2xl overflow-hidden'
                            onClick={handleTransform}
                        // disabled={ !canTransform || !loading}
                        >
                            <div className=' absolute inset-0 bg-linear-to-r from-blue-600 via-cyan-600 to-blue-600
                                 bg-size[200%_100%]'></div>
                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100
                                 transition-all bg-linear-to-r from-blue-700 via-cyan-700 to-blue-700'></div>
                            <div className=' relative flex items-center gap-3'>
                                {/* wand icon */}
                                {/* <i className="fa-solid fa-wand-magic-sparkles"></i> */}
                                <Wand className='w-8 h-8' />
                                {loading ? 'Transforming...' : 'Transform Content'}

                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ContentRewriter
