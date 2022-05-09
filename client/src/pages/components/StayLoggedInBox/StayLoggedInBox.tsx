import { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./StayLoggedInBox.scss"
interface Props {
   setIsStayLoggedIn: any,
   isStayLoggedIn: boolean
}

export const StayLoggedInBox: FC<Props> = ({ setIsStayLoggedIn, isStayLoggedIn }) => {
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const isStayLoggedInHandle = () => {
      if (isStayLoggedIn) {
         setIsStayLoggedIn(false)
      } else {
         setIsStayLoggedIn(true)
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

         <label htmlFor="loggedin-input">
            {currentLanguage === "ru"
               ? "Оставаться в системе"
               : "Stay logged in"}
         </label>

      </div>
   </div>
}
