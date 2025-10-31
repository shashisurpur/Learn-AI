"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";





export default function Home() {

  const router = useRouter();

  const cards = [
    {
      title: "Chat Bot",
      description: "An AI-powered assistant that can chat, answer questions, and help with tasks in real time.",
      path: "/chat-ai"
    },
    {
      title: "PDF Chat",
      description: "Upload a PDF and have an intelligent conversation with its contents — great for summaries or Q&A.",
      path: "/chat-with-pdf"

    },
    {
      title: "Quiz AI",
      description: "Automatically generate engaging quizzes using AI for learning, testing, or fun challenges.",
      path: "/quize-app"

    },
    {
      title: "Quiz with PDF",
      description: "Upload a PDF and let AI create quizzes based on its content to test your understanding instantly.",
      path: "/quiz-pdf-app"

    },
    {
      title: "AI Content Rewriter",
      description: "Coming soon",
      path: "/"

    },
  ];

  useEffect(() => {
    router.prefetch("/chat-ai");
    router.prefetch("/chat-with-pdf");
    router.prefetch("/quize-app");
    router.prefetch("/quiz-pdf-app");


  }, [router]);

  const handleCardClick = (path) => {
    router.push(`${path}`);

  }

  return (
    <div >
      <div className="text-center sticky top-0 z-50 bg-[#292a2d] text-white p-4 shadow-2xl">
        <p className="text-3xl"> LEARN WITH AI</p>
      </div>

      <div className="min-h-screen bg-[#292a2d] flex items-center justify-center p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">

          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => handleCardClick(card.path)}
              className="bg-[#1e1f22] rounded-xl p-8 text-center text-white shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
            >
              <h2 className="text-2xl font-semibold mb-3">{card.title}</h2>
              <p className="text-gray-300 text-sm">{card.description}</p>
            </div>
          ))}
          {/* <div
            className="bg-[#1e1f22] rounded-xl p-8 text-center text-white shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Chat Bot</h2>
            <p className="">This is card number {1}.</p>
          </div> */}


        </div>
      </div>


      {/* <div className="bg-[#292a2d] text-white ">

       
        <div className="flex flex-col justify-center items-center h-screen gap-8">
          <button className="p-2 bg-blue-500 rounded w-3xs cursor-pointer hover:bg-blue-600"
            onClick={() => router.push('/chat-ai')}
          >
            Chat Bot
          </button>
          <button className="p-2 bg-amber-500 rounded w-3xs cursor-pointer hover:bg-amber-600 "
            onClick={() => router.push('/quize-app')}
          >
            AI Quiz
          </button>
        </div>
      </div> */}
      {/* <Sidebar expand={expand} setExpand={setExpand} />
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
        
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
                 

                  <div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-800 text-sm font-medium p-4 rounded-md border border-red-300 ">
                  
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

        <PromptBox loading={loading} setLoading={setLoading} />
        <p className="text-xs bottom-1 absolute text-gray-500">
          AI-generated, for reference only
        </p>
      </div> */}

    </div>
  );
}
