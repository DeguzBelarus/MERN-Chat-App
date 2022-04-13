import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, selectUserId, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";

import "./UserRoom.scss"
interface Props {
}

const UserRoom: FC<Props> = () => {
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

   const buttonMouseOver = (event: any) => {
      event.target.style.boxShadow = "0 0 10px 1px deeppink"
   }

   const buttonMouseOut = (event: any) => {
      event.target.style.boxShadow = "none"
   }

   useEffect(() => {
      document.title = `My Chat - ${nickname}`
   }, [])

   return (
      <div className="user-room-wrapper">
         <div className="user-info-box">
            <h1 className="user-welcome-header">{`Добро пожаловать в свою комнату, ${nickname}`}</h1>
            <p className="user-id-paragraph">{`Ваш id пользователя: `}<strong>{userId}</strong></p>
            <div className="user-room-buttons">
               <button type="button" className="logout-button" onClick={logout} onMouseOver={buttonMouseOver} onMouseOut={buttonMouseOut}>Выйти из системы</button>
               <button type="button" className="enter-button" onClick={chatEnter} onMouseOver={buttonMouseOver} onMouseOut={buttonMouseOut}>Войти в Чат</button>
            </div>
         </div>
      </div>
   )
}

export default UserRoom