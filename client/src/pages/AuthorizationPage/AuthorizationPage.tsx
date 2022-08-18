import { useState, useEffect, FC } from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import {
   setUserToken,
   setUserId,
   setUserNickname,
   getToken,
   loginAsync,
   getIsStayLoggedIn,
   setIsStayLoggedIn,
   setAuthMessage,
   getAuthMessage,
   getAuthStatus
} from "../../app/userSlice";
import { currentLanguageSave } from "../../app/globalSlice";

import { AuthorizationForm } from "../components/AuthorizationForm/AuthorizationForm";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher"
import "./AuthorizationPage.scss"

export const AuthorizationPage: FC = () => {
   const dispatch = useAppDispatch()
   const navigate = useNavigate()

   const token = useAppSelector(getToken)
   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const isStayLoggedIn = useAppSelector(getIsStayLoggedIn)
   const loading = useAppSelector(getAuthStatus)
   const message = useAppSelector(getAuthMessage)

   const [formData, setFormData]: any = useState({ email: "", password: "", currentLanguage: currentLanguage })
   const [clearMessageTimeout, setClearMessageTimeout]: any = useState(null)

   const changeHandler = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
   }

   const loginHandler = async (event: any) => {
      event.preventDefault()
      if (formData.email.length < 8 || !formData.email.includes("@") || !formData.email.includes(".")) {
         return dispatch(setAuthMessage(currentLanguage === "ru" ? "Введите корректный email" : "Enter the correct email"))
      }

      if (formData.password.length < 8) {
         return dispatch(setAuthMessage(currentLanguage === "ru" ? "Введите корректный пароль" : "Enter the correct password"))
      }

      dispatch(loginAsync(JSON.stringify({ ...formData })))
   }

   const goToRegitrationPage = () => {
      navigate("/registration")
   }

   useEffect(() => {
      if (localStorage.getItem("saveChat")) {
         let save: any = localStorage.getItem('saveChat')
         if (save) {
            save = JSON.parse(save)
            dispatch(setUserToken(save.token))
            dispatch(setUserId(save.userId))
            dispatch(setUserNickname(save.nickname))

            if (currentLanguage === "ru") {
               dispatch(setAuthMessage(`${save.nickname}, Вы успешно вошли в систему!`))
            } else {
               dispatch(setAuthMessage(`${save.nickname}, You have successfully logged in!`))
            }

            navigate(`/usersroom/${save.nickname}`)
         }
      } else {
         navigate("/")
      }
   }, [token])

   useEffect(() => {
      if (clearMessageTimeout) {
         clearTimeout(clearMessageTimeout)
      }

      const clearMessageTimeoutCurrent = setTimeout(() => dispatch(setAuthMessage("")), 5000)
      setClearMessageTimeout(clearMessageTimeoutCurrent)
   }, [message])

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MySN: Главная страница" : "MySN: Main page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
      setFormData({ ...formData, currentLanguage: currentLanguage })
   }, [currentLanguage])

   useEffect(() => {
      dispatch(setAuthMessage(""))
      if (navigator.language !== "ru" && navigator.language !== "ru-RU") {
         dispatch(currentLanguageSave("en"))
      }
   }, [])

   return (
      <div className="authorization-wrapper">
         <div className="switcher-wrapper">
            <LanguageSwitcher />
         </div>

         <AuthorizationForm
            loginHandler={loginHandler}
            loading={loading}
            transitionToRegitrationPage={goToRegitrationPage}
            message={message}
            changeHandler={changeHandler}
            formData={formData}
            isStayLoggedIn={isStayLoggedIn}
            setIsStayLoggedIn={() => dispatch(setIsStayLoggedIn(true))} />

         <span className="copyright">© Deguz, design: Annet, 2022</span>
      </div >
   )
}