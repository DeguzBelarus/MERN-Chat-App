import React, { useRef } from "react";

const BottomPanel = ({ userSendMessage, sendMessageOnButton }) => {
  const messageInput = useRef();

  const handleSendMessageOnButton = () => {
    let message = messageInput.current.value;
    if (message === "") return;

    sendMessageOnButton(message);

    messageInput.current.value = "";
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
