import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { set } from "mongoose";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
  const {chats, setActiveChat, fetchUserChats} = useAppContext();


  const handleChatClick = async(chat) => {
    const chatData = chats.find((chat) => chat._id === id);
    setActiveChat(chatData);
  }

  const renameHandler = async() => {
    //add rename functionality here
    try {
      const newName = prompt("Enter new chat name", name);
      if(!newName || newName.trim() === "" || newName === name) return;
      const {data} = await axios.post('/api/chat/rename', {chatId: id, newName});

      if(data.success){
        fetchUserChats();
        setOpenMenu({id:0, open:false});
        toast.success("Chat renamed successfully");
      }else{
        toast.error(data.message || "Failed to rename chat");
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename chat");
    }
  }
  
  const deleteHandler = async() => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this chat?");
      if(!confirm) return;
      const {data} = await axios.post('/api/chat/delete', {chatId: id});

      if(data.success){
        fetchUserChats();
        setOpenMenu({id:0, open:false});
        toast.success("Chat deleted successfully");
      }else{
        toast.error(data.message || "Failed to delete chat");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete chat");
    }
  }

  return (
    <div
      onClick={() => handleChatClick(id)}
      className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
    >
      <p className="group-hover:max-w-5/6 truncate">{name}</p>
      <div 
      onClick={(e) => {
        e.stopPropagation();
        setOpenMenu((prev) => (prev.id === id ? { id: 0, open: !prev.open } : { id: id, open: true }));
      }}
      className="group relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/80 rounded-lg">
        <Image
          className={`w-4 ${openMenu.id === id && openMenu.open ? "" : "hidden"} group-hover:block`}
          src={assets.three_dots}
          alt=""
        />
        <div
          className={`absolute -right-36 top-6 bg-gray-700 rounded-xl w-max p-2 ${
            openMenu.id === id && openMenu.open ? "block" : "hidden"
          }`}
        >
          <div
            onClick={renameHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <Image className="w-4" src={assets.pencil_icon} alt="" />
            <p>Rename</p>
          </div>
          <div
            onClick={deleteHandler}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
          >
            <Image className="w-4" src={assets.delete_icon} alt="" />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLabel;
