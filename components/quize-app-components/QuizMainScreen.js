import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const QuizMainScreen = ({ prompt, setPrompt, handleQuizOptions }) => {

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && prompt.trim()) {
            handleQuizOptions(prompt)
        }
    }

    const handlePrompt = () => {
        console.log('prmpt', prompt)
        if (prompt.trim()) {
            handleQuizOptions(prompt)
        }
    }

    return (
        < >
            <div className='flex-1'>

            </div>
            <div className="flex-1">
                <div className='flex flex-col items-center justify-center gap-3'>
                    <button className='p-2 bg-blue-500 rounded-lg w-3xs cursor-pointer hover:bg-blue-600'
                        onClick={() => handleQuizOptions('Javascript')}
                    >
                        Javascript
                    </button>
                    <button className='p-2 bg-blue-500 rounded-lg w-3xs cursor-pointer hover:bg-blue-600'
                        onClick={() => handleQuizOptions('React js')}
                    >
                        React JS
                    </button>
                    <button className='p-2 bg-blue-500 rounded-lg w-3xs cursor-pointer hover:bg-blue-600'
                        onClick={() => handleQuizOptions('Node js')}
                    >
                        Node JS
                    </button>

                </div>
            </div>
            <div className="flex-1">
                <div className={`flex justify-center items-center `}>
                    <div className='w-[50%] bg-[#404045] p-4 rounded-3xl mt-4 transition-all'>
                        <textarea
                            onKeyDown={(e) => handleKeyDown(e)}
                            className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
                            rows={2}
                            placeholder="Message..."
                            required
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}

                        />
                        <div className="flex items-center justify-end text-sm">
                            <div className="flex items-center gap-2">
                                <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
                                <button
                                    className={`${prompt ? "bg-primary" : "bg-[#71717a]"
                                        } rounded-full p-2 cursor-pointer`}
                                    onClick={handlePrompt}
                                >
                                    <Image
                                        className="w-3.5 aspect-square"
                                        src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
                                        alt=""
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default QuizMainScreen
