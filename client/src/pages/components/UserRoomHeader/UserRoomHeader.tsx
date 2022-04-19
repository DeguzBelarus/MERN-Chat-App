import React, { FC } from "react";
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

   return <header>
      <StatusIndicatorOnline />
      <div className="nickname-wrapper">
         <span>{nickname}</span>
      </div>

      <nav></nav>

      <div className="services">
         <span>{currentLanguage === "ru" ? "Сервисы" : "Services"}</span>
         <span className="chat-link" onClick={chatEnter}>{currentLanguage === "ru"
            ? "Чат"
            : "Chat"}</span>
      </div>

      <div className="exit-wrapper">
         <span onClick={logout}>{currentLanguage === "ru" ? "Выйти" : "Exit"}</span>
      </div>

   </header>
}