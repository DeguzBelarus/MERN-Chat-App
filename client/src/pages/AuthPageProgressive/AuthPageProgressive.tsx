import { FC, useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

import { getAuthMessage, setAuthMessage } from "../../app/userSlice";
import { selectCurrentLanguage, currentLanguageSave } from "../../app/globalSlice";
import mainLogoSpiral from "../../assets/mysnlogo-spiral.svg"
import mainLogoSocial from "../../assets/mysnlogo-social.svg"
import mainLogoNetwork from "../../assets/mysnlogo-network.svg"
import mainLogoMy from "../../assets/mysnlogo-my.svg"
import arrow from "../../assets/arrow.svg"
import { AuthFormProgressive } from "../components/AuthFormProgressive/AuthFormProgressive";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
import "./AuthPageProgressive.scss"

interface Props {
   type: string
}

export const AuthPageProgressive: FC<Props> = ({ type }) => {
   const nextButton = useRef<HTMLButtonElement>(null)
   const loginAndRegistrationSwitchButton = useRef<HTMLButtonElement>(null)

   const navigate = useNavigate()
   const dispatch = useAppDispatch()

   const currentLanguage: string = useAppSelector(selectCurrentLanguage)
   const authMessage: string = useAppSelector(getAuthMessage)
   const [nextButtonIsActive, setNextButtonIsActive] = useState<boolean>(false)

   const loginPageTransition = () => {
      if (!nextButtonIsActive) return
      navigate("/login")
   }

   const registrationAndLoginPageTransition = () => {
      if (authMessage !== "") {
         dispatch(setAuthMessage(""))
      }

      document.body.removeEventListener("keydown", mainPageTabBlock)
      if (type === "login") {
         navigate("/registration")
      } else {
         navigate("/login")
      }
   }

   const mainPageTabBlock = (event: any) => {
      if (event.key === "Tab") {
         event.preventDefault()
         if (type === "default") {
            if (document.activeElement === nextButton.current) {
               nextButton.current?.blur()
            } else {
               nextButton.current?.focus()
            }
         }
      }
   }

   useEffect(() => {
      if (navigator.language !== "ru" && navigator.language !== "ru-RU") {
         dispatch(currentLanguageSave("en"))
      }

      setTimeout(() => {
         setNextButtonIsActive(true)
      }, 6500)

      document.body.addEventListener("keydown", mainPageTabBlock)

      return () => {
         document.body.removeEventListener("keydown", mainPageTabBlock)
      }
   }, [])
   return <div className="authorization-page-wrapper">
      <LanguageSwitcher />

      <div className={type === "default" ? "default-page" : "default-page hidden"}>
         <div
            className="main-logo"
            draggable={false}>
            <img
               className="main-logo-spiral"
               src={mainLogoSpiral}
               draggable={false}
               alt="main logo central spiral" />
            <img
               className="main-logo-social"
               src={mainLogoSocial}
               draggable={false}
               alt="main logo upper part" />
            <img
               className="main-logo-network"
               src={mainLogoNetwork}
               draggable={false}
               alt="main logo right part" />
            <img
               className="main-logo-my"
               src={mainLogoMy}
               draggable={false}
               alt="main logo upper part" />
            <button
               type="button"
               disabled={type === "login" || type === "registration"}
               className={!nextButtonIsActive
                  ? type === 'default'
                     ? "next-button"
                     : "next-button hidden"
                  : type === 'default'
                     ? "next-button active"
                     : "next-button active hidden"}
               onClick={loginPageTransition}
               ref={nextButton}>
               <img
                  className={!nextButtonIsActive
                     ? "arrow-icon"
                     : "arrow-icon active"}
                  src={arrow}
                  draggable={false}
                  alt="arrow" />
            </button>
         </div>
      </div>

      <div className={type === "default"
         ? "authorization-page hidden"
         : "authorization-page"}>
         <div className="info-box">

            <div className="login-info-box">
               <h1 className={type === "login"
                  || type === "default"
                  ? "login-header"
                  : "login-header hidden"}>
                  {currentLanguage === "ru"
                     ? "У вас нет учетной записи?"
                     : "Don’t have an account?"}
               </h1>

               <button
                  type="button"
                  className={type === "login"
                     || type === "default"
                     ? "registration-button"
                     : "registration-button login"}
                  onClick={registrationAndLoginPageTransition}
                  ref={loginAndRegistrationSwitchButton}>
                  {type === "login"
                     || type === "default"
                     ? currentLanguage === "ru"
                        ? "Регистрация"
                        : "Registration"
                     : currentLanguage === "ru"
                        ? "Вход"
                        : "Log in"}
               </button>
            </div>

            <div className="register-info-box">
               <h1 className={type === "registration"
                  ? "register-header"
                  : "register-header hidden"}>
                  {currentLanguage === "ru"
                     ? "У вас есть учетная запись?"
                     : "Have an account?"}
               </h1>
            </div>

            <AuthFormProgressive
               type={type}
               loginAndRegistrationSwitchButton={loginAndRegistrationSwitchButton} />
         </div>
      </div>
      <span className="copyright-span">© <a
         href="https://www.linkedin.com/in/deguzbelarus/"
         target="_blank"
         rel="noreferrer noopener"
      >Deguz</a>
         , designed with <a
            href="https://www.linkedin.com/in/anna-fedortsiv-225660237/"
            target="_blank"
            rel="noreferrer noopener"
         >Annet</a>
         , 2022
      </span>
   </div>
}