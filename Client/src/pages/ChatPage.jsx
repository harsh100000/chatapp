import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user, selectedChat, setSelectedChat} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const handleBackButton = () => {
      if (selectedChat) {
        setSelectedChat(null);
      }
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [selectedChat]);

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <div className="flex flex-col md:flex-row h-[91.5vh] p-3 gap-2">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
