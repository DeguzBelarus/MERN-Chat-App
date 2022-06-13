import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";
import { Logo } from "../components/Logo/Logo";

import { UserRoomHeader } from "../components/UserRoomHeader/UserRoomHeader";
import "./UserRoom.scss"

export const UserRoom: FC = () => {
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const nickname = useAppSelector(selectUserNickname)

   const chatEnter = () => {
      navigate(`/chat/${nickname}`)
   }

   const videoChatEnter = () => {
      navigate(`/videochat/${nickname}`)
   }

   const trainingDiaryEnter = () => {
      navigate(`/trainingdiary/${nickname}`)
   }

   const logout = () => {
      localStorage.removeItem("saveChat")

      dispatch(userTokenSave(null))
      dispatch(userIdSave(null))
      dispatch(userNicknameSave(null))
   }

   useEffect(() => {
      document.title = `MySN: ${nickname}`
      navigate(`/usersroom/${nickname}`)
   }, [])

   return (
      <div className="user-room-wrapper">
         <UserRoomHeader
            logout={logout}
            chatEnter={chatEnter}
            trainingDiaryEnter={trainingDiaryEnter}
            videoChatEnter={videoChatEnter}
         />
         <Logo />
      </div>
   )
}
