import { useEffect, FC } from "react";
import ChatMessages from "../components/chat/ChatMessages";
import UsersList from "../components/chat/UsersList";
import BottomPanel from "../components/chat/BottomPanel";
import { useAppSelector } from "../../app/hooks";
import { selectUserNickname, selectUserId } from "../../app/userSlice";
import io from "socket.io-client";
import "./ChatMainPage.scss";

const ChatMainPage: FC = () => {
  const nickname = useAppSelector(selectUserNickname);
  const userId = useAppSelector(selectUserId);

  const socket: any = io();

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("user connected", { nickname, userId });
    });

  }, []);

  return (
    <div className="chat-wrapper">
      <div className="chat-upper-wrapper">
        <UsersList socket={socket} />
        <ChatMessages socket={socket} />
      </div>
      <BottomPanel socket={socket} />
    </div>
  );
};

export default ChatMainPage;
