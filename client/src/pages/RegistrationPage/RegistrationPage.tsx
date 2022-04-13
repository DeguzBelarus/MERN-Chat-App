import { useState, FC, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { useForm } from "../../hooks/useForm.hook";

import Loader from "../components/Loader/Loader";
import { MessageBox } from "../components/MessageBox/MessageBox";
import { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher"

import "./RegistrationPage.scss"

const RegistrationPage: FC = () => {
   const navigate = useNavigate()
   const { loading, message, request, setMessage } = useForm()
   const [formData, setFormData]: any = useState({ nickname: "", email: "", password: "" })
   const [clearMessageTimeout, setClearMessageTimeout]: any = useState(null)

   const changeHandler = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value })
   }

   const registerHandler = async (event: any) => {
      event.preventDefault()
      try {
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
      document.title = "MySN: Registration page"
   }, [])

   return (
      <div className="registration-wrapper">
         <LanguageSwitcher />

         <form id="registration-form" onSubmit={registerHandler}>
            <p className="logo-text">MySN: общение</p>
            <h1 className="registration-header">Регистрация:</h1>

            <input id="nicknameInput" type="text" placeholder="От 2 до 10 символов" name="nickname" autoFocus required minLength={2} maxLength={10} onChange={changeHandler} />
            <label htmlFor="nicknameInput">Введите никнэйм</label>

            <input id="emailInput" type="email" placeholder="В формате: mail@mail.domen" name="email" required onChange={changeHandler} />
            <label htmlFor="emailInput">Введите email</label>

            <input id="passworInput" type="password" placeholder="Минимум 8 символов" name="password" required minLength={8} onChange={changeHandler} />
            <label htmlFor="passworInput">Введите пароль</label>

            <div className="authorization-buttons">
               <button type="button" className="returnButton" disabled={loading} onClick={mainPageReturn}>Назад</button>
               <input type="submit" form="registration-form" value="Зарегистрироваться" className="registrationApplyButton" disabled={loading} />
            </div>

            {!loading && message && <MessageBox message={message} />}
            {loading && <Loader />}
         </form>

         <span className="copyright">© Deguz, 2022</span>
      </div >
   )
}

export default RegistrationPage