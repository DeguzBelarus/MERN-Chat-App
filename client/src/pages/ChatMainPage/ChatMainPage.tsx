import { useEffect, FC } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname } from "../../app/userSlice";
import { messagesInChatSave, usersInChatSave, selectMessagesInChat, privateRecipientSave } from "../../app/chatSlice";

import BottomPanel from "../components/chat/BottomPanel";
import UsersList from "../components/chat/UsersList";
import ChatMessages from "../components/chat/ChatMessages";

import "./ChatMainPage.scss";
interface Props {
   socket: any
}

const ChatMainPage: FC<Props> = ({ socket }) => {
   const dispatch = useAppDispatch()
   const nickname = useAppSelector(selectUserNickname);
   let messagesInChat = useAppSelector(selectMessagesInChat);

   const privateModeSet = (privateRecipient: string) => {
      socket.emit("getting users socketid", privateRecipient);
   };

   useEffect(() => {
      //== notification about entering the chat
      socket.emit("user entered", nickname);
      //== notification about entering the chat

      //== connection and disconnection listenings
      //== connection listening
      socket.on("entered user info", (enteredUser: string, usersInRoom: any[]) => {
         if (enteredUser && usersInRoom) {
            dispatch(usersInChatSave(usersInRoom));

            const enteringNotification = ["enn", enteredUser];
            messagesInChat = [...messagesInChat, enteringNotification];
            dispatch(messagesInChatSave(messagesInChat));
         }
      });
      //== connection listening

      //== disconnection listening
      socket.on("user disconnected", (disconnectedUser: string, usersInRoom: any[]) => {
         if (disconnectedUser && usersInRoom) {
            dispatch(usersInChatSave(usersInRoom));

            const exitingNotification = ["exn", disconnectedUser];
            messagesInChat = [...messagesInChat, exitingNotification];
            dispatch(messagesInChatSave(messagesInChat));
         }
      });
      //== disconnection listening
      //== connection and disconnection listenings

      //== defining a user for personal correspondence
      socket.on("getting private user data", (targetUser: string) => {
         if (targetUser) {
            dispatch(privateRecipientSave(targetUser[0]));
         }
      });
      //== defining a user for personal correspondence

      //== message listenings
      socket.on("message from user", (nickname: string, message: string) => {
         if (nickname && message) {
            const userMessage = ["um", nickname, message];
            messagesInChat = [...messagesInChat, userMessage];
            dispatch(messagesInChatSave(messagesInChat));
         }
      });

      socket.on("private message from user", (nickname: string, privatemessage: string) => {
         if (nickname && privatemessage) {
            const userMessagePrivate = ["ump", nickname, privatemessage];
            messagesInChat = [...messagesInChat, userMessagePrivate];
            dispatch(messagesInChatSave(messagesInChat));
         }
      });

      socket.on(
         "private message notification",
         (privateUserNick: string, privatemessage: string) => {
            if (privateUserNick && privatemessage) {
               const privateMessageNotification = ["pmn", privateUserNick, privatemessage];
               messagesInChat = [...messagesInChat, privateMessageNotification];
               dispatch(messagesInChatSave(messagesInChat));
            }
         }
      );
      //== message listenings
   }, [])

   return (
      <div className="chat-wrapper">
         <div className="chat-upper-wrapper">
            <UsersList privateModeSet={privateModeSet} />
            <ChatMessages />
         </div>
         <BottomPanel socket={socket} />
      </div>
   );
};

export default ChatMainPage;
