import React, { useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectPrivateRecipient,
  privateRecipientSave,
} from "../../../app/chatSlice";

const BottomPanel = ({
  userSendMessage,
  sendMessageOnButton,
  userSendPrivateMessage,
  sendPrivateMessageOnButton,
}) => {
  const dispatch = useAppDispatch();
  const privateRecipient = useAppSelector(selectPrivateRecipient);

  const messageInput = useRef();

  const handleSendMessage = (event) => {
    if (event.key === "Enter") {
      if (!privateRecipient) {
        if (event.target.value === "") return;

        let message = event.target.value;
        userSendMessage(message);

        event.target.value = "";
      } else {
        if (event.target.value === "") return;

        let privatemessage = event.target.value;
        let privateUserNick = privateRecipient[0];
        let privateUserSocket = privateRecipient[1];
        userSendPrivateMessage(
          privatemessage,
          privateUserNick,
          privateUserSocket
        );

        event.target.value = "";
      }
    }
  };

  const handleSendMessageOnButton = () => {
    if (!privateRecipient) {
      let message = messageInput.current.value;
      if (message === "") return;

      sendMessageOnButton(message);

      messageInput.current.value = "";
    } else {
      let privatemessage = messageInput.current.value;
      if (privatemessage === "") return;

      let privateUserNick = privateRecipient[0];
      let privateUserSocket = privateRecipient[1];
      sendPrivateMessageOnButton(
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
      {privateRecipient && (
        <div
          className="private-info"
          onClick={privateModeOff}
        >{`Лично для ${privateRecipient[0]}: `}</div>
      )}
      <input
        type="text"
        className="message-input"
        placeholder="Введите сообщение..."
        onKeyPress={handleSendMessage}
        ref={messageInput}
      />
      <button
        className="button-sendmessage"
        onClick={handleSendMessageOnButton}
      >
        Отправить
      </button>
    </div>
  );
};

export default BottomPanel;
