import React, { useEffect } from "react";
import ChatMessages from "../components/chat/ChatMessages";
import UsersList from "../components/chat/UsersList";
import BottomPanel from "../components/chat/BottomPanel";
import { useAppSelector } from "../../app/hooks";
import { selectUserNickname, selectUserId } from "../../app/userSlice";
import io from "socket.io-client";
import "./ChatMainPage.scss";

const ChatMainPage = () => {
  const nickname = useAppSelector(selectUserNickname);
  const userId = useAppSelector(selectUserId);

  const socket = io();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("user connected", { nickname, userId });
    });
  }, []);

  const userSendMessage = (message) => {
    socket.emit("user send message", nickname, message);
  };

  const userSendPrivateMessage = (
    privatemessage,
    privateUserNick,
    privateUserSocket
  ) => {
    socket.emit(
      "user send private message",
      nickname,
      privatemessage,
      privateUserNick,
      privateUserSocket
    );
  };

  const sendMessageOnButton = (message) => {
    socket.emit("user send message", nickname, message);
  };

  const sendPrivateMessageOnButton = (
    privatemessage,
    privateUserNick,
    privateUserSocket
  ) => {
    socket.emit(
      "user send private message",
      nickname,
      privatemessage,
      privateUserNick,
      privateUserSocket
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-upper-wrapper">
        <UsersList socket={socket} />
        <ChatMessages socket={socket} />
      </div>
      <BottomPanel
        userSendMessage={userSendMessage}
        sendMessageOnButton={sendMessageOnButton}
        userSendPrivateMessage={userSendPrivateMessage}
        sendPrivateMessageOnButton={sendPrivateMessageOnButton}
      />
    </div>
  );
};

export default ChatMainPage;
