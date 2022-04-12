import { useState, useEffect, FC } from "react";
import { Link } from "react-router-dom"
import { useForm } from "../../hooks/useForm.hook";

import Loader from "../components/Loader/Loader";
import "./RegistrationPage.scss"

const RegistrationPage: FC = () => {
   const { loading, message, request, clearMessage, setMessage } = useForm()
   const [formData, setFormData]: any = useState({ nickname: "", email: "", password: "" })

   const changeHandler = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
   }

   const registerHandler = async (event: any) => {
      try {
         if (formData.email === "" || formData.password === "" || formData.nickname === "") {
            event.preventDefault()
            setMessage("Введите данные для регистрации")
            return
         }

         const data = await request("/api/authorization/registration", "POST", { ...formData })

      } catch (e) { }
   }

   const registerHandlerByKeyPress = async (event: any) => {
      if (event.key === "Enter") {
         try {
            if (formData.email === "" || formData.password === "" || formData.nickname === "") {
               event.preventDefault()
               return
            }

            const data = await request("/api/authorization/registration", "POST", { ...formData })

         } catch (e) { }
      }
   }

   const buttonMouseOver = (event: any) => {
      event.target.style.boxShadow = "0 0 10px 1px deeppink"
   }

   const buttonMouseOut = (event: any) => {
      event.target.style.boxShadow = "none"
   }

   useEffect(() => {
      setTimeout(() => clearMessage(), 8000)
   }, [message, clearMessage])

   return (
      <div className="registration-wrapper">

         <form className="registration-form">
            <p className="logo-text">Magic Chat</p>
            <h1 className="registration-header">Регистрация:</h1>
            <input id="nicknameInput" type="text" placeholder="От 2 до 10 символов" name="nickname" autoFocus minLength={2} maxLength={10} onChange={changeHandler} onKeyPress={registerHandlerByKeyPress} />
            <label htmlFor="nicknameInput">Введите никнэйм</label>
            <input id="emailInput" type="email" placeholder="В формате: mail@mail.domen" name="email" onChange={changeHandler} onKeyPress={registerHandlerByKeyPress} />
            <label htmlFor="emailInput">Введите email</label>
            <input id="passworInput" type="password" placeholder="Минимум 8 символов" name="password" onChange={changeHandler} onKeyPress={registerHandlerByKeyPress} />
            <label htmlFor="passworInput">Введите пароль</label>
            <div className="authorization-buttons">
               <Link to={"/"}><button type="button" className="returnButton" disabled={loading} onMouseOver={buttonMouseOver} onMouseOut={buttonMouseOut}>Назад</button></Link>
               <button type="button" className="registrationButton" disabled={loading} onClick={registerHandler} onMouseOver={buttonMouseOver} onMouseOut={buttonMouseOut}>Зарегистрироваться</button>
            </div>
            {!loading && <div className="message-box">{message}</div>}
            {loading && <Loader />}
         </form>

         <span className="copyright">© Deguz, 2022</span>
      </div>
   )
}

export default RegistrationPage