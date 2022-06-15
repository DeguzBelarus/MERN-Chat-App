import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";
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

   const nickname = useAppSelector(selectUserNickname)
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

   const logout = () => {
      localStorage.removeItem("saveChat")

      dispatch(userTokenSave(null))
      dispatch(userIdSave(null))
      dispatch(userNicknameSave(null))
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
            logout={logout}
            chatEnter={chatEnter}
            trainingDiaryEnter={trainingDiaryEnter}
            videoChatEnter={videoChatEnter}
         />
         <Logo />
         <p className="users-in-chat-patagraph">
            {currentLanguage === "ru"
               ? `Количество пользователей в чате: ${usersInChat}`
               : `Number of users in the chat: ${usersInChat}`}
         </p>
         <p className="users-in-chat-patagraph">
            {currentLanguage === "ru"
               ? `Количество пользователей в видео чате: ${usersInVideoChat}`
               : `Number of users in the webcam chat: ${usersInVideoChat}`}
         </p>
      </div>
   )
}
