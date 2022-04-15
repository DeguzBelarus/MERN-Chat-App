import { FC, useRef, useEffect } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import { Loader } from "../../components/Loader/Loader";
import { MessageBox } from "../../components/MessageBox/MessageBox"

import "./AuthorizationForm.scss"

interface Props {
   loginHandler: any,
   loading: boolean,
   transitionToRegitrationPage: any,
   message: string,
   changeHandler: any
}

export const AuthorizationForm: FC<Props> = (
   { loginHandler, loading, transitionToRegitrationPage, message, changeHandler }) => {
   const enterButton: any = useRef(null)

   const currentLanguage = useAppSelector(selectCurrentLanguage)

   useEffect(() => {
      if (loading) {
         enterButton.current.style.backgroundColor = "rgba(0,150,0, 0.8)"
      } else {
         enterButton.current.style.backgroundColor = "#00897b"
      }
   }, [loading])

   return <form id="login-form" onSubmit={loginHandler}>
      <p className="logo-text">MySN</p>

      <label htmlFor="emailInput" className="input-label">
         <input type="email" id="emailInput" placeholder={currentLanguage === "ru" ? "Введите email" : "Enter email"} name="email" required autoFocus onChange={changeHandler} />
         <span>{currentLanguage === "ru" ? "Введите email" : "Enter email"}</span>
         <div className="line"></div>
      </label>

      <label htmlFor="passworInput" className="input-label">
         <input type="password" id="passworInput" placeholder={currentLanguage === "ru" ? "Введите пароль" : "Enter the password"} name="password" required minLength={8} onChange={changeHandler} />
         <span>{currentLanguage === "ru" ? "Введите пароль" : "Enter the password"}</span>
         <div className="line"></div>
      </label>

      <div className="authorization-buttons">
         <input type="submit" className="login-button" form="login-form" value={loading ? currentLanguage === "ru" ? "Входим..." : "Enter..." : currentLanguage === "ru" ? "Войти" : "Enter"} disabled={loading} ref={enterButton} />
         <button type="button" className="registration-page-button" disabled={loading} onClick={transitionToRegitrationPage}>{currentLanguage === "ru" ? "Регистрация" : "Registration"}</button>
      </div>

      {!loading && message && <MessageBox message={message} />}
      {loading && <Loader />}
   </form >
}
