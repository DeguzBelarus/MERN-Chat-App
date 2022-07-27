import { useState, FC, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import {
   registrationAsync,
   authMessageSave,
   selectAuthMessage,
   selectAuthStatus
} from "../../app/userSlice";

import { RegistrationForm } from "../components/RegistrationForm/RegistrationForm";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher"
import "./RegistrationPage.scss"

export const RegistrationPage: FC = () => {
   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const loading = useAppSelector(selectAuthStatus)
   const message = useAppSelector(selectAuthMessage)

   const [formData, setFormData]: any = useState({ nickname: "", email: "", password: "", currentLanguage: currentLanguage })
   const [clearMessageTimeout, setClearMessageTimeout]: any = useState(null)

   const changeHandler = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
   }

   const registerHandler = async (event: any) => {
      event.preventDefault()
      if (formData.email.length < 8 || !formData.email.includes("@") || !formData.email.includes(".")) {
         return dispatch(authMessageSave(currentLanguage === "ru" ? "Введите корректный email" : "Enter the correct email"))
      }

      if (formData.password.length < 8) {
         return dispatch(authMessageSave(currentLanguage === "ru" ? "Введите корректный пароль" : "Enter the correct password"))
      }

      if (formData.nickname.length < 2 || formData.nickname.length > 10) {
         return dispatch(authMessageSave(currentLanguage === "ru" ? "Введите корректный никнейм" : "Enter the correct nickname"))
      }

      dispatch(registrationAsync(JSON.stringify({ ...formData })))
   }

   const goToMainPage = () => {
      navigate("/")
   }

   useEffect(() => {
      if (clearMessageTimeout) {
         clearTimeout(clearMessageTimeout)
      }

      const clearMessageTimeoutCurrent = setTimeout(() => dispatch(authMessageSave("")), 5000)
      setClearMessageTimeout(clearMessageTimeoutCurrent)
   }, [message])

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MySN: Страница регистрации" : "MySN: Registration page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
      setFormData({ ...formData, currentLanguage: currentLanguage })
   }, [currentLanguage])

   useEffect(() => {
      dispatch(authMessageSave(""))
   }, [])

   return (
      <div className="registration-wrapper">
         <div className="switcher-wrapper">
            <LanguageSwitcher />
         </div>

         <RegistrationForm
            registerHandler={registerHandler}
            changeHandler={changeHandler}
            loading={loading}
            mainPageReturn={goToMainPage}
            message={message}
            formData={formData} />

         <span className="copyright">© Deguz, design: Annet, 2022</span>
      </div >
   )
}