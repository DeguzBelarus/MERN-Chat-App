import { useEffect, FC, useTransition, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname } from "../../app/userSlice";
import { messagesInChatSave, usersInChatSave, selectMessagesInChat, privateRecipientSave } from "../../app/chatSlice";

import { ChatMessages } from "../components/chat/ChatMessages";
import { UsersList } from "../components/chat/UsersList";
import { BottomPanel } from "../components/chat/BottomPanel";

import "./ChatMainPage.scss";
interface Props {
   socket: any
}

export const ChatMainPage: FC<Props> = ({ socket }) => {
   const dispatch = useAppDispatch()
   const nickname = useAppSelector(selectUserNickname)
   let messagesInChat = useAppSelector(selectMessagesInChat)

   const [isPending, startTransition]: any = useTransition()

   let aFKlock: boolean = false;
   let stayNotAFK: boolean = false;
   let isAFK: boolean = false;
   let afkTimeout: any;

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

            startTransition(() => {
               const enteringNotification = ["enn", enteredUser];
               messagesInChat = [...messagesInChat, enteringNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      });
      //== connection listening

      //== disconnection listening
      socket.on("user disconnected", (disconnectedUser: string, usersInRoom: any[]) => {
         if (disconnectedUser && usersInRoom) {
            dispatch(usersInChatSave(usersInRoom));

            startTransition(() => {
               const exitingNotification = ["exn", disconnectedUser];
               messagesInChat = [...messagesInChat, exitingNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
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
            startTransition(() => {
               const userMessage = ["um", nickname, message];
               messagesInChat = [...messagesInChat, userMessage];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      });

      socket.on("private message from user", (nickname: string, privatemessage: string) => {
         if (nickname && privatemessage) {
            startTransition(() => {
               const userMessagePrivate = ["ump", nickname, privatemessage];
               messagesInChat = [...messagesInChat, userMessagePrivate];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      });

      socket.on(
         "private message notification",
         (privateUserNick: string, privatemessage: string) => {
            if (privateUserNick && privatemessage) {
               startTransition(() => {
                  const privateMessageNotification = ["pmn", privateUserNick, privatemessage];
                  messagesInChat = [...messagesInChat, privateMessageNotification];
                  dispatch(messagesInChatSave(messagesInChat));
               });
            }
         }
      );

      socket.on("private message recipient not in chat", (privateUserNick: string) => {
         if (privateUserNick) {
            startTransition(() => {
               const privateNotDeliveredNotification = ["pmd", privateUserNick];
               messagesInChat = [...messagesInChat, privateNotDeliveredNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })
      //== message listenings

      //== AFK status listenings
      socket.on("user's status is AFK", (AFKuser: string, usersInRoom: any[]) => {
         if (AFKuser && usersInRoom) {
            dispatch(usersInChatSave(usersInRoom));

            startTransition(() => {
               const userIsAFKNotification = ["AFK", AFKuser];
               messagesInChat = [...messagesInChat, userIsAFKNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("user's status is not AFK", (notAFKuser: string, usersInRoom: any[]) => {
         if (notAFKuser && usersInRoom) {
            dispatch(usersInChatSave(usersInRoom));

            startTransition(() => {
               const userIsNotAFKNotification = ["notAFK", notAFKuser];
               messagesInChat = [...messagesInChat, userIsNotAFKNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })
      //== AFK status listenings
   }, [])

   const afkTimeoutRestart = () => {
      //== set status to not AFK
      if (isAFK && !aFKlock) {
         isAFK = false;
         socket.emit("user is not AFK", nickname)
      }
      //== set status to not AFK

      //== removes current AFK timeout
      if (afkTimeout) {
         clearTimeout(afkTimeout)
      }
      //== removes current AFK timeout

      //== set status to AFK after 10 minutes
      if (!stayNotAFK) {
         afkTimeout = setTimeout(() => {
            isAFK = true;
            socket.emit("user is AFK", nickname)
         }, 5000)
      }
      //== set status to AFK after 10 minutes (600 000 ms)
   }

   useEffect(() => {
      afkTimeoutRestart()
      window.addEventListener("mousemove", afkTimeoutRestart)
      window.addEventListener("keypress", afkTimeoutRestart)
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