import { useEffect, FC, useRef, useTransition, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectMessagesInChat, messagesInChatSave } from "../../../app/chatSlice";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./ChatMessages.scss"
interface Props {
   fileBoxImageOpening: any
}

export const ChatMessages: FC<Props> = ({ fileBoxImageOpening }) => {
   const messagesBox: any = useRef(null);

   const dispatch = useAppDispatch();
   let messagesInChat = useAppSelector(selectMessagesInChat);
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const [isPending, startTransition] = useTransition();

   useEffect(() => {
      messagesBox.current.scrollTo(0, 9999);

      if (messagesInChat.length > 1800) {
         startTransition(() => {
            messagesInChat = messagesInChat.slice(300, messagesInChat.length);
            dispatch(messagesInChatSave(messagesInChat));
         });
      }
   }, [messagesInChat]);

   return (
      <div className="chat-messages-box" ref={messagesBox}>

         {messagesInChat.map((message, index) => {
            if (message[0] === "enn") {
               return (
                  currentLanguage === "ru"
                     ? <p className="entering-notification" key={index}>
                        Пользователь <span>{message[1]}</span> вошёл в чат
                     </p>
                     : <p className="entering-notification" key={index}>
                        User <span>{message[1]}</span> entered the chat
                     </p>
               );
            } else if (message[0] === "exn") {
               return (
                  currentLanguage === "ru"
                     ? <p className="exiting-notification" key={index}>
                        Пользователь <span>{message[1]}</span> вышел из чата
                     </p>
                     : <p className="exiting-notification" key={index}>
                        User <span>{message[1]}</span> left the chat
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
                  currentLanguage === "ru"
                     ? <p className="user-message-private" key={index}>
                        <span>{`Лично от ${message[1]}: `}</span> {message[2]}
                     </p>
                     : <p className="user-message-private" key={index}>
                        <span>{`Personally from ${message[1]}: `}</span> {message[2]}
                     </p>
               );
            } else if (message[0] === "pmn") {
               return (
                  currentLanguage === "ru"
                     ? <p className="private-notification" key={index}>
                        <span>{`Лично для ${message[1]}: `}</span> {message[2]}
                     </p>
                     : <p className="private-notification" key={index}>
                        <span>{`Personally for ${message[1]}: `}</span> {message[2]}
                     </p>
               );
            } else if (message[0] === "pmd") {
               return (
                  currentLanguage === "ru"
                     ? <p className="private-notdelivered-notification" key={index}>
                        Пользователя <span>{message[1]}</span> нет в чате
                     </p>
                     : <p className="private-notdelivered-notification" key={index}>
                        User <span>{message[1]}</span> is not in the chat
                     </p>
               )
            }
            else if (message[0] === "AFK") {
               return (
                  currentLanguage === "ru"
                     ? <p className="user-AFK-notification" key={index}>
                        Пользователь <span>{message[1]}</span> отошел
                     </p>
                     : <p className="user-AFK-notification" key={index}>
                        User <span>{message[1]}</span> is AFK
                     </p>
               )
            } else if (message[0] === "notAFK") {
               return (
                  currentLanguage === "ru"
                     ? <p className="user-notAFK-notification" key={index}>
                        Пользователь <span>{message[1]}</span> вернулся
                     </p>
                     : <p className="user-notAFK-notification" key={index}>
                        User <span>{message[1]}</span> has returned
                     </p>
               )
            } else if (message[0] === "ui") {
               return (
                  <div className="user-image" key={index}>
                     <div className="upper-part">
                        <span>{message[1]}:</span>
                     </div>
                     <img src={message[2]} alt={currentLanguage === "ru"
                        ? `файл изображения от пользователя ${message[1]}`
                        : `picture from user ${message[1]}`} onClick={fileBoxImageOpening} />
                  </div>
               );
            } else if (message[0] === "umi") {
               return (
                  <div className="user-message-image" key={index}>
                     <div className="upper-part">
                        <span>{message[1]}:</span>{message[3]}
                     </div>
                     <img src={message[2]} alt={currentLanguage === "ru"
                        ? `файл изображения от пользователя ${message[1]}`
                        : `picture from user ${message[1]}`} onClick={fileBoxImageOpening} />
                  </div>
               );
            } else if (message[0] === "uip") {
               return (
                  currentLanguage === "ru"
                     ? <div className="user-image-private" key={index}>
                        <div className="upper-part">
                           <span>{`Лично от ${message[1]}: `}</span>
                        </div>
                        <img src={message[2]} alt={`файл изображения от пользователя ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
                     : <div className="user-image-private" key={index}>
                        <div className="upper-part">
                           <span>{`Personally from ${message[1]}: `}</span>
                        </div>
                        <img src={message[2]} alt={`picture from user ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
               );
            } else if (message[0] === "pin") {
               return (
                  currentLanguage === "ru"
                     ? <div className="user-image-private-notification" key={index}>
                        <div className="upper-part">
                           <span>{`Лично для ${message[1]}: `}</span>
                        </div>
                        <img src={message[2]} alt={`файл изображения от пользователя ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
                     : <div className="user-image-private-notification" key={index}>
                        <div className="upper-part">
                           <span>{`Personally for ${message[1]}: `}</span>
                        </div>
                        <img src={message[2]} alt={`picture from user ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
               );
            } else if (message[0] === "umip") {
               return (
                  currentLanguage === "ru"
                     ? <div className="user-message-image-private" key={index}>
                        <div className="upper-part">
                           <span>{`Лично от ${message[1]}: `}</span>{message[3]}
                        </div>
                        <img src={message[2]} alt={`файл изображения от пользователя ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
                     : <div className="user-message-image-private" key={index}>
                        <div className="upper-part">
                           <span>{`Personally from ${message[1]}: `}</span>{message[3]}
                        </div>
                        <img src={message[2]} alt={`picture from user ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
               );
            } else if (message[0] === "pmin") {
               return (
                  currentLanguage === "ru"
                     ? <div className="user-message-image-private-notification" key={index}>
                        <div className="upper-part">
                           <span>{`Лично для ${message[1]}: `}</span>{message[3]}
                        </div>
                        <img src={message[2]} alt={`файл изображения от пользователя ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
                     : <div className="user-message-image-private-notification" key={index}>
                        <div className="upper-part">
                           <span>{`Personally for ${message[1]}: `}</span>{message[3]}
                        </div>
                        <img src={message[2]} alt={`picture from user ${message[1]}`}
                           onClick={fileBoxImageOpening} />
                     </div>
               );
            }
         })}
      </div>
   );
};