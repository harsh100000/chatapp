import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogic";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed className="h-full overflow-y-auto">
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <img
                className="w-8 h-8 mt-2 mr-2 rounded-full"
                src={m.sender.profilePicture}
              />
            )}
            <span
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i) ? 3 : 8,
              }}
              className={`p-1 px-3 mb-1 ${
                m.sender._id === user._id ? "bg-blue-200 " : "bg-green-200"
              }
              rounded-2xl inline-block w-fit max-w-[75%] min-w-40`}
            >
              {m.content}
              <span className="flex flex-col items-end pt-1 text-sm">
                {new Date(m.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
