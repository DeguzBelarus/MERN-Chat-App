import React from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectUserNickname, selectUserId } from "../app/userSlice";
import io from "socket.io-client";

export const useSocket = () => {
  const dispatch = useAppDispatch();

  const nickname = useAppSelector(selectUserNickname);
  const userId = useAppSelector(selectUserId);

  const chatEnter = () => {
    const socket = io();

    socket.on("connect", () => {
      socket.emit("user connected", { nickname, userId });
    });

    socket.on("connected user info", (data) => {
      let messagesContainer = document.querySelector(".chat-messages-box");
      let usersContainer = document.querySelector(".userslist-box");

      let enteringNotification = document.createElement("p");
      enteringNotification.setAttribute("class", "entering-notification");
      enteringNotification.innerText = `Пользователь ${data.nickname} вошёл в чат.`;
      messagesContainer.appendChild(enteringNotification);

      socket.on("users in room info", (newUsersInRoom) => {
        usersContainer.innerHTML = "";
        newUsersInRoom.sort().map((user) => {
          let userBox = document.createElement("div");
          userBox.setAttribute("class", "user-box");
          userBox.innerText = user;

          usersContainer.appendChild(userBox);
        });
      });

      socket.on("user disconnected", (disconnectedUser, newUsersInRoom) => {
        let exitingNotification = document.createElement("p");
        exitingNotification.setAttribute("class", "exiting-notification");
        exitingNotification.innerText = `Пользователь ${disconnectedUser} вышел из чата.`;
        messagesContainer.appendChild(exitingNotification);

        usersContainer.innerHTML = "";
        newUsersInRoom.sort().map((user) => {
          let userBox = document.createElement("div");
          userBox.setAttribute("class", "user-box");
          userBox.innerText = user;

          usersContainer.appendChild(userBox);
        });
      });
    });
  };

  return { chatEnter };
};
