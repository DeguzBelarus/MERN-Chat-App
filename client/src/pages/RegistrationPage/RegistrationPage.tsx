import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useForm } from "../../hooks/useForm.hook";
import "./RegistrationPage.scss"

const RegistrationPage = () => {
    const { loading, message, request, clearMessage } = useForm()
    const [formData, setFormData] = useState({ nickname: "", email: "", password: "" })

    useEffect(() => {
        setTimeout(() => clearMessage(), 8000)
    }, [message, clearMessage])

    const changeHandler = (event: any) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const registerHandler = async (event: any) => {
        try {
            if (formData.email === "" || formData.password === "" || formData.nickname) {
                event.preventDefault()
                return
            }

            const data = await request("/api/authorization/registration", "POST", { ...formData })

        } catch (e) { }
    }

    return (
        <div className="registration-wrapper">

            <form className="registration-form">
                <h1 className="registration-header">Регистрация:</h1>
                <label htmlFor="nicknameInput">Введите Ник:</label>
                <input id="nicknameInput" type="text" name="nickname" onChange={changeHandler} />
                <label htmlFor="emailInput">Введите email:</label>
                <input id="emailInput" type="email" name="email" onChange={changeHandler} />
                <label htmlFor="passworInput">Введите пароль:</label>
                <input id="passworInput" type="password" name="password" onChange={changeHandler} />
                <div className="authorization-buttons">
                    <Link to={"/"}><button type="button" className="returnButton" disabled={loading}>Назад</button></Link>
                    <button type="button" className="registrationButton" disabled={loading} onClick={registerHandler}>Зарегистрироваться</button>
                </div>
                <div className="message-box">{message}</div>
            </form>

        </div>
    )
}

export default RegistrationPage