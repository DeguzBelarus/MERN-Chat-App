import { useState, FC, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom"
import { selectCurrentLanguage } from "../../app/globalSlice";
import { useForm } from "../../hooks/useForm.hook";

import { RegistrationForm } from "../components/RegistrationForm/RegistrationForm";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher"

import "./RegistrationPage.scss"

export const RegistrationPage: FC = () => {
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
         if (formData.email.length < 8 || !formData.email.includes("@") || !formData.email.includes(".")) {
            return setMessage(currentLanguage === "ru" ? "Введите корректный email" : "Enter the correct email")
         }

         if (formData.password.length < 8) {
            return setMessage(currentLanguage === "ru" ? "Введите корректный пароль" : "Enter the correct password")
         }

         if (formData.nickname.length < 2 || formData.nickname.length > 10) {
            return setMessage(currentLanguage === "ru" ? "Введите корректный никнейм" : "Enter the correct nickname")
         }

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
      document.title = currentLanguage === "ru" ? "MySN: Страница регистрации" : "MySN: Registration page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
      setFormData({ ...formData, currentLanguage: currentLanguage })
   }, [currentLanguage])

   return (
      <div className="registration-wrapper">
         <div className="switcher-wrapper">
            <LanguageSwitcher />
         </div>

         <RegistrationForm
            registerHandler={registerHandler}
            changeHandler={changeHandler}
            loading={loading}
            mainPageReturn={mainPageReturn}
            message={message}
            formData={formData} />

         <span className="copyright">© Deguz, 2022</span>
      </div >
   )
}