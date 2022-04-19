import { FC, useRef, useEffect } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import { Loader } from "../../components/Loader/Loader";
import { MessageBox } from "../../components/MessageBox/MessageBox";

import "./RegistrationForm.scss"

interface Props {
   registerHandler: any,
   changeHandler: any,
   loading: boolean,
   mainPageReturn: any,
   message: string,
   formData: object
}

export const RegistrationForm: FC<Props> = (
   { registerHandler, changeHandler, loading, mainPageReturn, message, formData }) => {
   const registerButton: any = useRef(null)
   const emailInput: any = useRef(null)
   const passwordInput: any = useRef(null)
   const nicknameInput: any = useRef(null)


   const currentLanguage = useAppSelector(selectCurrentLanguage)

   useEffect(() => {
      if (loading) {
         registerButton.current.style.backgroundColor = "yellowgreen"
         registerButton.current.style.color = "#00897b"
         registerButton.current.style.borderColor = "yellowgreen"
      } else {
         if (emailInput.current.validity.valid
            && passwordInput.current.validity.valid
            && nicknameInput.current.validity.valid) {
            registerButton.current.style.backgroundColor = "#00897b"
            registerButton.current.style.color = "white"
            registerButton.current.style.borderColor = "#00897b"
         } else {
            registerButton.current.style.backgroundColor = "white"
            registerButton.current.style.color = "#00897b"
            registerButton.current.style.borderColor = "#00897b"
         }
      }
   }, [loading])

   useEffect(() => {
      if (emailInput.current.validity.valid
         && passwordInput.current.validity.valid
         && nicknameInput.current.validity.valid) {
         registerButton.current.style.backgroundColor = "#00897b"
         registerButton.current.style.color = "white"
         registerButton.current.style.borderColor = "#00897b"
      } else {
         registerButton.current.style.backgroundColor = "white"
         registerButton.current.style.color = "#00897b"
         registerButton.current.style.borderColor = "#00897b"
      }
   }, [formData])

   return <form id="registration-form" onSubmit={registerHandler}>
      <p className="logo-text">MySN</p>
      <h1 className="registration-header">{currentLanguage === "ru" ? "Регистрация:" : "Registration:"}</h1>

      <label htmlFor="nicknameInput" className="input-label">
         <input type="text"
            id="nicknameInput"
            placeholder={currentLanguage === "ru" ? "От 2 до 10 символов" : "From 2 to 10 characters"}
            name="nickname"
            autoFocus
            required
            autoComplete="off"
            minLength={2}
            maxLength={10}
            onChange={changeHandler}
            ref={nicknameInput} />
         <span>{currentLanguage === "ru" ? "Введите никнейм" : "Enter the nickname"}</span>
         <div className="line"></div>
      </label>

      <label htmlFor="emailInput" className="input-label">
         <input type="email"
            id="emailInput"
            placeholder={currentLanguage === "ru" ? "Формат: mail@mail.domen" : "Format: mail@mail.domen"}
            name="email"
            required
            autoComplete="off"
            onChange={changeHandler}
            ref={emailInput} />
         <span>{currentLanguage === "ru" ? "Введите email" : "Enter email"}</span>
         <div className="line"></div>
      </label>

      <label htmlFor="passworInput" className="input-label">
         <input type="password"
            id="passworInput" placeholder={currentLanguage === "ru" ? "Минимум 8 символов" : "Minimum of 8 characters"}
            name="password"
            required
            autoComplete="off"
            minLength={8}
            onChange={changeHandler}
            ref={passwordInput} />
         <span>{currentLanguage === "ru" ? "Введите пароль" : "Enter the password"}</span>
         <div className="line"></div>
      </label>

      <div className="registration-buttons">
         <button type="button" className="return-button" disabled={loading} onClick={mainPageReturn}>{currentLanguage === "ru" ? "Назад" : "Back"}</button>
         <input type="submit" className="registration-apply-button" form="registration-form" value={loading ? currentLanguage === "ru" ? "Регистрация..." : "Registering..." : currentLanguage === "ru" ? "Зарегистрироваться" : "Register"} disabled={loading} ref={registerButton} />
      </div>

      {!loading && message && <MessageBox message={message} />}
      {loading && <Loader />}
   </form>
}