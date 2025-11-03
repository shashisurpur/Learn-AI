import { assets } from '@/assets/assets'
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect } from 'react'

const Header = ({ expand, setExpand }) => {

    const { freeRequests, user } = useAppContext();

    return (
        <div className="absolute px-4 top-6 flex items-center justify-between  w-full">
            <div className="md:hidden">
                <Image
                    onClick={() => (expand ? setExpand(false) : setExpand(true))}
                    className="rotate-180"
                    alt=""
                    src={assets.menu_icon}
                />
            </div>
            <div className="hidden  md:flex  md:pl-[130px]"></div>
            <h2 className="text-lg font-semibold text-white">
                Ask anything
                {!user && <span>({freeRequests}/5)</span>}

            </h2>
            <div className="hidden  md:flex gap-1">
                <div className="relative group">
                    <Link href={'/'} prefetch>
                        <button className='p-2 cursor-pointer flex items-center gap-1 bg-black text-[16px] rounded-lg'
                        // onClick={back}
                        >
                            <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i>
                            <span>Back to My AI</span>
                        </button>
                    </Link>
                    <div className="max-w-xs absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[13px] right-0 left-0 mx-auto w-max -bottom-10 rounded before:w-4 before:h-4 before:rotate-45 before:bg-[#333] before:absolute before:z-[-1] before:-top-1 before:left-0  before:right-0 before:mx-auto">
                        Back to My AI</div>
                </div>
            </div>
            <div className="md:hidden flex flex-row-reverse ">
                <Image className=" opacity-70" alt="" src={assets.chat_icon} />
                <Link href={'/'} prefetch>
                    <button className='p-2 cursor-pointer flex items-center gap-1 bg-black text-[16px] rounded-lg'
                    // onClick={back}
                    >
                        <i className="fa fa-long-arrow-left text-white" aria-hidden="true"></i>
                        {/* <span>Back to My AI</span> */}
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default Header
