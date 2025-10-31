"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user, isLoaded } = useUser();

  console.log("Clerk User:", user, isLoaded);
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [freeRequests, setFreeRequests] = useState(0);
  const [loadingChats, setLoadingChats] = useState(false);

  const createNewChat = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
        // return null;
      }
      const token = await getToken();

      await axios.post('/api/chat/create', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUserChats();
    } catch (error) {
      toast.error(error.message || "Failed to create chat");
    }
  }

  const fetchUserChats = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get('/api/chat/get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success) {
        toast.error(data.message || "Failed to fetch user chats");
        return;
      }
      setChats(data.chats);
      if (data.chats.length === 0) {
        await createNewChat();
        return fetchUserChats();
      }
      setActiveChat(data.chats[0]);


    } catch (error) {
      toast.error(error.message || "Failed to fetch user chats");
    }
  }

  const getGuestLimit = async() => {
    try{
      const {data} = await axios.get('/api/limit')
      console.log('Guest limit',data)
      if(data.success){
        setFreeRequests(data.requests)
      }
    }catch(error){
      console.log(error,'Failed to get guest limit')
    }
  }


  // useEffect(() => {
  //   if (user) {
  //     setLoadingChats(true);
  //     fetchUserChats();
  //   }

  //   if (!user) {
  //     // setLoadingChats(false)
  //     setActiveChat(null)
  //     setChats([])

  //   }
  //   return () => {

  //   }
  // }, [user]);


  // useEffect(() => {
  //   if (!user) {
  //     getGuestLimit()
  //   }
  // }, [])

  const value = {
    user,
    chats,
    setChats,
    activeChat,
    setActiveChat,
    loadingChats,
    createNewChat,
    fetchUserChats,
    freeRequests,
    setFreeRequests,
    setLoadingChats,
    getGuestLimit
  };
  console.log(freeRequests, 'free')
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
