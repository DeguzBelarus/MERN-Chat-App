import { useRef, FC } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectPrivateRecipient,
  privateRecipientSave,
  messagesInChatSave,
} from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";

interface Props {
  socket: any
}

const BottomPanel: FC<Props> = ({ socket }) => {
  const messageInput: any = useRef(null);
  const dispatch = useAppDispatch();
  const privateRecipient = useAppSelector(selectPrivateRecipient);
  const nickname = useAppSelector(selectUserNickname);

  const userSendMessage = (event: any) => {
    if (event.key === "Enter") {
      if (!privateRecipient) {
        if (event.target.value === "") return;

        let message = event.target.value;
        socket.emit("user send message", nickname, message);

        event.target.value = "";
      } else {
        if (event.target.value === "") return;

        let privatemessage = event.target.value;
        let privateUserNick = privateRecipient[0];
        let privateUserSocket = privateRecipient[1];

        socket.emit(
          "user send private message",
          nickname,
          privatemessage,
          privateUserNick,
          privateUserSocket
        );

        event.target.value = "";
      }
    }
  };

  const sendMessageOnButton = () => {
    if (!privateRecipient) {
      let message = messageInput.current.value;
      if (message === "") return;

      socket.emit("user send message", nickname, message);

      messageInput.current.value = "";
    } else {
      let privatemessage = messageInput.current.value;
      if (privatemessage === "") return;

      let privateUserNick = privateRecipient[0];
      let privateUserSocket = privateRecipient[1];

      socket.emit(
        "user send private message",
        nickname,
        privatemessage,
        privateUserNick,
        privateUserSocket
      );

      messageInput.current.value = "";
    }
  };

  const privateModeOff = () => {
    dispatch(privateRecipientSave(null));
  };

  const disconnection = () => {
    dispatch(messagesInChatSave([]));
    window.location.reload();
  };

  const buttonMouseOver = (event: any) => {
    event.target.style.boxShadow = "0 0 10px 1px deeppink";
  };

  const buttonMouseOut = (event: any) => {
    event.target.style.boxShadow = "none";
  };

  return (
    <div className="bottom-panel">
      <input
        type="text"
        id="message-input"
        placeholder="Введите сообщение..."
        autoComplete="off"
        onKeyPress={userSendMessage}
        ref={messageInput}
      />
      <label htmlFor="message-input">Введите сообщение</label>
      <div className="bottom-buttons">
        {privateRecipient && (
          <div className="private-info" onClick={privateModeOff}>
            <span>{`Лично для: ${privateRecipient[0]}`}</span>
          </div>
        )}
        <button
          className="button-sendmessage"
          onClick={sendMessageOnButton}
          onMouseOver={buttonMouseOver}
          onMouseOut={buttonMouseOut}
        >
          Отправить
        </button>
        <Link to={"/usersroom"}>
          <button
            className="bottom-return-button"
            onClick={disconnection}
            onMouseOver={buttonMouseOver}
            onMouseOut={buttonMouseOut}
          >
            Выйти
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BottomPanel;
