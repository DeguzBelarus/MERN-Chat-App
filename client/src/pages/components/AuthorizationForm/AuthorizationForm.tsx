import { FC, useRef, useEffect } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import mainLogo from "../../../assets/mysnlogo.svg"
import { Loader } from "../../components/Loader/Loader";
import { StayLoggedInBox } from "../StayLoggedInBox/StayLoggedInBox";
import { MessageBox } from "../../components/MessageBox/MessageBox"
import "./AuthorizationForm.scss"
interface Props {
   loginHandler: any,
   loading: string,
   transitionToRegitrationPage: any,
   message: string,
   changeHandler: any,
   formData: object,
   setIsStayLoggedIn: any,
   isStayLoggedIn: boolean
}

export const AuthorizationForm: FC<Props> = (
   { loginHandler,
      loading,
      transitionToRegitrationPage,
      message,
      changeHandler,
      formData,
      setIsStayLoggedIn,
      isStayLoggedIn }) => {
   const enterButton: any = useRef(null)
   const emailInput: any = useRef(null)
   const passwordInput: any = useRef(null)

   const currentLanguage = useAppSelector(selectCurrentLanguage)

   useEffect(() => {
      if (loading === "loading") {
         enterButton.current.style.backgroundColor = "yellowgreen"
         enterButton.current.style.color = "#00897b"
         enterButton.current.style.borderColor = "#00897b"
      } else {
         if (emailInput.current.validity.valid && passwordInput.current.validity.valid) {
            enterButton.current.style.backgroundColor = "#00897b"
            enterButton.current.style.color = "white"
            enterButton.current.style.borderColor = "#00897b"
         } else {
            enterButton.current.style.backgroundColor = "white"
            enterButton.current.style.color = "#00897b"
            enterButton.current.style.borderColor = "#00897b"
         }
      }
   }, [loading])

   useEffect(() => {
      if (emailInput.current.validity.valid && passwordInput.current.validity.valid) {
         enterButton.current.style.backgroundColor = "#00897b"
         enterButton.current.style.color = "white"
         enterButton.current.style.borderColor = "#00897b"
      } else {
         enterButton.current.style.backgroundColor = "white"
         enterButton.current.style.color = "#00897b"
         enterButton.current.style.borderColor = "#00897b"
      }
   }, [formData])

   return <form id="login-form" onSubmit={loginHandler}>
      <label htmlFor="emailInput" className="input-label">
         <input type="email"
            id="emailInput"
            placeholder={currentLanguage === "ru" ? "Введите email" : "Enter your email"}
            name="email"
            required
            autoFocus
            onChange={changeHandler}
            ref={emailInput} />
         <span>{currentLanguage === "ru" ? "Введите email" : "Enter your email"}</span>
         <div className="line"></div>
      </label>

      <label htmlFor="passworInput" className="input-label">
         <input type="password"
            id="passworInput"
            placeholder={currentLanguage === "ru" ? "Введите пароль" : "Enter your password"}
            name="password"
            required
            minLength={8}
            onChange={changeHandler}
            ref={passwordInput} />
         <span>{currentLanguage === "ru" ? "Введите пароль" : "Enter your password"}</span>
         <div className="line"></div>
      </label>

      <div className="authorization-buttons">
         <input type="submit" className="login-button" form="login-form" value={loading === "loading" ? currentLanguage === "ru" ? "Входим..." : "Enter..." : currentLanguage === "ru" ? "Войти" : "Enter"} disabled={loading === "loading" ? true : false} ref={enterButton} />
         <button type="button" className="registration-page-button" disabled={loading === "loading" ? true : false} onClick={transitionToRegitrationPage}>{currentLanguage === "ru" ? "Регистрация" : "Registration"}</button>
         <StayLoggedInBox
            // setIsStayLoggedIn={setIsStayLoggedIn}
            // isStayLoggedIn={isStayLoggedIn}
             />
      </div>

      {/* {loading !== "loading" && message && <MessageBox message={message} />} */}
      {loading === "loading" && <Loader />}
      <img
         className="mainlogo-image"
         src={mainLogo}
         draggable={false}
         alt="the main logo" />
   </form >
}
