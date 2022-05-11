import { FC, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../../app/globalSlice";
import { selectUserNickname } from "../../../app/userSlice";
import { firebaseDB } from "../../..";
import { ref, set } from "firebase/database";

import "./TrainingAdd.scss"
interface Props {
   trainingData: any[] | null,
   trainingDiaryExit: any
}
export const TrainingAdd: FC<Props> = ({ trainingData, trainingDiaryExit }) => {
   const trainingForm: any = useRef(null)

   const currentLanguage = useSelector(selectCurrentLanguage)
   const nickname = useSelector(selectUserNickname)

   const [planData, setPlanData] = useState({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1 })
   const [planDataComplete, setPlanDataComplete] = useState([planData])
   const [formData, setFormData] = useState({ id: 0, date: "", myweight: 0, comment: "", plan: planDataComplete })
   const exercises = [
      "Жим штанги",
      "Жим штанги наклонный",
      "Жим гантелей",
      "Жим гантелей наклонный",
      "Подтягивания",
      "Приседания со штангой",
      "Запястные сжимания"
   ]
   const exercisesEng = [
      "Bench press",
      "Bench press inclined",
      "Dumbbell press",
      "Dumbbell press inclined",
      "Pull - ups",
      "Barbell Squats",
      "Wrist squeezes"
   ]

   const formDataUpdate = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value, id: new Date().getTime() })
   }

   const planDataUpdate = (event: any) => {
      setPlanData({ ...planData, [event.target.name]: event.target.value, id: new Date().getTime() })
   }

   const exerciseAdd = () => {
      if (planData.exercise === ""
         || planData.weight === 0
         || planData.sets === 0
         || planData.repeats === 0
      ) return

      switch (planData.exercise) {
         case "Запястные сжимания":
         case "Wrist squeezes":
            planData.q = 0.2
            break
      }

      setPlanDataComplete([...planDataComplete, planData])
      setPlanData({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1 })
   }

   const planDataCompleteReset = () => {
      setPlanData({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1 })
      setPlanDataComplete([planData])
   }

   const trainingAddSubmit = (event: any) => {
      event.preventDefault()
      if (formData.date === "" || planDataComplete.length === 1) return

      const data = formData
      const correctedPlanDataComplete = planDataComplete.slice(1)
      data.plan = correctedPlanDataComplete

      if (!trainingData) trainingData = []
      const trainingDataUpdated = [...trainingData, data]
         .sort((previous, next) => {
            if (previous.date > next.date) {
               return -1
            }
            if (previous.date < next.date) {
               return 1
            }
            return 0
         })

      set(ref(firebaseDB, `trainings/` + nickname), trainingDataUpdated)

      setPlanData({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1 })
      setPlanDataComplete([planData])
      trainingForm.current.reset()
   }

   useEffect(() => {
      setFormData({ ...formData, plan: [...planDataComplete] })
   }, [planDataComplete])

   return <div className="training-add-wrapper">
      <button type="button"
         className="exit-button"
         onClick={trainingDiaryExit}>
         {currentLanguage === "ru"
            ? "Выйти"
            : "Exit"}
      </button>

      <h1>{currentLanguage === "ru"
         ? "Добавление тренировки:"
         : "Adding a workout:"}
      </h1>
      <form className="training-form"
         onSubmit={trainingAddSubmit}
         ref={trainingForm}
      >
         <div className="upper-container">
            <div>
               <label htmlFor="date-input">{currentLanguage === "ru" ? "Дата: " : "Date: "}</label>
               <input type="date"
                  name="date"
                  id="date-input"
                  onChange={formDataUpdate} />
            </div>

            <div>
               <label htmlFor="myweight-input">{currentLanguage === "ru" ? "Ваш вес: " : "Your weight: "}</label>
               <input type="number"
                  name="myweight"
                  step={0.1}
                  min={0}
                  id="myweight-input"
                  onChange={formDataUpdate} />
            </div>
         </div>

         {planDataComplete.map((training: any, index: number) => {
            return <div className="exercise-info-container" key={index}>
               <span>
                  {planDataComplete.length === index + 1 ? `${index + 1}* :` : `${index + 1} :`}
               </span>
               <select title={currentLanguage === "ru"
                  ? "Выберите упражнение "
                  : "Choose an exercise "}
                  name="exercise"
                  id="exercise-input"
                  onChange={planDataUpdate}
                  disabled={planDataComplete.length === index + 1
                     ? false
                     : true}
               >
                  <option value="">
                     {currentLanguage === "ru"
                        ? " -- Выберите упражнение -- "
                        : " -- Choose an exercise -- "}
                  </option>
                  {currentLanguage === "ru"
                     ? exercises.map((exercise, index) => {
                        return <option value={exercise} key={index}>{exercise}</option>
                     })
                     : exercisesEng.map((exercise, index) => {
                        return <option value={exercise} key={index}>{exercise}</option>
                     })}
               </select>

               <label htmlFor="weight-input">
                  {currentLanguage === "ru"
                     ? "Вес: "
                     : "Weight: "}
               </label>
               <input type="number"
                  name="weight"
                  step={0.25}
                  id="weight-input"
                  min={0}
                  disabled={planDataComplete.length === index + 1
                     ? false
                     : true}
                  onChange={planDataUpdate}
               />

               <label htmlFor="sets-input">
                  {currentLanguage === "ru"
                     ? "Сеты: "
                     : "Sets: "}
               </label>
               <input type="number"
                  name="sets"
                  id="sets-input"
                  min={0}
                  disabled={planDataComplete.length === index + 1
                     ? false
                     : true}
                  onChange={planDataUpdate}
               />

               <label htmlFor="repeats-input">
                  {currentLanguage === "ru"
                     ? "Повторения: "
                     : "Repeats: "}
               </label>
               <input type="number"
                  name="repeats"
                  id="repeats-input"
                  min={0}
                  disabled={planDataComplete.length === index + 1
                     ? false
                     : true}
                  onChange={planDataUpdate}
               />

               {planDataComplete.length === index + 1
                  && <button type="button"
                     onClick={exerciseAdd}
                  >+
                  </button>}
            </div>
         })}

         <label htmlFor="comment-input">{currentLanguage === "ru" ? "Комментарий: " : "Comment: "}</label>
         <textarea
            name="comment"
            id="comment-input"
            onChange={formDataUpdate}
         />

         <div className="buttons-container">
            <button type="submit">{currentLanguage === "ru" ? "Добавить " : "Add "}</button>
            <button type="reset"
               onClick={planDataCompleteReset}
            >{currentLanguage === "ru" ? "Очистить " : "Clear "}</button>
         </div>

         <span className="note">{currentLanguage === "ru" ? "* - ещё не добавлено" : "* - not added yet"}</span>
      </form>
   </div>
}