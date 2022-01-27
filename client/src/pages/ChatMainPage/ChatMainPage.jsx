import React, { useEffect } from "react";
import ChatMessages from "../components/chat/ChatMessages";
import UsersList from "../components/chat/UsersList";
import BottomPanel from "../components/chat/BottomPanel";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, selectUserId } from "../../app/userSlice";
import { privateRecipientSave, usersInChatSave } from "../../app/chatSlice";
import io from "socket.io-client";

import "./ChatMainPage.scss";

const ChatMainPage = () => {
  const dispatch = useAppDispatch();
  const nickname = useAppSelector(selectUserNickname);
  const userId = useAppSelector(selectUserId);

  const socket = io();

  useEffect(() => {
    let messagesContainer = document.querySelector(".chat-messages-box");

    socket.on("connect", () => {
      socket.emit("user connected", { nickname, userId });
    });

    socket.on("connected user info", (data) => {
      let enteringNotification = document.createElement("p");
      enteringNotification.setAttribute("class", "entering-notification");
      enteringNotification.innerHTML = `Пользователь <span>${data.nickname}</span> вошёл в чат.`;
      messagesContainer.appendChild(enteringNotification);
    });

    socket.on("users in room info", (newUsersInRoom) => {
      dispatch(usersInChatSave(newUsersInRoom));
    });

    socket.on("user disconnected", (disconnectedUser, newUsersInRoom) => {
      let exitingNotification = document.createElement("p");
      exitingNotification.setAttribute("class", "exiting-notification");
      exitingNotification.innerHTML = `Пользователь <span>${disconnectedUser}</span> вышел из чата.`;
      messagesContainer.appendChild(exitingNotification);

      dispatch(usersInChatSave(newUsersInRoom));
    });

    socket.on("message from user", (nickname, message) => {
      let userMessage = document.createElement("p");
      userMessage.setAttribute("class", "user-message");
      userMessage.innerHTML = `<span>${nickname}:</span> ${message}`;
      messagesContainer.appendChild(userMessage);
    });

    socket.on("private message from user", (nickname, privatemessage) => {
      let privateUserMessage = document.createElement("p");
      privateUserMessage.setAttribute("class", "user-message-private");
      privateUserMessage.innerHTML = `Лично от <span>${nickname}:</span> ${privatemessage}`;
      messagesContainer.appendChild(privateUserMessage);
    });

    socket.on(
      "private message notification",
      (privateUserNick, privatemessage) => {
        let privateNotification = document.createElement("p");
        privateNotification.setAttribute("class", "private-notification");
        privateNotification.innerHTML = `Лично для <span>${privateUserNick}:</span> ${privatemessage}`;
        messagesContainer.appendChild(privateNotification);
      }
    );

    socket.on("getting private user data", (targetUser) => {
      dispatch(privateRecipientSave(targetUser[0]));
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

  const privateModeSet = (nickname) => {
    console.log(nickname);
    socket.emit("getting users socketid", nickname);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-upper-wrapper">
        <UsersList privateModeSet={privateModeSet} />
        <ChatMessages />
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
