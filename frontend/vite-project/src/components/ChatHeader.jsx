import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChartStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChartStore();
  const { OnlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300 w-full">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {OnlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="">

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;