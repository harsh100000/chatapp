import axios from 'axios'
import { useEffect, useState } from 'react'

const ChatPage = () => {
  const [chats, setChats] = useState([])
  
  const fetchChats = async () =>{
    const {data} = await axios.get("http://127.0.0.1:3000/api/chats")
    setChats(data)
  }

  useEffect(() => {
    fetchChats()
  }, [])
  

  return (
    <div>
      {
        chats.map((chat) =>(
          <p key={chat._id}>{chat.chatName}</p>
        ))
      }
    </div>
  )
}

export default ChatPage