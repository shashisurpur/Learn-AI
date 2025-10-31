'use client'
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { set } from "mongoose";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PromptBox = ({ loading, setLoading }) => {
  const [prompt, setPrompt] = useState("");

  const { user, chats, setChats, activeChat, setActiveChat,setFreeRequests } = useAppContext();

  const handleKeyDown=(e)=>{
    // e.preventDefault();
    if(e.key==='Enter'){
      handleSubmit(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    // if (!user) return toast.error("Please sign in to continue");
    if (loading) return toast.error("Please wait for the current response");
    if (!trimmedPrompt) return toast.error("Please enter a valid prompt");
    setPrompt("");
    setLoading(true);
    try {
      // Call the API or perform the action
      const userPrompt = {
        role: "user",
        content: trimmedPrompt,
        timeStamp: Date.now(),
      }
      console.log("Submitting Prompt:", chats, activeChat, userPrompt);
      if (user && activeChat) {
        setChats((prev) => prev.map((chat) => (chat._id === activeChat._id ? { ...chat, messages: [...chat.messages, userPrompt] } : chat)))
        setActiveChat((prev) => ({ ...prev, messages: [...prev.messages, userPrompt] }))
      }else{
      setActiveChat((prev) => ({ ...prev, messages: prev?.messages ? [...prev.messages, userPrompt] : [userPrompt] }))

      }
      // setChats((prev) => prev.map((chat) => (chat._id === activeChat._id ? { ...chat, messages: [...chat.messages, userPrompt] } : chat)))

      // setActiveChat({ messages: [{ ...userPrompt }] })
      console.log("User Prompt Added:", chats, activeChat);

      const { data } = await axios.post('/api/chat/ai', {
        chatId: activeChat?._id || null,
        prompt: trimmedPrompt,
      })

      if (data.success) {
        if (user) {
          setChats((prev) => prev.map((chat) => (chat._id === activeChat._id ? { ...chat, messages: [...chat.messages, data.message] } : chat)))
        }
        console.log("AI Response Added to Chats:", chats);
        //display the AI message in typing animation
        if(data.requests){
          setFreeRequests(data.requests);
        }
        const message = data.data;
        const messageTokens = message.split(' ')
        console.log("Message Tokens:", messageTokens);
        let assistantMessage = {
          role: "assistant",
          content: "",
          timeStamp: Date.now(),
        }
        
        setActiveChat((prev) => ({ ...prev, messages: [...prev.messages, assistantMessage] }))

        for (let i = 0; i < messageTokens.length; i++) {
          setTimeout(() => {
            assistantMessage.content = messageTokens.slice(0, i + 1).join(' ');
            setActiveChat((prev) => {
              const updatedMessages = [
                ...prev.messages.slice(0, -1),
                assistantMessage,
              ];
              return { ...prev, messages: updatedMessages };
            })
          }, i * 100);
        }
        console.log("Final Assistant Message:", activeChat);
      } else {
        toast.error(data.message || "Failed to fetch response");
        setPrompt(trimmedPrompt);
      }
    } catch (error) {
      console.log(error)
      if(error.status === 429){
        setFreeRequests(error.response.data.requests)
        toast.error(error.response.data.message)
      }else{
        toast.error(error.message || "Failed to fetch response");
      }
      setPrompt(trimmedPrompt);
    } finally {
      setLoading(false);
    }
  }


  const limitCheck = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/limit');
      console.log("Limit Check Response:", response);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form
      className={`w-full ${activeChat?.messages.length > 0 ? "max-w-3xl" : "max-w-2xl"
        } bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
      onSubmit={handleSubmit}
    // onSubmit={limitCheck}
    >
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
        {/* search icon */}
        {/* <div className="flex items-center gap-2">
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.deepthink_icon} alt="" />
            DeepThink (R1)
          </p>
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
            <Image className="h-5" src={assets.search_icon} alt="" />
            Search (R1)
          </p>
        </div> */}

        <div className="flex items-center gap-2">
          <Image className="w-4 cursor-pointer" src={assets.pin_icon} alt="" />
          <button
            className={`${prompt ? "bg-primary" : "bg-[#71717a]"
              } rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt=""
            />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PromptBox;
