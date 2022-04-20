import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, selectUserId, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";
import { messagesInChatSave } from "../../app/chatSlice";

import { UserRoomHeader } from "../components/UserRoomHeader/UserRoomHeader";

import "./UserRoom.scss"

export const UserRoom: FC = () => {
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
   }, [])

   return (
      <div className="user-room-wrapper">
         <UserRoomHeader
            logout={logout}
            chatEnter={chatEnter} />
      </div>
   )
}
