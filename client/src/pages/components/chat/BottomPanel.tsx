import React, { useEffect } from "react";

const BottomPanel = () => {
    return (
        <div className="bottom-panel">
            <input type="text" className="message-input" placeholder="Введите сообщение..." />
            <button className="button-sendmessage">Отправить</button>
        </div>
    )
}

export default BottomPanel