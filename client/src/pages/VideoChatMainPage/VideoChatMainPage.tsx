import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { selectUserNickname } from "../../app/userSlice";
import { BroadcastItem } from "../components/videochat/BroadcastItem/BroadcastItem";

import "./VideoChatMainPage.scss"

interface Props {
   socket: any
}

export const VideoChatMainPage: FC<Props> = ({ socket }) => {
   const navigate = useNavigate()

   const nickname = useAppSelector(selectUserNickname)
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const [usersInVideoRoom, setUsersInVideoRoom]: any = useState([])

   const videoChatExit = () => {
      navigate(`/usersroom/${nickname}`)
   }

   const individualRoomEnter = () => {
      navigate(`/videochat/${nickname}`)
   }

   useEffect(() => {
      document.title = currentLanguage === "ru"
         ? `MySN: ${nickname} - Видео чат`
         : `MySN: ${nickname} - Webcam chat`

      socket.emit("user is not streaming", nickname)
      socket.emit("user getting list of users in videochat")

      socket.off().on("updated list of broadcasts", (usersInVideoRoom: []) => {
         console.log(usersInVideoRoom);
         setUsersInVideoRoom(usersInVideoRoom)
         console.log("Getting users in videochat...");
      })

      socket.on("response of list of users in videochat", (usersInVideoRoom: []) => {
         setUsersInVideoRoom(usersInVideoRoom)
         console.log("Getting users in videochat...");
      })
   }, [])
   return <div className="videochat-wrapper">
      <div className="upper-container">
         <h1 className="logo-header">MySN</h1>

         <h2 className="greeting-header">
            {currentLanguage === "ru"
               ? "Добро пожаловать в MySN Cams"
               : "Welcome to MySN Cams"}
         </h2>

         <button type="button"
            className="exit-button"
            onClick={videoChatExit}
         >
            {currentLanguage === "ru"
               ? "Выйти"
               : "Quit"}
         </button>
      </div>

      <button type="button"
         className="create-room-button"
         onClick={individualRoomEnter}
      >
         {currentLanguage === "ru"
            ? "Создать комнату"
            : "Create a room"}
      </button>

      <div className="translations-wrapper">
         {usersInVideoRoom.length
            ? usersInVideoRoom.map((broadcast: any, index: number) => {
               return <BroadcastItem
                  nickname={broadcast[0]}
                  peerId={broadcast[1]}
                  poster={broadcast[2]}
                  key={index}
               />
            })
            : currentLanguage === "ru"
               ? "Нет трансляций :("
               : "No broadcasts :("
         }
      </div>
   </div>
}