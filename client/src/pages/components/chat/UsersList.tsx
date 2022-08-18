import { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUsersInChat, selectPrivateRecipient } from "../../../app/chatSlice";
import { getUserNickname } from "../../../app/userSlice";
import { StatusIndicatorOnline, StatusIndicatorAFK } from "../StatusIndicators/StatusIndicators"
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./UsersList.scss"
interface Props {
   privateModeSet: any
}

export const UsersList: FC<Props> = ({ privateModeSet }) => {
   const usersInChat = useAppSelector(selectUsersInChat);
   const nickname = useAppSelector(getUserNickname);
   const privateRecipient = useAppSelector(selectPrivateRecipient);
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const privateModeHandler = (event: any) => {
      const privateRecipient = event.target.parentElement.children[1].innerText;
      privateModeSet(privateRecipient)
   }

   return (
      <div className="userslist-box">
         <div className="users-count-box">
            {currentLanguage === "ru" ? "Пользователей" : "Users"}:<span>{`${usersInChat.length}`}</span>
         </div>
         {usersInChat.map((user) => {

            //== block when not private mode
            if (!privateRecipient) {

               //== block for current user
               if (user[0] === nickname) {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{currentLanguage === "ru" ? `${user[0]} (Вы)` : `${user[0]} (You)`}</span>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{currentLanguage === "ru" ? `${user[0]} (Вы)` : `${user[0]} (You)`}</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{currentLanguage === "ru" ? `${user[0]} (Вы)` : `${user[0]} (You)`}</span>
                        </div>
                     );
                  }
               }
               //== block for current user

               //== block for others users
               else {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              {currentLanguage === "ru" ? "ЛС" : "PM"}
                           </button>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              {currentLanguage === "ru" ? "ЛС" : "PM"}
                           </button>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              {currentLanguage === "ru" ? "ЛС" : "PM"}
                           </button>
                        </div>
                     );
                  }
               }
               //== block for others users

            }
            //== block when not private mode

            //== block when private mode
            else {
               //== block for others users, not private recipient
               if (user[0] !== nickname && user[0] === privateRecipient[0]) {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-private" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-private" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box-private" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                        </div>
                     );
                  }
               }
               //== block for others users, not private recipient

               //== block for current user
               else if (user[0] === nickname) {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{currentLanguage === "ru" ? `${user[0]} (Вы)` : `${user[0]} (You)`}</span>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{currentLanguage === "ru" ? `${user[0]} (Вы)` : `${user[0]} (You)`}</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{currentLanguage === "ru" ? `${user[0]} (Вы)` : `${user[0]} (You)`}</span>
                        </div>
                     );
                  }
               }
               //== block for current user

               //== block for others users, private recipient
               else {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              {currentLanguage === "ru" ? "ЛС" : "PM"}
                           </button>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              {currentLanguage === "ru" ? "ЛС" : "PM"}
                           </button>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           {user[2] === true ? <StatusIndicatorAFK /> : <StatusIndicatorOnline />}
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              {currentLanguage === "ru" ? "ЛС" : "PM"}
                           </button>
                        </div>
                     );
                  }
               }
               //== block for others users, private recipient

            }
            //== block when private mode
         })}
      </div>
   );
};