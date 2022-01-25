import React, { useEffect } from "react";
import ChatMessages from "../components/chat/ChatMessages";
import UsersList from "../components/chat/UsersList";
import BottomPanel from "../components/chat/BottomPanel";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, selectUserId } from "../../app/userSlice";
import { messageFunctionSave } from "../../app/chatSlice";
import io from "socket.io-client";

import "./ChatMainPage.scss";

const ChatMainPage = () => {
  const dispatch = useAppDispatch();
  const nickname = useAppSelector(selectUserNickname);
  const userId = useAppSelector(selectUserId);

  const socket = io();

  useEffect(() => {
    let messagesContainer = document.querySelector(".chat-messages-box");
    let usersContainer = document.querySelector(".userslist-box");

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
      usersContainer.innerHTML = "";
      newUsersInRoom.sort().map((user) => {
        let userBox = document.createElement("div");
        userBox.setAttribute("class", "user-box");

        if (user === "Deguz") {
          userBox.innerText = user + " (админ)";
          userBox.setAttribute("class", "user-box-admin");
        } else if (user === "NightOwl") {
          userBox.innerText = user + " (ментор)";
          userBox.setAttribute("class", "user-box-mentor");
        } else {
          userBox.innerText = user;
        }

        usersContainer.appendChild(userBox);
      });
    });

    socket.on("user disconnected", (disconnectedUser, newUsersInRoom) => {
      let exitingNotification = document.createElement("p");
      exitingNotification.setAttribute("class", "exiting-notification");
      exitingNotification.innerHTML = `Пользователь <span>${disconnectedUser}</span> вышел из чата.`;
      messagesContainer.appendChild(exitingNotification);

      usersContainer.innerHTML = "";
      newUsersInRoom.sort().map((user) => {
        let userBox = document.createElement("div");
        userBox.setAttribute("class", "user-box");

        if (user === "Deguz") {
          userBox.innerText = user + " (админ)";
          userBox.setAttribute("class", "user-box-admin");
        } else if (user === "NightOwl") {
          userBox.innerText = user + " (ментор)";
          userBox.setAttribute("class", "user-box-mentor");
        } else {
          userBox.innerText = user;
        }

        usersContainer.appendChild(userBox);
      });
    });

    socket.on("message from user", (nickname, message) => {
      let userMessage = document.createElement("p");
      userMessage.setAttribute("class", "user-message");
      userMessage.innerHTML = `<span>${nickname}:</span> ${message}`;
      messagesContainer.appendChild(userMessage);
    });
  }, []);

  const userSendMessage = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") return;

      let message = event.target.value;
      socket.emit("user send message", nickname, message);

      event.target.value = "";
    }
  };

  const sendMessageOnButton = (message) => {
    socket.emit("user send message", nickname, message);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-upper-wrapper">
        <UsersList />
        <ChatMessages />
      </div>
      <BottomPanel
        userSendMessage={userSendMessage}
        sendMessageOnButton={sendMessageOnButton}
      />
    </div>
  );
};

export default ChatMainPage;
