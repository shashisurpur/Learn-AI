'use client'
import { assets } from '@/assets/assets'
import QuizAppHeader from '@/components/quize-app-components/QuizAppHeader'
import QuizMainScreen from '@/components/quize-app-components/QuizMainScreen'
import QuizScreen from '@/components/quize-app-components/QuizScreen'
import { questions } from '@/data/questions'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const QuizApp = () => {
    const [prompt, setPrompt] = useState("");
    const [quizData, setQuizData] = useState({})
    const [isLoading, setIsLoading] = useState(false)



    const handleQuizOptions = async (option) => {
        setIsLoading(true)
        try {
            setPrompt(option)
            const { data } = await axios.post('/api/quize/ai', {
                prompt: option,
            })
            console.log(data, 'data')
            if (data.success) {
                setQuizData(data.data)
                // setIsLoading(false)

            } else {
                toast.error(data.message || "Failed to fetch response");
                setPrompt('')
            }
        } catch (error) {
            toast.error('Server Error')
        } finally {
            setIsLoading(false)
        }


    }

    const goBackToMain = () => {
        setQuizData({})
        setPrompt('')
    }

    useEffect(() => {
        const makeapicall = async () => {
            const { data } = await axios.post('/api/quize/ai', {
                prompt: 'the solar system',
            })
        }
        // makeapicall();
    }, [])
    console.log(prompt, 'promt')

    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
    //         </div>
    //     )
    // }

    return (
        <div>
            {
                Object.keys(quizData).length > 0 ?
                    <div className='bg-gray-900 text-white'>
                        <QuizAppHeader back={goBackToMain} />
                        <QuizScreen
                            questions={questions}
                            quizData={quizData}
                            goBackToMain={goBackToMain}
                        />
                    </div>
                    :
                    <div className="h-screen flex flex-col">
                        <QuizAppHeader />
                        {
                            isLoading ?
                                <div className="flex items-center justify-center h-screen">
                                    <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                                :
                                <QuizMainScreen
                                    prompt={prompt}
                                    setPrompt={setPrompt}
                                    handleQuizOptions={handleQuizOptions}
                                />
                        }

                    </div>
            }

        </div>
    )
}

export default QuizApp
