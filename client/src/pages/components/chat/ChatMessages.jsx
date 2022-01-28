import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectMessagesInChat,
  messagesInChatSave,
} from "../../../app/chatSlice";

const ChatMessages = ({ socket }) => {
  const dispatch = useAppDispatch();
  let messagesInChat = useAppSelector(selectMessagesInChat);

  useEffect(() => {
    socket.on("connected user info", (data) => {
      const enteringNotification = ["enn", data.nickname];
      messagesInChat = [...messagesInChat, enteringNotification];
      dispatch(messagesInChatSave(messagesInChat));
      console.log(messagesInChat);
    });

    socket.on("user disconnected", (disconnectedUser) => {
      const exitingNotification = ["exn", disconnectedUser];
      messagesInChat = [...messagesInChat, exitingNotification];
      dispatch(messagesInChatSave(messagesInChat));
      console.log(messagesInChat);
    });
  }, []);

  return (
    <div className="chat-messages-box">
      {messagesInChat.map((message, index) => {
        if (message[0] === "enn") {
          return (
            <p className="entering-notification" key={index}>
              Пользователь <span>{message[1]}</span> вошёл в чат
            </p>
          );
        } else if (message[0] === "exn") {
          return (
            <p className="exiting-notification" key={index}>
              Пользователь <span>{message[1]}</span> вышел из чата
            </p>
          );
        }
      })}
    </div>
  );
};

export default ChatMessages;
