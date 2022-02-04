import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectPrivateRecipient,
  privateRecipientSave,
  messagesInChatSave,
} from "../../../app/chatSlice";
import { selectUserNickname } from "../../../app/userSlice";

const BottomPanel = ({ socket }) => {
  const messageInput = useRef();
  const dispatch = useAppDispatch();
  const privateRecipient = useAppSelector(selectPrivateRecipient);
  const nickname = useAppSelector(selectUserNickname);

  const userSendMessage = (event) => {
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
    dispatch(privateRecipientSave());
  };

  const disconnection = () => {
    dispatch(messagesInChatSave());
    window.location.reload();
  };

  const buttonMouseOver = (event) => {
    event.target.style.boxShadow = "0 0 10px 1px deeppink";
  };

  const buttonMouseOut = (event) => {
    event.target.style.boxShadow = "none";
  };

  return (
    <div className="bottom-panel">
      <input
        type="text"
        className="message-input"
        placeholder="Введите сообщение..."
        onKeyPress={userSendMessage}
        ref={messageInput}
      />
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
        <button
          className="bottom-return-button"
          onClick={disconnection}
          onMouseOver={buttonMouseOver}
          onMouseOut={buttonMouseOut}
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default BottomPanel;
