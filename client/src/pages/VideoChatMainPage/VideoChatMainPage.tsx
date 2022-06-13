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

   useEffect(() => {
      document.title = currentLanguage === "ru"
         ? `MySN: ${nickname} - Видео чат`
         : `MySN: ${nickname} - Webcam chat`
   })
   return <div>video chat page!</div>
}