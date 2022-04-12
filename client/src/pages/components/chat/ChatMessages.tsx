import { useEffect, FC, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectMessagesInChat, messagesInChatSave } from "../../../app/chatSlice";

const ChatMessages: FC = () => {
   const messagesBox: any = useRef(null);

   const dispatch = useAppDispatch();
   let messagesInChat = useAppSelector(selectMessagesInChat);

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
