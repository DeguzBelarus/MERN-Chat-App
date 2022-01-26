import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectUsersInChat } from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";

const UsersList = ({ privateModeSet }) => {
  const usersListContainer = useRef();
  const privateButton = useRef();

  const usersInChat = useAppSelector(selectUsersInChat);
  const nickname = useAppSelector(selectUserNickname);

  const privateModeHandle = (event) => {
    const privateRecipientNickname =
      event.target.parentElement.firstChild.innerText;

    privateModeSet(privateRecipientNickname);
  };

  return (
    <div className="userslist-box" ref={usersListContainer}>
      {usersInChat.map((user) => {
        if (user[0] === nickname) {
          if (user[0] === "Deguz") {
            return (
              <div className="user-box-admin" key={user[0]}>
                <span>{user[0]}</span>
              </div>
            );
          } else if (user[0] === "NightOwl") {
            return (
              <div className="user-box-mentor" key={user[0]}>
                <span>{user[0]}</span>
              </div>
            );
          } else {
            return (
              <div className="user-box" key={user[0]}>
                <span>{user[0]}</span>
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
                  ref={privateButton}
                  onClick={privateModeHandle}
                >
                  Лично
                </button>
              </div>
            );
          } else if (user[0] === "NightOwl") {
            return (
              <div className="user-box-mentor" key={user[0]}>
                <span>{user[0]}</span>
                <button
                  className="private-button"
                  ref={privateButton}
                  onClick={privateModeHandle}
                >
                  Лично
                </button>
              </div>
            );
          } else {
            return (
              <div className="user-box" key={user[0]}>
                <span>{user[0]}</span>
                <button
                  className="private-button"
                  ref={privateButton}
                  onClick={privateModeHandle}
                >
                  Лично
                </button>
              </div>
            );
          }
        }
      })}
    </div>
  );
};
export default UsersList;
