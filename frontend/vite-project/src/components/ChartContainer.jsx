import { useChartStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
// import {useAuthStore} from "../store/useAuthStore.js"
import ChartHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils.js";
import { useAuthStore } from "../store/useAuthStore.js";

export const ChartContainer = () => {
  const {
    messages,
    selectedUser,
    getMessages,
    isMessageLoading,
    subscribeToMessages,
    // tosomeoneelseTimedMessages,
    // tometimedMessages,
    // recievertimedMessages,
    // senderTimedMessages,
    unsubscribeFromMessages,
  } = useChartStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      // senderTimedMessages();
      // recievertimedMessages();

      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log(messages);
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChartHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <ChartHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              {message.isTimed && message.senderId === authUser._id ? (
                <div>
                  <div className="text-sm text-yellow-500 italic mb-1">
                    Scheduled for:{" "}
                    {new Date(message.scheduledTime).toLocaleString()}
                  </div>
                  {/* {console.log("Rendering message:", message)} */}

                  <div className=" chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || "/avatar.png"
                            : selectedUser.profilePic || "/avatar.png"
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>
                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                  <div className="chat-bubble flex flex-col">
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-50 rounded-md mb-2"
                      />
                    )}
                   
                    {message.text && <p>{message.text}</p>}
                  
                    {message.vedio && (
                      <video controls height={"500px"} width={"500px"} className="sm:max-w-50 rounded-md mb-2">
                        <source src={message.vedio} type="video/mp4" />
                      </video>
                      
                    )}  
                  </div>
                </div>
              ) : null}

              {!message.isTimed && (
                <div className="chat-message">
                  <div className=" chat-image avatar flex items-end">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          message.senderId === authUser._id
                            ? authUser.profilePic || "/avatar.png"
                            : selectedUser.profilePic || "/avatar.png"
                        }
                        alt="profile pic"
                      />
                    </div>
                  </div>
                  <div className="chat-header mb-1">
                    <time className="text-xs opacity-50 ml-1">
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                  <div className="chat-bubble flex flex-col">
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-50 rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                    {message.vedio && (
                      <video controls  className="sm:max-w-50 rounded-md mb-2">
                        <source src={message.vedio} type="video/mp4" />
                      </video>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    </>
  );
};
