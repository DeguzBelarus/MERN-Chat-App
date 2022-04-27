import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";

import { UserRoomHeader } from "../components/UserRoomHeader/UserRoomHeader";

import "./UserRoom.scss"

export const UserRoom: FC = () => {
   const dispatch = useAppDispatch()
   const nickname = useAppSelector(selectUserNickname)
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
   }, [])

   return (
      <div className="user-room-wrapper">
         <UserRoomHeader
            logout={logout}
            chatEnter={chatEnter} />
      </div>
   )
}
