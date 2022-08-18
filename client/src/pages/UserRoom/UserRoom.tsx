import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
   getUserNickname,
   setUserToken,
   setUserId,
   setUserNickname,
   setIsAuth,
   setRole
} from "../../app/userSlice";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { Logo } from "../components/Logo/Logo";

import { UserRoomHeader } from "../components/UserRoomHeader/UserRoomHeader";
import "./UserRoom.scss"

interface Props {
   socket: any
}

export const UserRoom: FC<Props> = ({ socket }) => {
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const nickname = useAppSelector(getUserNickname)
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const [usersInChat, setUsersInChat]: any = useState(0)
   const [usersInVideoChat, setUsersInVideoChat]: any = useState(0)

   const chatEnter = () => {
      navigate(`/chat/${nickname}`)
   }

   const videoChatEnter = () => {
      navigate(`/videochat/main`)
   }

   const trainingDiaryEnter = () => {
      navigate(`/trainingdiary/${nickname}`)
   }

   const logOut = () => {
      dispatch(setIsAuth(false))
      dispatch(setUserToken(""))
      dispatch(setRole("USER"))
      dispatch(setUserId(""))
      dispatch(setUserNickname(null))
      navigate("/")

      if (localStorage.getItem("MySNToken")) {
         localStorage.removeItem("MySNToken")
      }
   }

   useEffect(() => {
      document.title = `MySN: ${nickname}`
      navigate(`/usersroom/${nickname}`)

      socket.emit("getting all users in chats")
      socket.on("number of users in all chats", (usersInChat: number, usersInVideoChat: number) => {
         setUsersInChat(usersInChat)
         setUsersInVideoChat(usersInVideoChat)
      })
   }, [])

   return (
      <div className="user-room-wrapper">
         <UserRoomHeader
            logOut={logOut}
            chatEnter={chatEnter}
            trainingDiaryEnter={trainingDiaryEnter}
            videoChatEnter={videoChatEnter}
         />
         <Logo />

         <div className="users-count-container">
            <p className="users-in-chat-patagraph">
               {currentLanguage === "ru"
                  ? "Количество пользователей в чате: "
                  : "Number of users in the chat: "}
               <span>{usersInChat}</span>
            </p>
            <p className="users-in-chat-patagraph">
               {currentLanguage === "ru"
                  ? "Количество пользователей в видео чате: "
                  : "Number of users in the webcam chat: "}
               <span>{usersInVideoChat}</span>
            </p>
         </div>
      </div>
   )
}
