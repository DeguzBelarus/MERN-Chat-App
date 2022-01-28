import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectUsersInChat,
  selectPrivateRecipient,
} from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";

const UsersList = ({ privateModeSet }) => {
  const privateButton = useRef();

  const usersInChat = useAppSelector(selectUsersInChat);
  const nickname = useAppSelector(selectUserNickname);
  const privateRecipient = useAppSelector(selectPrivateRecipient);

  const privateModeHandle = (event) => {
    const privateRecipientNickname =
      event.target.parentElement.firstChild.innerText;

    privateModeSet(privateRecipientNickname);
  };

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
            } else if (user[0] === "NightOwl") {
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
        } else {
          if (user[0] !== nickname && user[0] === privateRecipient[0]) {
            if (user[0] === "Deguz") {
              return (
                <div className="user-box-private" key={user[0]}>
                  <span>{user[0]}</span>
                </div>
              );
            } else if (user[0] === "NightOwl") {
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
            } else if (user[0] === "NightOwl") {
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
        }
      })}
    </div>
  );
};
export default UsersList;
