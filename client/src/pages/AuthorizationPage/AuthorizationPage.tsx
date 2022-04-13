import { useState, useEffect, FC, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { userTokenSave, userIdSave, userNicknameSave, selectToken } from "../../app/userSlice";
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

   const { loading, message, request, setMessage } = useForm()
   const [formData, setFormData]: any = useState({ email: "", password: "" })
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
            setMessage(`${save.nickname}, Вы успешно вошли в систему`)
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
      document.title = "MySN: Main page"
   }, [])

   return (
      <div className="authorization-wrapper">
         <LanguageSwitcher />

         <form id="authorization-form" onSubmit={loginHandler}>
            <p className="logo-text">MySN: общение</p>
            <h1 className="authorization-header">Авторизация:</h1>

            <input id="emailInput" type="email" placeholder="Введите email" name="email" required autoFocus onChange={changeHandler} />
            <label htmlFor="emailInput">Введите email</label>

            <input id="passworInput" type="password" placeholder="Введите пароль" name="password" required minLength={8} onChange={changeHandler} />
            <label htmlFor="passworInput">Введите пароль</label>

            <div className="authorization-buttons">
               <input type="submit" form="authorization-form" value={loading ? "Вход..." : "Войти"} className="loginButton" disabled={loading} ref={enterButton} />
               <button type="button" className="registrationButton" disabled={loading} onClick={transitionToRegitrationPage}>Регистрация</button>
            </div>

            {!loading && message && <MessageBox message={message} />}
            {loading && <Loader />}
         </form >

         <span className="copyright">© Deguz, 2022</span>
      </div >
   )
}

export default AuthorizationPage