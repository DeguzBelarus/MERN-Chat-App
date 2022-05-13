import { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./TrainingItem.scss"
interface Props {
   info: any,
   removeTraining: any
}

export const TrainingItem: FC<Props> = ({ info, removeTraining }) => {
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const date = info.date.split("-")
   const day = date[2]
   const month = date[1]
   const year = date[0]
   const correctDate = [day, month, year].join(".")

   const removeTrainingHandler = () => {
      removeTraining(info.id)
   }

   return <div className="training-item-wrapper">
      <div className="upper-container">
         <span >{currentLanguage === "ru"
            ? `Дата: ${correctDate}`
            : `Date: ${correctDate}`}
         </span>

         {info.myweight !== 0 && <span >{currentLanguage === "ru"
            ? `/ Вес: ${info.myweight} кг`
            : `/ Weight: ${info.myweight} kg`}
         </span>}
      </div>

      {info.plan.map((exercise: any, index: number) => {
         return <div className="exercise-wrapper" key={index}>
            <span className="exercise-name-span">{exercise.exercise}: </span>

            {!exercise.calories
               ? <span className="exercise-description">
                  {currentLanguage === "ru"
                     ? `${exercise.weight} кг ${exercise.sets} x ${exercise.repeats} (${exercise.weight * exercise.sets * exercise.repeats * exercise.q} кг)`
                     : `${exercise.weight} kg ${exercise.sets} x ${exercise.repeats} (${exercise.weight * exercise.sets * exercise.repeats * exercise.q} kg)`
                  }
               </span>
               : <span className="exercise-description">
                  {currentLanguage === "ru"
                     ? `${exercise.meters} м - ${exercise.calories.toFixed(2)} ккал`
                     : `${exercise.meters} m - ${exercise.calories.toFixed(2)} kcal`
                  }
               </span>
            }

            {exercise.q < 1 && <span>{` ${exercise.q * 100}%`}</span>}
         </div>
      })}

      {info.plan.some((exercise: any) => {
         if (exercise.weight) return true
      }) && <p className="total-paragraph">
            {currentLanguage === "ru"
               ? "Нагрузка за тренировку: "
               : "Training load: "
            }
            <span>
               {info.plan.reduce((sum: number, exercise: any, index: number) => {
                  return sum + (exercise.weight * exercise.sets * exercise.repeats * exercise.q)
               }, 0)}
            </span>
            {currentLanguage === "ru" ? " кг" : " kg"}
         </p>}

      {info.plan.some((exercise: any) => {
         if (exercise.calories) return true
      }) && <p className="total-paragraph">
            {currentLanguage === "ru"
               ? "Результативность кардио: "
               : "Cardio performance: "
            }
            <span>
               {info.plan.reduce((sum: number, exercise: any, index: number) => {
                  return sum + exercise.calories
               }, 0).toFixed(2)}
            </span>
            {currentLanguage === "ru" ? " ккал" : " kcal"}
         </p>}

      {info.comment
         && <p className="comment-paragraph">
            {currentLanguage === "ru"
               ? "Комментарий: "
               : "Comment: "}
            <span>
               {info.comment}
            </span>
         </p>}

      <button type="button" className="remove-training-button" onClick={removeTrainingHandler}>X</button>
   </div >
}