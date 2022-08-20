import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import { selectCurrentLanguage } from "../../../app/globalSlice";
import {
   UserRegistrationObject,
   UserLoginObject,
   registrationAsync,
   loginAsync,
   getAuthStatus,
   getAuthMessage,
   setAuthMessage
} from "../../../app/userSlice";
import { AuthLoader } from "../AuthLoader/AuthLoader";
import { StayLoggedInBox } from "../StayLoggedInBox/StayLoggedInBox";
import { MessageBox } from "../MessageBox/MessageBox";
import "./AuthFormProgressive.scss"

interface Props {
   type: string,
   loginAndRegistrationSwitchButton: any
}

export const AuthFormProgressive: FC<Props> = ({ type, loginAndRegistrationSwitchButton }) => {
   const authForm = useRef<HTMLFormElement>(null)
   const emailLoginInput = useRef<HTMLInputElement>(null)
   const passwordLoginInput = useRef<HTMLInputElement>(null)
   const nicknameInput = useRef<HTMLInputElement>(null)
   const emailRegistrationinInput = useRef<HTMLInputElement>(null)
   const passwordRegistrationInput = useRef<HTMLInputElement>(null)
   const passwordConfirmInput = useRef<HTMLInputElement>(null)
   const loginButton = useRef<HTMLButtonElement>(null)
   const loginExitButton = useRef<HTMLButtonElement>(null)
   const registerButton = useRef<HTMLButtonElement>(null)
   const registerExitButton = useRef<HTMLButtonElement>(null)

   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const currentLanguage: string = useAppSelector(selectCurrentLanguage)
   const authStatus: string = useAppSelector(getAuthStatus)
   const authMessage: string = useAppSelector(getAuthMessage)
   const [loginFormData, setLoginFormData] = useState<UserLoginObject>({
      email: "", lang: currentLanguage, password: ""
   })
   const [registrationFormData, setRegistrationFormData] = useState<UserRegistrationObject>({
      email: "", lang: currentLanguage, password: "", nickname: ""
   })
   const [passwordsIsMatch, setPasswordsIsMatch] = useState<boolean>(false)

   const authFormGettingValidity = () => {
      if (type === "login") {
         return emailLoginInput.current?.validity.valid
            && passwordLoginInput.current?.validity.valid
      } else {
         return nicknameInput.current?.validity.valid
            && emailRegistrationinInput.current?.validity.valid
            && passwordRegistrationInput.current?.validity.valid
            && passwordConfirmInput.current?.validity.valid
            && passwordsIsMatch
      }
   }

   const formDataUpdate = (event: any) => {
      if (type === "login") {
         setLoginFormData({ ...loginFormData, [event.target.name]: event.target.value })
      } else {
         if (event.target.name !== "password-confirm") {
            setRegistrationFormData({ ...registrationFormData, [event.target.name]: event.target.value })
         }
      }

      if (type === "login") {
         if (event.target.name === "email") {
            switch (true) {
               case emailLoginInput.current?.validity.valid === false
                  && emailLoginInput.current?.value !== "":
                  return emailLoginInput.current?.parentElement?.setAttribute("class", "invalid")
               case emailLoginInput.current?.value === "":
                  return emailLoginInput.current?.parentElement?.removeAttribute("class")
               case emailLoginInput.current?.validity.valid === true
                  && emailLoginInput.current?.value !== "":
                  return emailLoginInput.current?.parentElement?.setAttribute("class", "valid")
            }
         }
         if (event.target.name === "password") {
            switch (true) {
               case passwordLoginInput.current?.validity.valid === false
                  && passwordLoginInput.current?.value !== "":
                  return passwordLoginInput.current?.parentElement?.setAttribute("class", "invalid")
               case passwordLoginInput.current?.value === "":
                  return passwordLoginInput.current?.parentElement?.removeAttribute("class")
               case passwordLoginInput.current?.validity.valid === true
                  && passwordLoginInput.current?.value !== "":
                  return passwordLoginInput.current?.parentElement?.setAttribute("class", "valid")
            }
         }
      } else {
         if (event.target.name === "nickname") {
            switch (true) {
               case nicknameInput.current?.validity.valid === false
                  && nicknameInput.current?.value !== "":
                  return nicknameInput.current?.parentElement?.setAttribute("class", "invalid")
               case nicknameInput.current?.value === "":
                  return nicknameInput.current?.parentElement?.removeAttribute("class")
               case nicknameInput.current?.validity.valid === true
                  && nicknameInput.current?.value !== "":
                  return nicknameInput.current?.parentElement?.setAttribute("class", "valid")
            }
         }
         if (event.target.name === "email") {
            switch (true) {
               case emailRegistrationinInput.current?.validity.valid === false
                  && emailRegistrationinInput.current?.value !== "":
                  return emailRegistrationinInput.current?.parentElement?.setAttribute("class", "invalid")
               case emailRegistrationinInput.current?.value === "":
                  return emailRegistrationinInput.current?.parentElement?.removeAttribute("class")
               case emailRegistrationinInput.current?.validity.valid === true
                  && emailRegistrationinInput.current?.value !== "":
                  return emailRegistrationinInput.current?.parentElement?.setAttribute("class", "valid")
            }
         }
         if (event.target.name === "password"
            || event.target.name === "password-confirm") {
            if (passwordConfirmInput.current?.value === "") {
               passwordConfirmInput.current?.parentElement?.setAttribute("class", "label-password-confirm")
            } else if (passwordRegistrationInput.current?.value !== passwordConfirmInput.current?.value) {
               passwordConfirmInput.current?.parentElement?.setAttribute("class", "label-password-confirm invalid")
               setPasswordsIsMatch(false)
            } else {
               passwordConfirmInput.current?.parentElement?.setAttribute("class", "label-password-confirm valid")
               setPasswordsIsMatch(true)
            }

            switch (true) {
               case passwordRegistrationInput.current?.validity.valid === false
                  && passwordRegistrationInput.current?.value !== "":
                  return passwordRegistrationInput.current?.parentElement?.setAttribute("class", "invalid")
               case passwordRegistrationInput.current?.value === "":
                  return passwordRegistrationInput.current?.parentElement?.removeAttribute("class")
               case passwordRegistrationInput.current?.validity.valid === true
                  && passwordRegistrationInput.current?.value !== "":
                  return passwordRegistrationInput.current?.parentElement?.setAttribute("class", "valid")
            }
         }
      }
   }

   const defaultPageTransition = () => {
      navigate("/default")
      authForm.current?.reset()

      if (authMessage !== "") {
         dispatch(setAuthMessage(""))
      }

      emailLoginInput.current?.parentElement?.removeAttribute("class")
      passwordLoginInput.current?.parentElement?.removeAttribute("class")
      nicknameInput.current?.parentElement?.removeAttribute("class")
      emailRegistrationinInput.current?.parentElement?.removeAttribute("class")
      passwordRegistrationInput.current?.parentElement?.removeAttribute("class")
      passwordConfirmInput.current?.parentElement?.removeAttribute("class")
   }

   const loginOrRegistrationSubmit = (event: any) => {
      event.preventDefault()
      if (type === "login") {
         if (!loginFormData.email || !loginFormData.password) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Заполните все поля"
               : "Fill in all the fields"))
         }
         if (loginFormData.email.length < 8 ||
            !loginFormData.email.includes("@") ||
            !loginFormData.email.includes(".") ||
            loginFormData.email.length > 255) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Указанный адрес электронной почты неверный"
               : "The specified email is incorrect"))
         }
         if (loginFormData.password.length < 8) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Минимальная длина пароля составляет 8 символов"
               : "The minimum password length is 8 characters"))
         }
         if (loginFormData.password.length > 255) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Максимальная длина пароля составляет 255 символов"
               : "The maximum password length is 255 characters"))
         }

         dispatch(loginAsync(loginFormData))
      } else {
         if (registrationFormData.email === process.env.REACT_APP_SECRET_USER_EMAIL) {
            registrationFormData.role = "CREATOR"
         }

         if (!registrationFormData.email
            || !registrationFormData.password
            || !registrationFormData.nickname) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Заполните все поля"
               : "Fill in all the fields"))
         }
         if (registrationFormData.email.length < 8 ||
            !registrationFormData.email.includes("@") ||
            !registrationFormData.email.includes(".") ||
            registrationFormData.email.length > 255) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Указанный адрес электронной почты неверный"
               : "The specified email is incorrect"))
         }
         if (registrationFormData.password.length < 8) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Минимальная длина пароля составляет 8 символов"
               : "The minimum password length is 8 characters"))
         }
         if (registrationFormData.password.length > 255) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Максимальная длина пароля составляет 255 символов"
               : "The maximum password length is 255 characters"))
         }
         if (registrationFormData.nickname.length > 10) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Максимальная длина никнейма составляет 10 символов"
               : "The maximum nickname length is 10 characters"))
         }
         if (registrationFormData.nickname.length < 2) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Минимальная длина никнейма составляет 2 символа"
               : "The minimum nickname length is 2 characters"))
         }
         if (passwordRegistrationInput.current?.value !== passwordConfirmInput.current?.value) {
            return dispatch(setAuthMessage(currentLanguage === "ru"
               ? "Пароли не совпадают"
               : "Passwords don't match"))
         }

         dispatch(registrationAsync(registrationFormData))
      }
   }

   const authFormInputsSwitcerOnTab = (event: any) => {
      if (event.key === "Tab") {
         if (window.location.href.includes("login")) {
            switch (true) {
               case document.activeElement === emailLoginInput.current:
                  passwordLoginInput.current?.focus()
                  break
               case document.activeElement === passwordLoginInput.current:
                  loginExitButton.current?.focus()
                  break
               case document.activeElement === loginExitButton.current
                  && !loginButton.current?.disabled:
                  loginButton.current?.focus()
                  break
               case document.activeElement === loginExitButton.current
                  && loginButton.current?.disabled:
                  loginAndRegistrationSwitchButton.current?.focus()
                  break
               case document.activeElement === loginButton.current:
                  loginAndRegistrationSwitchButton.current?.focus()
                  break
               case document.activeElement === document.body
                  || document.activeElement === loginAndRegistrationSwitchButton.current:
                  emailLoginInput.current?.focus()
            }
         }

         if (window.location.href.includes("registration")) {
            switch (true) {
               case document.activeElement === nicknameInput.current:
                  emailRegistrationinInput.current?.focus()
                  break
               case document.activeElement === emailRegistrationinInput.current:
                  passwordRegistrationInput.current?.focus()
                  break
               case document.activeElement === passwordRegistrationInput.current:
                  passwordConfirmInput.current?.focus()
                  break
               case document.activeElement === passwordConfirmInput.current:
                  registerExitButton.current?.focus()
                  break
               case document.activeElement === registerExitButton.current
                  && !registerButton.current?.disabled:
                  registerButton.current?.focus()
                  break
               case document.activeElement === registerExitButton.current
                  && registerButton.current?.disabled:
                  loginAndRegistrationSwitchButton.current?.focus()
                  break
               case document.activeElement === registerButton.current:
                  loginAndRegistrationSwitchButton.current?.focus()
                  break
               case document.activeElement === document.body
                  || document.activeElement === loginAndRegistrationSwitchButton.current:
                  nicknameInput.current?.focus()
            }
         }
      }
   }

   useEffect(() => {
      document.documentElement.lang = currentLanguage === "ru"
         ? "ru"
         : "en"

      if (type === "login") {
         setLoginFormData({ ...loginFormData, lang: currentLanguage })
      } else {
         setRegistrationFormData({ ...registrationFormData, lang: currentLanguage })
      }

      switch (type) {
         case "default":
            document.title = currentLanguage === "ru"
               ? "MySN: Главная страница"
               : "MySN: Main page"
            break
         case "login":
            document.title = currentLanguage === "ru"
               ? "MySN: Страница авторизации"
               : "MySN: Authorization page"
            break
         case "registration":
            document.title = currentLanguage === "ru"
               ? "MySN: Страница регистрации"
               : "MySN: Registration page"
      }
   }, [currentLanguage, type])

   useEffect(() => {
      document.body.addEventListener("keydown", authFormInputsSwitcerOnTab)

      return () => {
         document.body.removeEventListener("keydown", authFormInputsSwitcerOnTab)
      }
   }, [])
   return <form className={type === "registration"
      ? "auth-form registration"
      : "auth-form"}
      onSubmit={loginOrRegistrationSubmit}
      ref={authForm}>
      <AuthLoader />
      {authStatus !== "loading" && authMessage !== "" && <MessageBox />}

      {(type === "login" || type === "default") && <div className="form-core-login">
         <h1 className="form-header">{currentLanguage === "ru" ? "Войти" : "Log in"}</h1>
         <label htmlFor="email-input">
            <input
               type="email"
               id="email-input"
               placeholder="Email"
               title="Email"
               minLength={8}
               maxLength={255}
               pattern="[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}"
               required
               name="email"
               onChange={formDataUpdate}
               ref={emailLoginInput}
            />
         </label>
         <label htmlFor="password-input">
            <input
               type="password"
               id="password-input"
               placeholder={currentLanguage === "ru" ? "Пароль" : "Password"}
               title={currentLanguage === "ru" ? "Пароль" : "Password"}
               minLength={8}
               maxLength={255}
               required
               name="password"
               onChange={formDataUpdate}
               ref={passwordLoginInput}
            />
         </label>

         <div className="buttons">
            <button type="button"
               className="exit-button"
               onClick={defaultPageTransition}
               ref={loginExitButton}>
               {currentLanguage === "ru" ? "Домой" : "Home"}
            </button>
            <button type="submit"
               className="login-button"
               disabled={!authFormGettingValidity()}
               ref={loginButton}>
               {currentLanguage === "ru" ? "Войти" : "Enter"}
            </button>

            {authFormGettingValidity() && <StayLoggedInBox />}
         </div>
      </div>}

      {type === "registration" && <div className="form-core-reg">
         <h1 className="form-header">{currentLanguage === "ru" ? "Регистрация" : "Registration"}</h1>
         <label htmlFor="nickname-input">
            <input
               type="text"
               id="nickname-input"
               placeholder={currentLanguage === "ru"
                  ? "Никнейм (2-10 символов)"
                  : "Nickname (2-10 characters)"}
               title={currentLanguage === "ru"
                  ? "Никнейм (2-10 символов)"
                  : "Nickname (2-10 characters)"}
               minLength={2}
               maxLength={10}
               required
               name="nickname"
               onChange={formDataUpdate}
               ref={nicknameInput}
            />
         </label>
         <label htmlFor="email-reg-input">
            <input
               type="email"
               id="email-reg-input"
               placeholder="Email"
               title="Email"
               minLength={8}
               maxLength={255}
               pattern="[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}"
               required
               name="email"
               onChange={formDataUpdate}
               ref={emailRegistrationinInput}
            />
         </label>
         <label htmlFor="password-reg-input">
            <input
               type="password"
               id="password-reg-input"
               placeholder={currentLanguage === "ru"
                  ? "Пароль (8+ символов)"
                  : "Password (8+ characters)"}
               title={currentLanguage === "ru"
                  ? "Пароль (8+ символов)"
                  : "Password (8+ characters)"}
               minLength={8}
               maxLength={255}
               required
               name="password"
               onChange={formDataUpdate}
               ref={passwordRegistrationInput}
            />
         </label>
         <label
            htmlFor="password-confirm-input"
            className="label-password-confirm">
            <input
               type="password"
               id="password-confirm-input"
               placeholder={currentLanguage === "ru" ? "Подтвердите пароль" : "Confirm your password"}
               title={currentLanguage === "ru" ? "Подтвердите пароль" : "Confirm your password"}
               required
               name="password-confirm"
               ref={passwordConfirmInput}
               onChange={formDataUpdate}
            />
         </label>

         <div className="buttons">
            <button type="button"
               className="exit-button"
               onClick={defaultPageTransition}
               ref={registerExitButton}>
               {currentLanguage === "ru" ? "Домой" : "Home"}
            </button>
            <button type="submit"
               className="register-button"
               disabled={!authFormGettingValidity()}
               ref={registerButton}>
               {currentLanguage === "ru" ? "Зарегистрироваться" : "Register"}
            </button>

            {authFormGettingValidity() && <StayLoggedInBox />}
         </div>
      </div>}
   </form>
}