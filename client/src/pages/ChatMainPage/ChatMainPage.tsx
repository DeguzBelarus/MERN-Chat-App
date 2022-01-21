import React from "react";
import io from "socket.io-client";
import ChatMessages from "../components/chat/ChatMessages";
import UsersList from "../components/chat/UsersList";
import BottomPanel from "../components/chat/BottomPanel";
import "./ChatMainPage.scss"


const ChatMainPage = () => {
    return (
        <div className="chat-wrapper">
            <div className="chat-upper-wrapper">
                <UsersList />
                <ChatMessages />
            </div>
            <BottomPanel />
        </div>
    )
}

export default ChatMainPage