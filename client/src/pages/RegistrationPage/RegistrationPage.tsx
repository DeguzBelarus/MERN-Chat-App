import { useState, FC, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom"
import { selectCurrentLanguage } from "../../app/globalSlice";
import { useForm } from "../../hooks/useForm.hook";

import Loader from "../components/Loader/Loader";
import { MessageBox } from "../components/MessageBox/MessageBox";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher"

import "./RegistrationPage.scss"

const RegistrationPage: FC = () => {
   const registerButton: any = useRef(null)

   const navigate = useNavigate()
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const { loading, message, request, setMessage } = useForm()
   const [formData, setFormData]: any = useState({ nickname: "", email: "", password: "", currentLanguage: currentLanguage })
   const [clearMessageTimeout, setClearMessageTimeout]: any = useState(null)

   const changeHandler = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
   }

   const registerHandler = async (event: any) => {
      event.preventDefault()
      try {
         const data = await request("/api/authorization/registration", "POST", { ...formData })
      } catch (e) {
         console.log("Error:", e);
      }
   }

   const mainPageReturn = () => {
      navigate("/")
   }

   useEffect(() => {
      if (clearMessageTimeout) {
         clearTimeout(clearMessageTimeout)
      }

      const clearMessageTimeoutCurrent = setTimeout(() => setMessage(""), 5000)
      setClearMessageTimeout(clearMessageTimeoutCurrent)
   }, [message])

   useEffect(() => {
      if (loading) {
         registerButton.current.style.backgroundColor = "rgba(0,150,0, 0.8)"
      } else {
         registerButton.current.style.backgroundColor = "#00897b"
      }
   }, [loading])

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MySN: Страница регистрации" : "MySN: Registration page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
      setFormData({ ...formData, currentLanguage: currentLanguage })
   }, [currentLanguage])

   return (
      <div className="registration-wrapper">
         <LanguageSwitcher />

         <form id="registration-form" onSubmit={registerHandler}>
            <p className="logo-text">MySN</p>
            <h1 className="registration-header">{currentLanguage === "ru" ? "Регистрация:" : "Registration:"}</h1>

            <input id="nicknameInput" type="text" placeholder={currentLanguage === "ru" ? "От 2 до 10 символов" : "From 2 to 10 characters"} name="nickname" autoFocus required minLength={2} maxLength={10} onChange={changeHandler} />
            <label htmlFor="nicknameInput">{currentLanguage === "ru" ? "Введите никнейм" : "Enter the nickname"}</label>

            <input id="emailInput" type="email" placeholder={currentLanguage === "ru" ? "Формат: mail@mail.domen" : "Format: mail@mail.domen"} name="email" required onChange={changeHandler} />
            <label htmlFor="emailInput">{currentLanguage === "ru" ? "Введите email" : "Enter email"}</label>

            <input id="passworInput" type="password" placeholder={currentLanguage === "ru" ? "Минимум 8 символов" : "Minimum of 8 characters"} name="password" required minLength={8} onChange={changeHandler} />
            <label htmlFor="passworInput">{currentLanguage === "ru" ? "Введите пароль" : "Enter the password"}</label>

            <div className="registration-buttons">
               <button type="button" className="returnButton" disabled={loading} onClick={mainPageReturn}>{currentLanguage === "ru" ? "Назад" : "Back"}</button>
               <input type="submit" form="registration-form" value={loading ? currentLanguage === "ru" ? "Регистрируем..." : "Registering..." : currentLanguage === "ru" ? "Зарегистрироваться" : "Register"} className="registrationApplyButton" disabled={loading} ref={registerButton} />
            </div>

            {!loading && message && <MessageBox message={message} />}
            {loading && <Loader />}
         </form>

         <span className="copyright">© Deguz, 2022</span>
      </div >
   )
}

export default RegistrationPage