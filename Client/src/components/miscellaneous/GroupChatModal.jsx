import { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { toast } from "react-toastify";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const GroupChatModal = ({ children }) => {
  const [groupChatModalOpen, setGroupChatModalOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3000/api/user/login?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast("Error fetching the users");
    }
  };

  const handleSubmit = async () => {
    if(!groupChatName || selectedUsers.length===0){
      toast("Please fill all the fields")
      return
    }
    try {
      const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post("http://localhost:3000/api/chat/group", 
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u)=>u._id))
        }, 
      config)
      setChats([data, ...chats])
      setGroupChatModalOpen(false)
      setGroupChatName("")
      setSearch("")
      setSearchResult([])
      setSelectedUsers([])
      toast("New group chat created")
    } 
    catch (error) {
      toast(error.response.message)  
    }
  };

  const addUserToGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
      toast("User already added")
      return
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const removeUserFromGroup = (userToRemove) =>{
    setSelectedUsers(selectedUsers.filter((user)=>user._id !== userToRemove._id))
  }

  return (
    <div>
      <span
        onClick={() => setGroupChatModalOpen(true)}
        className="cursor-pointer"
      >
        {children}
      </span>
      {groupChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg lg:w-[30vw] md:w-[70vw] h-[70vh] p-6 flex flex-col items-center">
            <div className="relative pb-3 w-full text-center">
              <h3 className="text-4xl font-semibold mb-3">Create a Group</h3>
              <button
                onClick={() => setGroupChatModalOpen(false)}
                className="absolute cursor-pointer right-0 top-0 p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Group Name"
                required
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
              />
              <input
                type="text"
                value={search}
                required
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
              />
              <div className="flex flex-row">
                {
                  selectedUsers.map((user)=>(
                    <span key={user._id} className="bg-yellow-300 mr-1 px-3 py-1 rounded">{user.name}{" "}<button className="cursor-pointer" onClick={()=>(removeUserFromGroup(user))}>✕</button></span>
                  ))
                }
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="w-full overflow-y-auto rounded px-3 py-2 mb-3">
                  {searchResult?.slice(0, 4).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => addUserToGroup(user)}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="border bg-emerald-600 text-white px-3 py-2 rounded mt-3 cursor-pointer"
            >
              Create group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChatModal;
