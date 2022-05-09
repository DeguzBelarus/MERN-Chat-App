import { FC, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";
import { selectUserNickname } from "../../../app/userSlice";

import { StatusIndicatorOnline } from "../StatusIndicators/StatusIndicators";
import "./UserRoomHeader.scss"
interface Props {
   logout: any,
   chatEnter: any
}

export const UserRoomHeader: FC<Props> = ({ logout, chatEnter }) => {
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const nickname = useAppSelector(selectUserNickname)

   const [servicesIsOpen, setServicesIsOpen] = useState(false)

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
   return <header>
      <StatusIndicatorOnline />
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
            <span className="chat-link" onClick={chatEnter}>{currentLanguage === "ru"
               ? "Чат"
               : "Chat"}
            </span>
         </div>
      </div>

      <div className="exit-wrapper">
         <span onClick={logout}>{currentLanguage === "ru" ? "Выйти" : "Exit"}</span>
      </div>
   </header>
}