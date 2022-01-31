import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectPrivateRecipient,
  privateRecipientSave,
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
        <button className="button-sendmessage" onClick={sendMessageOnButton}>
          Отправить
        </button>
        <button className="bottom-return-button">Выйти</button>
      </div>
    </div>
  );
};

export default BottomPanel;
