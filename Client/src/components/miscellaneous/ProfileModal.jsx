import { useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  return (
    <div>
      <span
        onClick={() => setProfileModalOpen(true)}
        className="cursor-pointer"
      >
        {children}
      </span>
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 flex flex-col items-center">
            <div className="relative pb-3 w-full text-center">
              <h3 className="text-4xl font-semibold">Profile</h3>

              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-3xl absolute cursor-pointer right-0 top-0 p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div>
              <img
                src={user.profilePicture}
                className="rounded-full border-4 border-red-600 w-56"
                alt="User Profile Pic"
              />
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xl">Name: {user.name}</p>
              <p className="text-xl">Email: {user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
