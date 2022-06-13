import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { selectUserNickname } from "../../app/userSlice";

import "./VideoChatMainPage.scss"

interface Props {
   socket: any
}

export const VideoChatMainPage: FC<Props> = ({ socket }) => {
   const nickname = useAppSelector(selectUserNickname)
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const navigate = useNavigate()

   const videoChatExit = () => {
      navigate(`/usersroom/${nickname}`)
   }

   useEffect(() => {
      document.title = currentLanguage === "ru"
         ? `MySN: ${nickname} - Видео чат`
         : `MySN: ${nickname} - Webcam chat`
   })
   return <div className="videochat-diary-wrapper">
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

   </div>
}