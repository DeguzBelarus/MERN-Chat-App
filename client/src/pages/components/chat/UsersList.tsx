import { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUsersInChat, selectPrivateRecipient } from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";
interface Props {
   privateModeSet: any
}

export const UsersList: FC<Props> = ({ privateModeSet }) => {
   const usersInChat = useAppSelector(selectUsersInChat);
   const nickname = useAppSelector(selectUserNickname);
   const privateRecipient = useAppSelector(selectPrivateRecipient);

   const privateModeHandler = (event: any) => {
      const privateRecipient = event.target.parentElement.firstChild.innerText;
      privateModeSet(privateRecipient)
   }

   return (
      <div className="userslist-box">
         <div className="users-count-box">
            Пользователей:<span>{`${usersInChat.length}`}</span>
         </div>
         {usersInChat.map((user) => {
            if (!privateRecipient) {
               if (user[0] === nickname) {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           <span>{`${user[0]} (Вы)`}</span>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           <span>{`${user[0]} (Вы)`}</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           <span>{`${user[0]} (Вы)`}</span>
                        </div>
                     );
                  }
               } else {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              ЛС
                           </button>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              ЛС
                           </button>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              ЛС
                           </button>
                        </div>
                     );
                  }
               }
            } else {
               if (user[0] !== nickname && user[0] === privateRecipient[0]) {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-private" key={user[0]}>
                           <span>{user[0]}</span>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-private" key={user[0]}>
                           <span>{user[0]}</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box-private" key={user[0]}>
                           <span>{user[0]}</span>
                        </div>
                     );
                  }
               } else if (user[0] === nickname) {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           <span>{`${user[0]} (Вы)`}</span>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           <span>{`${user[0]} (Вы)`}</span>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           <span>{`${user[0]} (Вы)`}</span>
                        </div>
                     );
                  }
               } else {
                  if (user[0] === "Deguz") {
                     return (
                        <div className="user-box-admin" key={user[0]}>
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              ЛС
                           </button>
                        </div>
                     );
                  } else if (user[0] === "NightOwl" || user[0] === "Mamon") {
                     return (
                        <div className="user-box-mentor" key={user[0]}>
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              ЛС
                           </button>
                        </div>
                     );
                  } else {
                     return (
                        <div className="user-box" key={user[0]}>
                           <span>{user[0]}</span>
                           <button
                              className="private-button"
                              onClick={privateModeHandler}
                           >
                              ЛС
                           </button>
                        </div>
                     );
                  }
               }
            }
         })}
      </div>
   );
};