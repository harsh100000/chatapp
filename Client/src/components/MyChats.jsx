import { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { getSender, getSenderFull } from "../config/ChatLogic";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://127.0.0.1:3000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast("Failed to load the chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`flex flex-col items-center bg-white
    w-full md:w-[30%]
    ${selectedChat ? "hidden md:flex" : "flex"}`}
    >
      <div className="flex flex-row items-center justify-between p-3 border-b w-full mb-3">
        <p className="text-2xl font-semibold">Chats</p>
        <GroupChatModal>
          <button
            type="button"
            className="border rounded px-2.5 py-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-800 text-white"
          >
            Create Group
          </button>
        </GroupChatModal>
      </div>

      <div className=" w-full overflow-y-scroll">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => {
              setSelectedChat(chat);
              window.history.pushState({ chatOpen: true }, "", "");
            }}
            className={`flex w-full flex-row items-center hover:bg-gray-100 rounded cursor-pointer p-2 ${
              selectedChat === chat ? "bg-gray-300" : ""
            }`}
          >
            <img
              className="w-10 h-10 rounded-full mr-2"
              src={
                chat.isGroupChat
                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEw6vYhhVoqghNjZtcDLU-UXcBeejm_hy_PQ&s"
                  : getSenderFull(loggedUser, chat.users).profilePicture
              }
              alt="Rounded avatar"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">
                {chat.isGroupChat
                  ? chat.chatName
                  : getSender(loggedUser, chat.users)}
              </p>
              <p className="text-sm">
                {chat.latestMessage ? chat.latestMessage.content : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyChats;
