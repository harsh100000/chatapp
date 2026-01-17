import SingleChat from "./SingleChat";
import { ChatState } from "../../Context/ChatProvider";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <div
      className={`w-full md:flex-1 rounded-lg p-1 flex ${
        selectedChat ? "flex" : "hidden md:flex"
      }`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
