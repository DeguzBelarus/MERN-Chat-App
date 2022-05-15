import { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./PlanningModeSwitcher.scss";

interface Props {
   planningMode: boolean,
   setPlanningMode: any
}

export const PlanningModeSwitcher: FC<Props> = ({ planningMode, setPlanningMode }) => {
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const planningModeHandler = () => {
      if (planningMode) {
         setPlanningMode(false)
      } else {
         setPlanningMode(true)
      }
   }

   return <button type="button" className="planning-mode-switcher-wrapper"
      onClick={planningModeHandler}
   >
      <span className={!planningMode ? "planning-mode-switcher-text active" : "planning-mode-switcher-text"}>
         {currentLanguage === "ru"
            ? "Дневник"
            : "Diary"}
      </span>
      <span className="separator-span">/</span>
      <span className={planningMode ? "planning-mode-switcher-text active" : "planning-mode-switcher-text"}>
         {currentLanguage === "ru"
            ? "Планирование"
            : "Planning"}
      </span>
   </button>
}