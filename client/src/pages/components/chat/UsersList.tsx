import { useRef, FC, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectUsersInChat,
  selectPrivateRecipient,
  usersInChatSave,
  privateRecipientSave,
} from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";

interface Props {
  socket: any
}

const UsersList: FC<Props> = ({ socket }) => {
  const privateButton: any = useRef();
  const dispatch = useAppDispatch();
  const usersInChat = useAppSelector(selectUsersInChat);
  const nickname = useAppSelector(selectUserNickname);
  const privateRecipient = useAppSelector(selectPrivateRecipient);

  const privateModeSet = (event: any) => {
    const privateRecipientNickname =
      event.target.parentElement.firstChild.innerText;
    socket.emit("getting users socketid", privateRecipientNickname);
  };

  useEffect(() => {
    socket.on("users in room info", (newUsersInRoom: any[]) => {
      dispatch(usersInChatSave(newUsersInRoom));
    });

    socket.on("user disconnected", (disconnectedUser: string, newUsersInRoom: any[]) => {
      dispatch(usersInChatSave(newUsersInRoom));
    });

    socket.on("getting private user data", (targetUser: string) => {
      dispatch(privateRecipientSave(targetUser[0]));
    });
  }, []);

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
                    ref={privateButton}
                    onClick={privateModeSet}
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
                    ref={privateButton}
                    onClick={privateModeSet}
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
                    ref={privateButton}
                    onClick={privateModeSet}
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
                    ref={privateButton}
                    onClick={privateModeSet}
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
                    ref={privateButton}
                    onClick={privateModeSet}
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
                    ref={privateButton}
                    onClick={privateModeSet}
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

export default UsersList;
