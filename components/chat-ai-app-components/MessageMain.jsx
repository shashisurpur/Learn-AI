import { useAppContext } from '@/context/AppContext';
import React, { useEffect, useState } from 'react'
import Message from './Message';

const MessageMain = () => {
      const [messages, setMessages] = useState([]);
    
      const { activeChat } = useAppContext();

      useEffect(() => {
        if (activeChat) {
          setMessages(activeChat.messages);
        }
      }, [activeChat]);

    return (
        <>
            {
                messages.map((msg, index) => (
                    <Message key={index} role={msg.role} content={msg.content} />
                ))
            }
        </>
    )
}

export default MessageMain
