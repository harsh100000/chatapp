import { ChatState } from "../../Context/ChatProvider";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://127.0.0.1:3000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRation: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoadingMessages(true);
      const { data } = await axios.get(
        `http://127.0.0.1:3000/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoadingMessages(false);
      socket.emit("joinChat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast("Error fetching the messages");
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stopTyping", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://127.0.0.1:3000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("newMessage", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast("Failed to send message");
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messageRecieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTypingTime;
      if (timeDifference >= timerLength && typing) {
        socket.emit("stopTyping", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className="w-full">
      {selectedChat ? (
        <div>
          {!selectedChat.isGroupChat ? (
            <div className="flex justify-between">
              <div className="flex">
                <button
                  onClick={() => {
                    setSelectedChat(null)
                    window.history.back();
                  }}
                  className="md:hidden mr-2 text-4xl cursor-pointer"
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                <p className="text-2xl font-semibold p-2">
                  {getSender(user, selectedChat.users)}
                </p>
              </div>
              <div className="p-2">
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <button className="border px-4 py-2 rounded cursor-pointer bg-cyan-600 text-white">
                    View Profile
                  </button>
                </ProfileModal>
              </div>
            </div>
          ) : (
            <div className="flex justify-between">
              <div className="flex">
                <button
                  onClick={() => {
                    setSelectedChat(null)
                    window.history.back();
                  }}
                  className="md:hidden mr-2 text-4xl cursor-pointer"
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                <p className="text-2xl p-2 font-semibold">
                  {selectedChat.chatName}
                </p>
              </div>
              <div className="p-2">
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                >
                  <button className="border px-4 py-2 rounded cursor-pointer bg-cyan-600 text-white">
                    Group info
                  </button>
                </UpdateGroupChatModal>
              </div>
            </div>
          )}

          <div className="h-[calc(77vh-4rem)] flex flex-col min-h-0 ">
            <ScrollableChat messages={messages} />
          </div>

          <div className="flex items-center justify-evenly h-20">
            <div className="w-full">
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: "10px", marginTop:"10px", marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <input
                placeholder="Type a message"
                type="text"
                value={newMessage}
                onChange={typingHandler}
                className="border w-full md:w-[90%] rounded-4xl py-3 px-3 text-lg"
              />
            </div>
            <div>
              <button
                onClick={sendMessage}
                className={`border rounded-4xl  text-white ml-2 px-8 py-3 text-xl cursor-pointer ${!newMessage? "disabled bg-gray-400":"bg-green-700"}`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <h2 className="text-3xl font-serif">
            Click on a user to start chatting
          </h2>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
