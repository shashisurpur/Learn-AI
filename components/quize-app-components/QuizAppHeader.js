import Link from 'next/link'
import React from 'react'

const QuizAppHeader = ({ back }) => {
    return (
        // <div className={`flex pt-4 sticky top-0 bg-gray-900 z-10`}>
        <div className={`flex flex-row p-4 sticky top-0 bg-[#292a2d] shadow-2xl z-10 justify-between   items-center  gap-4`}>
            {
                back ? <button className='p-2 cursor-pointer flex items-center gap-2 bg-black text-[16px] rounded-lg'
                    onClick={back}
                >
                    <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i>
                    <span>Back to AI Quiz</span>

                </button>
                    :
                    <Link href={'/'} prefetch>
                        <button className='p-2 cursor-pointer flex items-center gap-2 bg-black text-[16px] rounded-lg'
                        // onClick={back}
                        >
                            <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i>
                            <span>Back to My AI</span>
                        </button>
                    </Link>

            }
            <h1 className='text-4xl'>Quiz App</h1>
            {/* {
                    !back &&
                    <p className='text-[16px]'>Select an option from below or chat with our ai to create a quiz.</p>

                } */}
            {/* {
                back &&
                <div className='w-[10%]'></div>
            } */}
            <div className='pr-[120px]'></div>
        </div>
        // </div>
    )
}

export default QuizAppHeader
