import { FC, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentLanguage } from "../../../app/globalSlice";

import "./TrainingItem.scss"
interface Props {
   info: any,
   removeTraining: any,
   planningMode: boolean,
   trainingSetcompleted: any,
   selectedTraining: any,
   setSelectedTraining: any
}

export const TrainingItem: FC<Props> = ({
   info,
   removeTraining,
   planningMode,
   trainingSetcompleted,
   selectedTraining,
   setSelectedTraining
}) => {
   const currentLanguage = useAppSelector(selectCurrentLanguage)

   const weekDaysRU: string[] = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота"
   ]

   const weekDaysEn: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
   ]

   const dateinfo = new Date(info.date)
   const weekDay = dateinfo.getDay()
   const year = dateinfo.getFullYear()

   let day: number | string = dateinfo.getDate()
   if (day < 10) day = "0" + day

   let month: number | string = dateinfo.getMonth() + 1
   if (month < 10) month = "0" + month

   const removeTrainingHandler = () => {
      removeTraining(info.id)
   }

   const trainingSetcompletedHandler = () => {
      trainingSetcompleted(info.id)
   }

   const selectedTrainingHandler = () => {
      if (selectedTraining?.id !== info.id) {
         setSelectedTraining(info)
      } else {
         setSelectedTraining(null)
      }
   }

   return <div className={planningMode
      ? !info.completed
         ? "training-item-wrapper"
         : "training-item-wrapper completed"
      : selectedTraining?.id !== info.id
         ? "training-item-wrapper diary"
         : "training-item-wrapper diary under-removing"
   }
      onClick={selectedTrainingHandler}
   >
      <div className="upper-container">
         <span >{currentLanguage === "ru"
            ? `Дата: ${day}.${month}.${year},`
            : `Date: ${day}.${month}.${year},`}
         </span>

         <span className="week-day-span">
            {currentLanguage === "ru"
               ? weekDaysRU[weekDay]
               : weekDaysEn[weekDay]
            }
         </span>

         {info.myweight !== 0
            && <span >{currentLanguage === "ru"
               ? `/ Вес: ${info.myweight} кг`
               : `/ Weight: ${info.myweight} kg`}
            </span>}

         {info.completed && <div className="complete-logo">DONE!</div>}
      </div>

      {
         info.plan.map((exercise: any, index: number) => {
            return <div className="exercise-wrapper" key={index}>
               <span className="exercise-name-span">{exercise.exercise}: </span>

               {!exercise.calories
                  ? <span className="exercise-description">
                     {currentLanguage === "ru"
                        ? `${Number(exercise.weight).toFixed(2)} кг - ${exercise.sets} x ${exercise.repeats} (${Number(exercise.weight * exercise.sets * exercise.repeats * exercise.q).toFixed(1)} кг)`
                        : `${Number(exercise.weight).toFixed(2)} kg - ${exercise.sets} x ${exercise.repeats} (${Number(exercise.weight * exercise.sets * exercise.repeats * exercise.q).toFixed(1)} kg)`
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
               {exercise.q === 2 && <span>{` x${exercise.q}`}</span>}
            </div>
         })
      }

      {
         info.plan.some((exercise: any) => {
            if (exercise.weight) return true
         }) && <p className="total-paragraph">
            {currentLanguage === "ru"
               ? "Нагрузка за тренировку: "
               : "Training load: "
            }
            <span>
               {info.plan.reduce((sum: number, exercise: any, index: number) => {
                  return sum + (exercise.weight * exercise.sets * exercise.repeats * exercise.q)
               }, 0).toFixed(1)}
            </span>
            {currentLanguage === "ru" ? " кг" : " kg"}
         </p>
      }

      {
         info.plan.some((exercise: any) => {
            if (exercise.calories) return true
         }) && <p className="total-paragraph">
            {currentLanguage === "ru"
               ? "Результативность кардио: "
               : "Cardio performance: "
            }
            <span>
               {info.plan.reduce((sum: number, exercise: any, index: number) => {
                  return sum + exercise.calorie
               }, 0).toFixed(1)}
            </span>
            {currentLanguage === "ru" ? " ккал" : " kcal"}
         </p>
      }

      {
         info.comment
         && <p className="comment-paragraph">
            {currentLanguage === "ru"
               ? "Комментарий: "
               : "Comment: "}
            <span>
               {info.comment}
            </span>
         </p>
      }

      {
         selectedTraining?.id === info.id
            ? <button type="button"
               className="remove-training-button"
               onClick={removeTrainingHandler}
            >
               &times;
            </button>
            : planningMode
               ? <button type="button"
                  className="remove-training-button"
                  onClick={removeTrainingHandler}
               >
                  &times;
               </button>
               : ""
      }

      {
         planningMode
         && <button type="button"
            className={info.completed
               ? "set-completed-training-button active"
               : "set-completed-training-button"}
            onClick={trainingSetcompletedHandler}
         >
            {info.completed
               ? currentLanguage === "ru" ? "Выполнена" : "Completed"
               : currentLanguage === "ru" ? "Ожидает" : "Waiting"}
         </button>
      }
   </div >
}