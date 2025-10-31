'use client'
import { assets } from '@/assets/assets'
import Header from '@/components/chat-ai-app-components/Header'
import Message from '@/components/chat-ai-app-components/Message'
import PromptBox from '@/components/chat-ai-app-components/PromptBox'
import Sidebar from '@/components/chat-ai-app-components/Sidebar'
import { useAppContext } from '@/context/AppContext'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

const ChatAi = () => {

    const [expand, setExpand] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const { activeChat, freeRequests, loadingChats,user,setLoadingChats,fetchUserChats,setActiveChat,setChats,getGuestLimit } = useAppContext();
    const containerRef = useRef(null);
    console.log(activeChat, 'activeChats')

    useEffect(() => {
        if (activeChat) {
            setMessages(activeChat.messages);
        } else {
            setMessages([])
        }

    }, [activeChat]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            })
        }
    }, [activeChat]);

    useEffect(() => {
        if (user) {
            setLoadingChats(true);
            fetchUserChats();
        }

        if (!user) {
            // setLoadingChats(false)
            setActiveChat(null)
            setChats([])

        }
        return () => {

        }
    }, [user]);


    useEffect(() => {
        if (!user) {
            getGuestLimit()
        }
    }, [])


    return (
        <div className="flex h-screen">
            <Sidebar expand={expand} setExpand={setExpand} />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8  relative">
                {/* <div className="absolute px-4 top-6 flex items-center justify-between w-full">
          <div className="md:hidden">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              alt=""
              src={assets.menu_icon}
            />
          </div>

          <Header />
          <div className="md:hidden ">
            <Image className=" opacity-70" alt="" src={assets.chat_icon} />
          </div>

        </div> */}
                <Header expand={expand} setExpand={setExpand} />
                {messages.length === 0 && !activeChat ? (
                    <>
                        <div className="flex items-center gap-3">
                            <Image src={assets.logo_icon} alt="" className="h-16" />
                            <p className="text-2xl font-medium">Hi I am AI Assistant</p>
                        </div>
                        {
                            freeRequests === 5 ?
                                <>
                                    {/* <div className="inline-flex items-center justify-center gap-2 bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1.5 rounded-md border border-yellow-300 w-1xl">
                    <svg
                      className="w-4 h-4 text-yellow-800"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.591c.75 1.333-.213 2.99-1.743 2.99H3.482c-1.53 0-2.493-1.657-1.743-2.99L8.257 3.1zm1.743 4.401a.75.75 0 00-1.5 0v3.25a.75.75 0 001.5 0V7.5zm-.75 7a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {'Please login to continue your chat'}
                  </div> */}

                                    <div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-800 text-sm font-medium p-4 rounded-md border border-red-300 ">
                                        {/* Error Icon: Circle with X */}
                                        <svg
                                            className="w-4 h-4 text-red-600"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.54-10.46a.75.75 0 00-1.06-1.06L10 8.94 7.53 6.47a.75.75 0 00-1.06 1.06L8.94 10l-2.47 2.47a.75.75 0 101.06 1.06L10 11.06l2.47 2.47a.75.75 0 101.06-1.06L11.06 10l2.47-2.47z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {'Please login to continue your chat'}
                                    </div>
                                </>

                                :
                                <p className="text-sm mt-2">How can I help you?</p>
                        }

                    </>
                ) : (
                    <div ref={containerRef}
                        className="relative flex flex-col items-center justify-start w-full mt-20 max-h-screen overflow-y-auto"
                    >
                        <p className="flex top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">{activeChat?.name}</p>
                        {
                            activeChat && messages.map((msg, index) => (
                                <Message key={index} role={msg.role} content={msg.content} />
                            ))
                        }
                        {/* <Message role={"user"} content={"what is js"} /> */}
                        {
                            loading && (
                                <div
                                    className="flex gap-4 max-w-3xl w-full py-3"
                                >
                                    <Image
                                        className="h-9 w-9 p-1 border border-white/15 rounded-full"
                                        src={assets.logo_icon} alt="logo icon" />
                                    <div className="loader flex justify-center items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                                        <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                                        <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                )}

                {/* Prompt Box */}
                <PromptBox loading={loading} setLoading={setLoading} />
                <p className="text-xs bottom-1 absolute text-gray-500">
                    AI-generated, for reference only
                </p>
            </div>
        </div>
    )
}

export default ChatAi
