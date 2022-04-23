import { useRef, FC, useState } from "react";
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
   const messageInput: any = useRef(null)
   const fileInput: any = useRef(null)
   const sendFileButton: any = useRef(null)

   const dispatch = useAppDispatch()
   const navigate = useNavigate()
   const privateRecipient = useAppSelector(selectPrivateRecipient)
   const nickname = useAppSelector(selectUserNickname)
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const [sendFileMode, setSendFileMode]: any = useState(false)

   const sendFileModeSet = (event: any) => {
      sendFileButton.current.style.backgroundColor = "white"
      sendFileButton.current.innerText = "File"
      fileInput.current.value = null

      if (sendFileMode) {
         setSendFileMode(false)
      } else {
         setSendFileMode(true)
      }
   }

   const selectFile = (event: any) => {
      sendFileButton.current.style.backgroundColor = "yellowgreen"
      sendFileButton.current.innerText = "📎"
      messageInput.current.focus()
   }

   const userSendMessage = (event: any) => {
      if (event.key === "Enter") {
         if (!privateRecipient) {
            if (!event.target.value && !fileInput.current.files.length) return;

            if (event.target.value && !fileInput.current.files.length) {
               const message = event.target.value;
               socket.emit("user send message", nickname, message);

               event.target.value = "";
            } else if (!event.target.value && fileInput.current.files.length) {
               const image = fileInput.current.files[0]
               socket.emit("user send image", nickname, image)

               fileInput.current.value = null
               sendFileButton.current.style.backgroundColor = "white"
               sendFileButton.current.innerText = "File"
            } else if (event.target.value && fileInput.current.files.length) {
               const message = event.target.value;
               const image = fileInput.current.files[0]
               socket.emit("user send message with image", nickname, image, message)

               event.target.value = "";
               fileInput.current.value = null
               sendFileButton.current.style.backgroundColor = "white"
               sendFileButton.current.innerText = "File"
            }
         } else {
            if (!event.target.value && !fileInput.current.files.length) return;

            if (event.target.value && !fileInput.current.files.length) {
               const privatemessage = event.target.value;
               const privateUserNick = privateRecipient[0];
               const privateUserSocket = privateRecipient[1];

               socket.emit(
                  "user send private message",
                  nickname,
                  privatemessage,
                  privateUserNick,
                  privateUserSocket);

               event.target.value = "";
            } else if (!event.target.value && fileInput.current.files.length) {
               const privateImage = fileInput.current.files[0]
               const privateUserNick = privateRecipient[0];
               const privateUserSocket = privateRecipient[1];

               socket.emit("user send private image",
                  nickname,
                  privateImage,
                  privateUserNick,
                  privateUserSocket);

               fileInput.current.value = null
               sendFileButton.current.style.backgroundColor = "white"
               sendFileButton.current.innerText = "File"
            } else if (event.target.value && fileInput.current.files.length) {
               const privateImage = fileInput.current.files[0]
               const privatemessage = event.target.value;
               const privateUserNick = privateRecipient[0];
               const privateUserSocket = privateRecipient[1];

               socket.emit(
                  "user send private message with image",
                  nickname,
                  privateImage,
                  privatemessage,
                  privateUserNick,
                  privateUserSocket);

               event.target.value = "";
               fileInput.current.value = null
               sendFileButton.current.style.backgroundColor = "white"
               sendFileButton.current.innerText = "File"
            }
         }
      }
   }

   const sendMessageOnButton = () => {
      if (!privateRecipient) {
         const message = messageInput.current.value;
         if (!message && !fileInput.current.files.length) return;

         if (message && !fileInput.current.files.length) {
            socket.emit("user send message", nickname, message);

            messageInput.current.value = "";
         } else if (!message && fileInput.current.files.length) {
            const image = fileInput.current.files[0]
            socket.emit("user send image", nickname, image)

            fileInput.current.value = null
            sendFileButton.current.style.backgroundColor = "white"
            sendFileButton.current.innerText = "File"
         } else if (message && fileInput.current.files.length) {
            const image = fileInput.current.files[0]
            socket.emit("user send message with image", nickname, image, message)

            messageInput.current.value = "";
            fileInput.current.value = null
            sendFileButton.current.style.backgroundColor = "white"
            sendFileButton.current.innerText = "File"
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
      }
   }

   const privateModeOff = () => {
      dispatch(privateRecipientSave(null));
   }

   const chatExit = () => {
      dispatch(messagesInChatSave([]));
      dispatch(privateRecipientSave(null));
      navigate(`/usersroom/${nickname}`)
      socket.emit("user exit", nickname)
   }

   return (
      <div className="bottom-panel">
         <div className="message-input-wrapper">
            <input type="text"
               id="message-input"
               placeholder={currentLanguage === "ru" ? "Введите сообщение..." : "Enter a message..."}
               autoComplete="off"
               onKeyPress={userSendMessage}
               ref={messageInput} />
            <span>{currentLanguage === "ru" ? "Введите сообщение..." : "Enter a message..."}</span>
            <div className="line"></div>

            <div className="send-file-box" onClick={sendFileModeSet}>
               <div className="send-file-button" ref={sendFileButton}>File</div>
               <div className={!sendFileMode ? "select-file-box" : "select-file-box active"}>
                  <p>📎</p>
                  <input type="file"
                     title={currentLanguage === "ru"
                        ? "выберите файл для отправки"
                        : "select the file to send"}
                     accept="image/*"
                     onChange={selectFile}
                     ref={fileInput} />
               </div>
            </div>
         </div>

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
   )
}