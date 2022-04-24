import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, selectUserId, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";
import { messagesInChatSave } from "../../app/chatSlice";

import { UserRoomHeader } from "../components/UserRoomHeader/UserRoomHeader";

import "./UserRoom.scss"
interface Props {
   socket: any
}

export const UserRoom: FC<Props> = ({ socket }) => {
   const dispatch = useAppDispatch()
   const nickname = useAppSelector(selectUserNickname)
   const userId = useAppSelector(selectUserId)
   const navigate = useNavigate()

   const chatEnter = () => {
      navigate("/chat")
   }

   const logout = () => {
      localStorage.removeItem("saveChat")

      dispatch(userTokenSave(null))
      dispatch(userIdSave(null))
      dispatch(userNicknameSave(null))
   }

   useEffect(() => {
      document.title = `MySN: ${nickname}`
      dispatch(messagesInChatSave([]))

      //== removes current user from list of users in chat
      socket.emit("i'm not in chat", nickname)
      //== removes current user from list of users in chat
   }, [])

   return (
      <div className="user-room-wrapper">
         <UserRoomHeader
            logout={logout}
            chatEnter={chatEnter} />
      </div>
   )
}
