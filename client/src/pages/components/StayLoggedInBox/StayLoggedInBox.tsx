import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import { getIsStayLoggedIn, setIsStayLoggedIn } from "../../../app/userSlice";
import { selectCurrentLanguage } from "../../../app/globalSlice";
import "./StayLoggedInBox.scss"

export const StayLoggedInBox: FC = () => {
   const dispatch = useAppDispatch()

   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const isStayLoggedIn: boolean = useAppSelector(getIsStayLoggedIn)

   const isStayLoggedInHandle = () => {
      if (isStayLoggedIn) {
         dispatch(setIsStayLoggedIn(false))
      } else {
         dispatch(setIsStayLoggedIn(true))
      }
   }

   return <div className="stay-loggedin-box">
      <div className="checkbox">
         <input title={currentLanguage === "ru"
            ? "сохранить данные о входе"
            : "save login data"}
            type="checkbox"
            id="loggedin-input"
            checked={isStayLoggedIn}
            onChange={isStayLoggedInHandle} />

         <label htmlFor="loggedin-input" className="stay-logged-in-label">
            {currentLanguage === "ru"
               ? "Оставаться в системе"
               : "Stay logged in"}
         </label>
      </div>
   </div>
}
