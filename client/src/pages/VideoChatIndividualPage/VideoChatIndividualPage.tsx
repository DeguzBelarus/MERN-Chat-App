import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { selectUserNickname } from "../../app/userSlice";
import { selectPeerId } from "../../app/webcamChatSlice ";
import { VideoChatMainBox } from "../components/videochat/VideoChatMainBox/VideoChatMainBox";

import "./VideoChatIndividualPage.scss"

interface Props {
   socket: any,
   peer: any
}

export const VideoChatIndividualPage: FC<Props> = ({ socket, peer }) => {
   const nickname = useAppSelector(selectUserNickname)
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const peerId = useAppSelector(selectPeerId)
   const navigate = useNavigate()

   const [userStream, setUserStream]: any = useState(null)
   const [poster, setPoster]: any = useState(null)

   const streamStop = () => {
      userStream.getTracks().forEach((track: any) => track.stop());
   }

   const individualRoomExit = () => {
      streamStop()
      navigate(`/videochat/main`)
   }

   useEffect(() => {
      if (userStream && poster) {
         socket.emit("user started stream", peerId, nickname, poster)
      }
   }, [userStream, poster])

   useEffect(() => {
      document.title = currentLanguage === "ru"
         ? `MySN: ${nickname} - Личная комната`
         : `MySN: ${nickname} - Private room`
   }, [])
   return <div className="videochat-wrapper">
      <div className="upper-container">
         <h1 className="logo-header">MySN</h1>


         <h2 className="greeting-header">
            {currentLanguage === "ru"
               ? `Комната ${nickname}`
               : `${nickname}'s room`}
         </h2>

         <button type="button"
            className="exit-button"
            onClick={individualRoomExit}
         >
            {currentLanguage === "ru"
               ? "Закрыть"
               : "Close"}
         </button>
      </div>

      <VideoChatMainBox
         socket={socket}
         peer={peer}
         userStream={userStream}
         setUserStream={setUserStream}
         setPoster={setPoster}
      />
   </div>
}