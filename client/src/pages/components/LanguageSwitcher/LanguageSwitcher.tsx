import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectCurrentLanguage, currentLanguageSave } from "../../../app/globalSlice";

import "./LanguageSwitcher.scss"

export const LanguageSwitcher: FC = () => {
   const dispatch = useAppDispatch()
   const currentLanguage: string = useAppSelector(selectCurrentLanguage)

   const switchLanguage = () => {
      if (currentLanguage === "ru") {
         dispatch(currentLanguageSave("en"))
      } else {
         dispatch(currentLanguageSave("ru"))
      }
   }

   return <div className={currentLanguage === "ru" ?
      "language-switcher-wrapper" : "language-switcher-wrapper active"} onClick={switchLanguage}>
      <div className={currentLanguage === "ru" ? "switcher" : "switcher active"}></div>
      <span className={currentLanguage === "ru" ? "current-language-span" : "current-language-span active"}>{currentLanguage === "ru" ? "RU" : "EN"}</span>
   </div >
}
