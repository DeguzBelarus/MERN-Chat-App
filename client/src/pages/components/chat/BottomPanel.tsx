import { useRef, FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectPrivateRecipient, privateRecipientSave, messagesInChatSave } from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./BottomPanel.scss"
interface Props {
   socket: any
}

export const BottomPanel: FC<Props> = ({ socket }) => {
   const messageInput: any = useRef(null);

   const dispatch = useAppDispatch();
   const navigate = useNavigate()
   const privateRecipient = useAppSelector(selectPrivateRecipient);
   const nickname = useAppSelector(selectUserNickname);
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const userSendMessage = (event: any) => {
      if (event.key === "Enter") {
         if (!privateRecipient) {
            if (!event.target.value) return;

            const message = event.target.value;
            socket.emit("user send message", nickname, message);

            event.target.value = "";
         } else {
            if (event.target.value === "") return;

            const privatemessage = event.target.value;
            const privateUserNick = privateRecipient[0];
            const privateUserSocket = privateRecipient[1];

            socket.emit(
               "user send private message",
               nickname,
               privatemessage,
               privateUserNick,
               privateUserSocket
            );

            event.target.value = "";
         }
      }
   };

   const sendMessageOnButton = () => {
      if (!privateRecipient) {
         const message = messageInput.current.value;
         if (!message) return;

         socket.emit("user send message", nickname, message);

         messageInput.current.value = "";
      } else {
         const privatemessage = messageInput.current.value;
         if (!privatemessage) return;

         const privateUserNick = privateRecipient[0];
         const privateUserSocket = privateRecipient[1];

         socket.emit(
            "user send private message",
            nickname,
            privatemessage,
            privateUserNick,
            privateUserSocket
         );

         messageInput.current.value = "";
      }
   };

   const privateModeOff = () => {
      dispatch(privateRecipientSave(null));
   };

   const chatExit = () => {
      dispatch(messagesInChatSave([]));
      dispatch(privateRecipientSave(null));
      navigate(`/usersroom/${nickname}`)
      socket.emit("user exit", nickname)
   };

   return (
      <div className="bottom-panel">

         <label htmlFor="message-input" className="message-input-label">
            <input type="text"
               id="message-input"
               placeholder={currentLanguage === "ru" ? "Введите сообщение..." : "Enter a message..."}
               autoComplete="off"
               onKeyPress={userSendMessage}
               ref={messageInput} />
            <span>{currentLanguage === "ru" ? "Введите сообщение..." : "Enter a message..."}</span>
            <div className="line"></div>
         </label>

         <div className="bottom-buttons">

            {privateRecipient && (
               <div className="private-info" onClick={privateModeOff}>
                  <span>
                     {currentLanguage === "ru"
                        ? `Лично для: ${privateRecipient[0]}`
                        : `Privately for: ${privateRecipient[0]}`}
                  </span>
               </div>
            )}

            <button type="button"
               className="button-send-message"
               onClick={sendMessageOnButton}
            >{currentLanguage === "ru" ? "Отправить" : "Send"}</button>

            <button type="button"
               className="button-exit"
               onClick={chatExit}
            >{currentLanguage === "ru" ? "Выйти" : "Quit"}</button>
         </div>
      </div>
   );
};