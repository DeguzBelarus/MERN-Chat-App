import { FC, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";
import { selectUserNickname } from "../../../app/userSlice";

import "./UserRoomHeader.scss"
interface Props {
   logout: any,
   chatEnter: any
   trainingDiaryEnter: any
   videoChatEnter: any
}

export const UserRoomHeader: FC<Props> = ({
   logout, chatEnter, trainingDiaryEnter, videoChatEnter
}) => {
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const nickname = useAppSelector(selectUserNickname)

   const [servicesIsOpen, setServicesIsOpen] = useState(false)


   //== services container spreading methods
   const servicesOpener = () => {
      if (!servicesIsOpen) {
         setServicesIsOpen(true)
      } else {
         setServicesIsOpen(false)
      }
   }

   const openServicesMouseOver = () => {
      setServicesIsOpen(true)
   }

   const openServicesMouseOut = () => {
      setServicesIsOpen(false)
   }
   //== services container spreading methods
   return <header>
      <div className="nickname-wrapper">
         <span>{nickname}</span>
      </div>

      <nav></nav>

      <div className="services"
         onMouseOver={openServicesMouseOver}
         onMouseOut={openServicesMouseOut}>

         <span onClick={servicesOpener}>
            {currentLanguage === "ru"
               ? "Сервисы"
               : "Services"}
         </span>

         <div className={!servicesIsOpen ? "services-list" : "services-list active"}>
            <span className="service-link" onClick={chatEnter}>{currentLanguage === "ru"
               ? "Чат"
               : "Chat"}
            </span>

            <span className="service-link" onClick={videoChatEnter}>{currentLanguage === "ru"
               ? "Видео чат"
               : "Webcam chat"} &#128296;
            </span>

            <span className="service-link" onClick={trainingDiaryEnter}>{currentLanguage === "ru"
               ? "Дневник тренировок"
               : "Training diary"}
            </span>
         </div>
      </div>

      <div className="exit-wrapper">
         <span onClick={logout}>{currentLanguage === "ru" ? "Выйти" : "Exit"}</span>
      </div>
   </header>
}