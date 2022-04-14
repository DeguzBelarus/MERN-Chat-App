import { useState, useEffect, FC, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userTokenSave, userIdSave, userNicknameSave, selectToken } from "../../app/userSlice";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { currentLanguageSave } from "../../app/globalSlice";
import { useForm } from "../../hooks/useForm.hook";

import Loader from "../components/Loader/Loader";
import { MessageBox } from "../components/MessageBox/MessageBox"
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher"

import "./AuthorizationPage.scss"

const AuthorizationPage: FC = () => {
   const enterButton: any = useRef(null)

   const dispatch = useAppDispatch()
   const navigate = useNavigate()
   const token = useAppSelector(selectToken)
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const { loading, message, request, setMessage } = useForm()
   const [formData, setFormData]: any = useState({ email: "", password: "", currentLanguage: currentLanguage })
   const [clearMessageTimeout, setClearMessageTimeout]: any = useState(null)

   const changeHandler = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
   }

   const loginHandler = async (event: any) => {
      event.preventDefault()
      try {
         const data = await request("/api/authorization/login", "POST", { ...formData })

         dispatch(userTokenSave(data.token))
         dispatch(userIdSave(data.userId))
         dispatch(userNicknameSave(data.nickname))

         localStorage.setItem("saveChat", JSON.stringify({ token: data.token, nickname: data.nickname, userId: data.userId }))
         navigate(`/usersroom/${data.nickname}`)
      } catch (e) {
         console.log("Error:", e);
      }
   }

   const transitionToRegitrationPage = () => {
      navigate("/registration")
   }

   useEffect(() => {
      if (localStorage.getItem("saveChat")) {
         let save: any = localStorage.getItem('saveChat')
         if (save !== null) {
            save = JSON.parse(save)
            dispatch(userTokenSave(save.token))
            dispatch(userIdSave(save.userId))
            dispatch(userNicknameSave(save.nickname))
            if (currentLanguage === "ru") {
               setMessage(`${save.nickname}, Вы успешно вошли в систему!`)
            } else {
               setMessage(`${save.nickname}, You have successfully logged in!`)
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

      const clearMessageTimeoutCurrent = setTimeout(() => setMessage(""), 5000)
      setClearMessageTimeout(clearMessageTimeoutCurrent)
   }, [message])

   useEffect(() => {
      if (loading) {
         enterButton.current.style.backgroundColor = "rgba(0,150,0, 0.8)"
      } else {
         enterButton.current.style.backgroundColor = "#00897b"
      }
   }, [loading])

   useEffect(() => {
      document.title = currentLanguage === "ru" ? "MySN: Главная страница" : "MySN: Main page"
      document.documentElement.lang = currentLanguage === "ru" ? "ru" : "en"
      setFormData({ ...formData, currentLanguage: currentLanguage })
   }, [currentLanguage])

   useEffect(() => {
      if (navigator.language === "ru") return
      dispatch(currentLanguageSave("en"))
   }, [])

   return (
      <div className="authorization-wrapper">
         <LanguageSwitcher />

         <form id="authorization-form" onSubmit={loginHandler}>
            <p className="logo-text">MySN</p>

            <input id="emailInput" type="email" placeholder={currentLanguage === "ru" ? "Введите email" : "Enter email"} name="email" required autoFocus onChange={changeHandler} />
            <label htmlFor="emailInput">{currentLanguage === "ru" ? "Введите email" : "Enter email"}</label>

            <input id="passworInput" type="password" placeholder={currentLanguage === "ru" ? "Введите пароль" : "Enter the password"} name="password" required minLength={8} onChange={changeHandler} />
            <label htmlFor="passworInput">{currentLanguage === "ru" ? "Введите пароль" : "Enter the password"}</label>

            <div className="authorization-buttons">
               <input type="submit" form="authorization-form" value={loading ? currentLanguage === "ru" ? "Входим..." : "Enter..." : currentLanguage === "ru" ? "Войти" : "Enter"} className="loginButton" disabled={loading} ref={enterButton} />
               <button type="button" className="registrationButton" disabled={loading} onClick={transitionToRegitrationPage}>{currentLanguage === "ru" ? "Регистрация" : "Registration"}</button>
            </div>

            {!loading && message && <MessageBox message={message} />}
            {loading && <Loader />}
         </form >

         <span className="copyright">© Deguz, 2022</span>
      </div >
   )
}

export default AuthorizationPage