import { useEffect, FC, useTransition, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname } from "../../app/userSlice";
import { messagesInChatSave, usersInChatSave, selectMessagesInChat, privateRecipientSave } from "../../app/chatSlice";

import { ChatMessages } from "../components/chat/ChatMessages";
import { UsersList } from "../components/chat/UsersList";
import { BottomPanel } from "../components/chat/BottomPanel";
import { ImageAndVideoBox } from "../components/chat/ImageAndVideoBox";
import "./ChatMainPage.scss";
interface Props {
   socket: any
}

export const ChatMainPage: FC<Props> = ({ socket }) => {
   const CryptoJS = require("crypto-js");
   const dispatch = useAppDispatch()
   const [isPending, startTransition]: any = useTransition()

   const nickname = useAppSelector(selectUserNickname)
   let messagesInChat = useAppSelector(selectMessagesInChat)

   const [typeOfFileBox, setTypeOfFileBox]: any = useState("image")
   const [fileOfFileBoxSRC, setFileOfFileBoxSRC]: any = useState(null)
   const [fileBoxIsShown, setFileBoxIsShown]: any = useState(false)

   let afkTimeout: any;
   let isAFK: boolean = false;

   const privateModeSet = (privateRecipient: string) => {
      socket.emit("getting users socketid", privateRecipient);
   };

   const fileBoxImageOpening = (event: any) => {
      console.log(event.target.src);
      setFileOfFileBoxSRC(event.target.src)
      setTypeOfFileBox("image")
      setFileBoxIsShown(true)
   }

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
               const bytes = CryptoJS.AES.decrypt(message, process.env.REACT_APP_DECRYPT_WORD);
               message = bytes.toString(CryptoJS.enc.Utf8);

               const userMessage = ["um", nickname, message];
               messagesInChat = [...messagesInChat, userMessage];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      });

      socket.on("private message from user", (nickname: string, privatemessage: string) => {
         if (nickname && privatemessage) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(privatemessage, process.env.REACT_APP_DECRYPT_WORD);
               privatemessage = bytes.toString(CryptoJS.enc.Utf8);

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
                  const bytes = CryptoJS.AES.decrypt(privatemessage, process.env.REACT_APP_DECRYPT_WORD);
                  privatemessage = bytes.toString(CryptoJS.enc.Utf8);

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

      socket.on("user send image only message", (nickname: string, image: any) => {
         if (nickname && image) {
            startTransition(() => {
               let binaryData = []
               binaryData.push(image)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "image/*" }))

               const userOnlyImageMessage = ["ui", nickname, url];
               messagesInChat = [...messagesInChat, userOnlyImageMessage];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("user send video only message", (nickname: string, video: any) => {
         if (nickname && video) {
            startTransition(() => {
               let binaryData = []
               binaryData.push(video)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "video/*" }))

               const userOnlyVideoMessage = ["uv", nickname, url];
               messagesInChat = [...messagesInChat, userOnlyVideoMessage];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("user send message with image", (nickname: string, image: any, message: string) => {
         if (nickname && image && message) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(message, process.env.REACT_APP_DECRYPT_WORD);
               message = bytes.toString(CryptoJS.enc.Utf8);

               let binaryData = []
               binaryData.push(image)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "image/*" }))

               const userImageAndMessage = ["umi", nickname, url, message];
               messagesInChat = [...messagesInChat, userImageAndMessage];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("user send message with video", (nickname: string, video: any, message: string) => {
         if (nickname && video && message) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(message, process.env.REACT_APP_DECRYPT_WORD);
               message = bytes.toString(CryptoJS.enc.Utf8);

               let binaryData = []
               binaryData.push(video)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "video/*" }))

               const userVideoAndMessage = ["umv", nickname, url, message];
               messagesInChat = [...messagesInChat, userVideoAndMessage];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private image from user", (nickname: string, privateImage: any) => {
         if (nickname && privateImage) {
            startTransition(() => {
               let binaryData = []
               binaryData.push(privateImage)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "image/*" }))

               const userImagePrivate = ["uip", nickname, url];
               messagesInChat = [...messagesInChat, userImagePrivate];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private video from user", (nickname: string, privateVideo: any) => {
         if (nickname && privateVideo) {
            startTransition(() => {
               let binaryData = []
               binaryData.push(privateVideo)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "video/*" }))

               const userVideoPrivate = ["uvp", nickname, url];
               messagesInChat = [...messagesInChat, userVideoPrivate];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private image notification", (privateUserNick: string, privateImage: any) => {
         if (privateUserNick && privateImage) {
            startTransition(() => {
               let binaryData = []
               binaryData.push(privateImage)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "image/*" }))

               const privateImageNotification = ["pin", privateUserNick, url];
               messagesInChat = [...messagesInChat, privateImageNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private video notification", (privateUserNick: string, privateVideo: any) => {
         if (privateUserNick && privateVideo) {
            startTransition(() => {
               let binaryData = []
               binaryData.push(privateVideo)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "video/*" }))

               const privateVideoNotification = ["pvn", privateUserNick, url];
               messagesInChat = [...messagesInChat, privateVideoNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private message with image from user", (nickname: string,
         privateImage: any, privatemessage: string) => {
         if (nickname && privateImage && privatemessage) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(privatemessage, process.env.REACT_APP_DECRYPT_WORD);
               privatemessage = bytes.toString(CryptoJS.enc.Utf8);

               let binaryData = []
               binaryData.push(privateImage)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "image/*" }))

               const userImageAndMessagePrivate = ["umip", nickname, url, privatemessage];
               messagesInChat = [...messagesInChat, userImageAndMessagePrivate];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private message with video from user", (nickname: string,
         privateVideo: any, privatemessage: string) => {
         if (nickname && privateVideo && privatemessage) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(privatemessage, process.env.REACT_APP_DECRYPT_WORD);
               privatemessage = bytes.toString(CryptoJS.enc.Utf8);

               let binaryData = []
               binaryData.push(privateVideo)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "video/*" }))

               const userVideoAndMessagePrivate = ["umvp", nickname, url, privatemessage];
               messagesInChat = [...messagesInChat, userVideoAndMessagePrivate];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private message with image notification", (privateUserNick: string,
         privateImage: any, privatemessage: string) => {
         if (nickname && privateImage && privatemessage) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(privatemessage, process.env.REACT_APP_DECRYPT_WORD);
               privatemessage = bytes.toString(CryptoJS.enc.Utf8);

               let binaryData = []
               binaryData.push(privateImage)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "image/*" }))

               const privateImageAndMessageNotification = ["pmin", privateUserNick, url, privatemessage];
               messagesInChat = [...messagesInChat, privateImageAndMessageNotification];
               dispatch(messagesInChatSave(messagesInChat));
            });
         }
      })

      socket.on("private message with video notification", (privateUserNick: string,
         privateVideo: any, privatemessage: string) => {
         if (nickname && privateVideo && privatemessage) {
            startTransition(() => {
               const bytes = CryptoJS.AES.decrypt(privatemessage, process.env.REACT_APP_DECRYPT_WORD);
               privatemessage = bytes.toString(CryptoJS.enc.Utf8);

               let binaryData = []
               binaryData.push(privateVideo)
               const url = URL.createObjectURL(new Blob(binaryData, { type: "video/*" }))

               const privateVideoAndMessageNotification = ["pmvn", privateUserNick, url, privatemessage];
               messagesInChat = [...messagesInChat, privateVideoAndMessageNotification];
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
      if (isAFK) {
         isAFK = false;
         socket.emit("user is not AFK", nickname)
      }
      //== set status to not AFK

      //== removes current AFK timeout if there is one
      if (afkTimeout) {
         clearTimeout(afkTimeout)
      }
      //== removes current AFK timeout if there is one

      //== set status to AFK after 5 minutes (300 000 ms)
      afkTimeout = setTimeout(() => {
         isAFK = true;
         socket.emit("user is AFK", nickname)
      }, 300000)
      //== set status to AFK after 5 minutes (300 000 ms)
   }

   useEffect(() => {
      afkTimeoutRestart()
      window.addEventListener("mousemove", afkTimeoutRestart)
      window.addEventListener("keypress", afkTimeoutRestart)

      return () => {
         window.removeEventListener("mousemove", afkTimeoutRestart)
         window.removeEventListener("keypress", afkTimeoutRestart)

         //== removes current AFK timeout if there is one
         if (afkTimeout) {
            clearTimeout(afkTimeout)
         }
         //== removes current AFK timeout if there is one

         //== removes current user from list of users in chat
         socket.emit("user exit", nickname)
         //== removes current user from list of users in chat
      }
   }, [])

   return (
      <div className="chat-wrapper">
         {fileBoxIsShown
            && <ImageAndVideoBox
               typeOfFileBox={typeOfFileBox}
               fileOfFileBoxSRC={fileOfFileBoxSRC}
               setFileBoxIsShown={setFileBoxIsShown}
            />}

         {!fileBoxIsShown && <div className="chat-upper-wrapper">
            <UsersList privateModeSet={privateModeSet} />
            <ChatMessages fileBoxImageOpening={fileBoxImageOpening} />
         </div>}
         {!fileBoxIsShown && <BottomPanel socket={socket} />}
      </div>
   );
};