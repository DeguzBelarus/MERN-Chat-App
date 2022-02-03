import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userTokenSave, userIdSave, userNicknameSave, selectToken } from "../../app/userSlice";
import { useForm } from "../../hooks/useForm.hook";
import Loader from "../components/Loader/Loader";
import "./AuthorizationPage.scss"

const AuthorizationPage = () => {
    const dispatch = useAppDispatch()
    const history = useNavigate()

    const [formData, setFormData] = useState({ email: "", password: "" })
    const { loading, message, request, clearMessage } = useForm()
    const [signedMessage, setSignedMessage] = useState("")

    const token = useAppSelector(selectToken)

    useEffect(() => {
        if (localStorage.getItem("saveChat")) {
            let save: any = localStorage.getItem('saveChat')
            if (save !== null) {
                save = JSON.parse(save)

                dispatch(userTokenSave(save.token))
                dispatch(userIdSave(save.userId))
                dispatch(userNicknameSave(save.nickname))

                setSignedMessage(`${save.nickname}, Вы успешно вошли в систему`)
                setTimeout(() => clearSignedMessage(), 8000)

                history(`/usersroom/${save.nickname}`)
            }
        } else {
            history("/")
        }

    }, [token])

    useEffect(() => {
        setTimeout(() => clearMessage(), 8000)
    }, [message, clearMessage])

    const clearSignedMessage = () => {
        setSignedMessage("")
    }

    const changeHandler = (event: any) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const loginHandler = async (event: any) => {
        try {
            if (token) {
                event.preventDefault()
                clearMessage()
                setSignedMessage("Вы уже вошли в систему")
                setTimeout(() => clearSignedMessage(), 8000)
                return
            } else if (formData.email === "" || formData.password === "") {
                event.preventDefault()

                setSignedMessage("Введите данные для входа")
                setTimeout(() => clearSignedMessage(), 8000)
                return
            }

            const data = await request("/api/authorization/login", "POST", { ...formData })

            dispatch(userTokenSave(data.token))
            dispatch(userIdSave(data.userId))
            dispatch(userNicknameSave(data.nickname))

            localStorage.setItem("saveChat", JSON.stringify({ token: data.token, nickname: data.nickname, userId: data.userId }))

            history(`/usersroom/${data.nickname}`)
        } catch (e) { }
    }


    return (
        <>
            <div className="authorization-wrapper">

                <form className="authorization-form">
                <p className="logo-text">Magic Chat</p>
                    <h1 className="authorization-header">Авторизация:</h1>
                    <input id="emailInput" type="email" placeholder="Введите email" name="email" autoFocus onChange={changeHandler} />
                    <label htmlFor="emailInput">Введите email</label>
                    <input id="passworInput" type="password" placeholder="Введите пароль" name="password" onChange={changeHandler} />
                    <label htmlFor="passworInput">Введите пароль</label>
                    <div className="authorization-buttons">
                        <button className="loginButton" disabled={loading} onClick={loginHandler}>Войти</button>
                        <Link to={"/registration"}><button className="registrationButton" disabled={loading}>Регистрация</button></Link>
                    </div>
                    {!loading && <div className="message-box">{`${message !== null && signedMessage === "" ? message : ""}${signedMessage !== "" ? signedMessage : ""}`}</div>}
                    {loading && <Loader />}
                </form>

            </div>
        </>
    )
}

export default AuthorizationPage