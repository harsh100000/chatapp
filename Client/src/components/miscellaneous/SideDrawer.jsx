import { useState, useEffect, useRef } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import { toast } from "react-toastify";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [notificationListOpen, setNotificationListOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOptionsOpen, setProfileOptionsOpen] = useState(false);
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/chat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (error) {
      console.log(error.message);
      toast("Unable to access chat");
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast("Enter something to search");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/user/login?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast(error.response.data.message);
      return;
    }
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileOptionsOpen(false);
        setNotificationListOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between px-3 py-2 bg-gray-800 h-16 text-white">
        <div className="relative">
          <input
            type="text"
            onClick={() => setDrawerOpen(true)}
            placeholder="Search User"
            className="pl-10 pr-4 py-2 w-full border text-white border-gray-700 rounded-lg "
          />

          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="ri-search-line"></i>
          </div>
        </div>

        <div>
          <h2 className="text-3xl">Talk-A-Tive</h2>
        </div>

        <div ref={menuRef} className="relative inline-block text-left">
          <div
            className="relative inline-block"
            onClick={() => setNotificationListOpen(!notificationListOpen)}
          >
            <i
              className="ri-notification-2-fill cursor-pointer"
              style={{ fontSize: "32px", paddingRight: "15px" }}
            ></i>

            {notification.length > 0 && <span className="absolute top-1.5 right-3 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center">
              {notification.length}
            </span>}
          </div>
          <button
            onClick={() => setProfileOptionsOpen(!profileOptionsOpen)}
            className="cursor-pointer inline-flex items-center gap-4 rounded-md bg-blue-600 px-4 py-0.5 text-white hover:bg-blue-700"
          >
            <img
              className="w-10 h-10 rounded-full cusror-pointer"
              src={user.profilePicture}
              alt="Rounded avatar"
            />
            <span
              className={`transition-transform ${
                profileOptionsOpen ? "rotate-180" : ""
              }`}
            >
              <i className="ri-arrow-down-s-line"></i>
            </span>
          </button>

          {notificationListOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg">
              <ul className="py-1 text-sm text-gray-700">
                {!notification.length && (
                  <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    No new message
                  </li>
                )}
                {notification.map((notif) => (
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {profileOptionsOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg">
              <ul className="py-1 text-sm text-gray-700">
                <ProfileModal user={user}>
                  <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </li>
                </ProfileModal>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-red-100 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div>
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />
        )}

        <div
          className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Search User</h2>

            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full border rounded px-3 py-2"
            />
            <button
              className="border px-3 py-1 rounded mt-3 w-full cursor-pointer bg-green-400 mb-3"
              onClick={handleSearch}
            >
              Search
            </button>
            {loading ? (
              <h2 className="text-lg text-center font-semibold mb-4">
                Loading...
              </h2>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
