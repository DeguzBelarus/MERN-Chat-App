import React, { useEffect } from "react";
import io from "socket.io-client"
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUserNickname, selectUserId, userTokenSave, userIdSave, userNicknameSave } from "../../app/userSlice";
import "./UserRoom.scss"

const UserRoom = () => {
    const dispatch = useAppDispatch()
    const nickname = useAppSelector(selectUserNickname)
    const userId = useAppSelector(selectUserId)

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

    const refreshCount = Number(sessionStorage.getItem('refreshCount')) || 0;
    useEffect(() => {
        if (refreshCount < 2) {
            sessionStorage.setItem('refreshCount', String(refreshCount + 1));
            window.location.reload();
        } else {
            sessionStorage.removeItem('refreshCount');
        }
    }, []);

    return (
        <div className="user-room-wrapper">
            <div className="user-info-box">
                <h1 className="user-welcome-header">{`Добро пожаловать в свою комнату, ${nickname}`}</h1>
                <p className="user-id-paragraph">{`Ваш id пользователя: `}<strong>{userId}</strong></p>
                <div className="user-room-buttons">
                    <button type="button" className="logout-button" onClick={logout} onMouseOver={buttonMouseOver} onMouseOut={buttonMouseOut}>Выйти из системы</button>
                    <Link to={"/chat"}><button type="button" className="enter-button" onMouseOver={buttonMouseOver} onMouseOut={buttonMouseOut}>Войти в Чат</button></Link>
                </div>
            </div>
        </div>
    )
}

export default UserRoom