import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectMessagesInChat,
  messagesInChatSave,
} from "../../../app/chatSlice";

const ChatMessages = ({ socket }) => {
  const messagesBox = useRef(null);
  const dispatch = useAppDispatch();
  let messagesInChat = useAppSelector(selectMessagesInChat);

  useEffect(() => {
    socket.on("connected user info", (data) => {
      const enteringNotification = ["enn", data.nickname];
      messagesInChat = [...messagesInChat, enteringNotification];
      dispatch(messagesInChatSave(messagesInChat));
    });

    socket.on("user disconnected", (disconnectedUser) => {
      const exitingNotification = ["exn", disconnectedUser];
      messagesInChat = [...messagesInChat, exitingNotification];
      dispatch(messagesInChatSave(messagesInChat));
    });

    socket.on("message from user", (nickname, message) => {
      const userMessage = ["um", nickname, message];
      messagesInChat = [...messagesInChat, userMessage];
      dispatch(messagesInChatSave(messagesInChat));
      console.log(messagesInChat);
    });

    socket.on("private message from user", (nickname, privatemessage) => {
      const userMessagePrivate = ["ump", nickname, privatemessage];
      messagesInChat = [...messagesInChat, userMessagePrivate];
      dispatch(messagesInChatSave(messagesInChat));
      console.log(messagesInChat);
    });

    socket.on(
      "private message notification",
      (privateUserNick, privatemessage) => {
        const privateMessageNotification = [
          "pmn",
          privateUserNick,
          privatemessage,
        ];
        messagesInChat = [...messagesInChat, privateMessageNotification];
        dispatch(messagesInChatSave(messagesInChat));
        console.log(messagesInChat);
      }
    );
  }, []);

  useEffect(() => {
    messagesBox.current.scrollTo(0, 9999);

    if (messagesInChat.length > 1300) {
      messagesInChat = messagesInChat.slice(300, messagesInChat.length);
      dispatch(messagesInChatSave(messagesInChat));
    }
  }, [messagesInChat]);

  return (
    <div className="chat-messages-box" ref={messagesBox}>
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
        } else if (message[0] === "um") {
          return (
            <p className="user-message" key={index}>
              <span>{message[1]}:</span> {message[2]}
            </p>
          );
        } else if (message[0] === "ump") {
          return (
            <p className="user-message-private" key={index}>
              <span>{`Лично от ${message[1]}: `}</span> {message[2]}
            </p>
          );
        } else if (message[0] === "pmn") {
          return (
            <p className="private-notification" key={index}>
              <span>{`Лично для ${message[1]}: `}</span> {message[2]}
            </p>
          );
        }
      })}
    </div>
  );
};

export default ChatMessages;
