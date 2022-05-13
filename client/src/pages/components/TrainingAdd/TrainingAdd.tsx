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

   const [planData, setPlanData] = useState({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1, meters: 0, calories: 0 })
   const [planDataComplete, setPlanDataComplete] = useState([planData])
   const [formData, setFormData] = useState({ id: 0, date: "", myweight: 0, comment: "", plan: planDataComplete })

   const exercises = [
      "Бег быстрый",
      "Бег трусцой",
      "Ходьба",
      "Ходьба быстрая",
      "Жим штанги",
      "Жим штанги наклонный",
      "Жим гантелей",
      "Жим гантелей наклонный",
      "Тренажёр бабочка",
      "Тренажёр кроссовер",
      "Разводка (грудь)",
      "Скамья Скотта (штанга)",
      "Скамья Скотта (гантели)",
      "Подъёмы штанги (бицепс)",
      "Обратные подъемы штанги",
      "Молотки",
      "Концентрированные сгибания",
      "Французский жим",
      "Жим узким хватом",
      "Разгибание рук (гантель)",
      "Разгибание руки (гантеля)",
      "Разгибание рук (тренажёр)",
      "Подтягивания",
      "Тяга вертикальная (тренажёр)",
      "Тяга горизонтальная (тренажёр)",
      "Тяга т-гифа",
      "Тяга штанги в наклоне",
      "Отжимания",
      "Отжимания (брусья)",
      "Приседания",
      "Приседания со штангой",
      "Приседания с гантелями",
      "Выпады (гантели)",
      "Разгибания ног (тренажёр)",
      "Сгибания ног (тренажёр)",
      "Приседания в Гаке",
      "Жим ногами (тренажёр)",
      "Мёртвая тяга (штанга)",
      "Мёртвая тяга (гантели)",
      "Подъёмы на носках",
      "Подъёмы на носках (тренажёр)",
      "Ослик",
      "Шраги со штангой",
      "Шраги с гантелями",
      "Разведения с гантелями",
      "Разведения в наклоне (гантели)",
      "Подъёмы вперёд (гантели)",
      "Жим гантелей (плечи)",
      "Жим штанги (плечи)",
      "Армейский жим",
      "Жим Арнольда",
      "Запястные сжимания",
      "Запястные сжимания (обратные)",
      "Скручивания (пресс)",
      "Скручивания (косые мышцы)",
   ]

   const exercisesEng = [
      "High-speed running",
      "Jogging",
      "Walking",
      "Walking fast",
      "Bench press",
      "Bench press inclined",
      "Dumbbell press",
      "Dumbbell press inclined",
      "Butterfly apparatus",
      "Crossover apparatus",
      "Wiring (chest)",
      "Scott Bench (barbell)",
      "Scott Bench (dumbbells)",
      "Barbell Lifts (biceps)",
      "Reverse barbell lifts",
      "Hammers",
      "Concentrated flexion",
      "French bench press",
      "Tight grip press",
      "Arms extension (dumbbell)",
      "Arm extension (dumbbell)",
      "Arm extension (apparatus)",
      "Pull - ups",
      "Vertical pull (apparatus)",
      "Horizontal pull (apparatus)",
      "T-gif pull",
      "Barbell pull in tilt",
      "Push-ups",
      "Push-ups (uneven bars)",
      "Squats",
      "Barbell Squats",
      "Squats with dumbbells",
      "Lunges (dumbbells)",
      "Leg extensions (apparatus)",
      "Leg flexion (apparatus)",
      "Squats in the Gak",
      "Leg press (apparatus)",
      "Deadlift (barbell)",
      "Deadlift (dumbbells)",
      "Toe lifts",
      "Toe lifts (apparatus)",
      "Donkey",
      "Scars with a barbell",
      "Scars with dumbbells",
      "Dilutions with dumbbells",
      "Dilutions in slope (dumbbells)",
      "Forward lifts (dumbbells)",
      "Dumbbell press (shoulders)",
      "Barbell bench press (shoulders)",
      "Army Bench press",
      "Arnold 's Bench Press",
      "Wrist squeezes",
      "Wrist squeezes (reverse)",
      "Twisting (press)",
      "Twisting (oblique muscles)",
   ]

   const formDataUpdate = (event: any) => {
      setFormData({ ...formData, [event.target.name]: event.target.value, id: new Date().getTime() })
   }

   const planDataUpdate = (event: any) => {
      setPlanData({ ...planData, [event.target.name]: event.target.value, id: new Date().getTime() })
   }

   const planDataCompleteReset = () => {
      setPlanData({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1, meters: 0, calories: 0 })
      setPlanDataComplete([planData])
      setFormData({ id: 0, date: "", myweight: 0, comment: "", plan: planDataComplete })
   }

   const exerciseAdd = () => {
      if (planData.exercise === "") {
         return
      } else if (planData.exercise === "Бег быстрый"
         || planData.exercise === "Бег трусцой"
         || planData.exercise === "High-speed running"
         || planData.exercise === "Jogging"
         || planData.exercise === "Ходьба"
         || planData.exercise === "Ходьба быстрая"
         || planData.exercise === "Walking"
         || planData.exercise === "Walking fast") {
         if (planData.meters === 0
            || formData.myweight === 0) {
            return
         }
      } else if (planData.weight === 0
         || planData.sets === 0
         || planData.repeats === 0
      ) return

      switch (planData.exercise) {
         case "Запястные сжимания":
         case "Запястные сжимания (обратные)":
         case "Wrist squeezes":
         case "Wrist squeezes (reverse)":
            planData.q = 0.15
            break
         case "Скручивания (пресс)":
         case "Скручивания (косые мышцы)":
         case "Twisting (press)":
         case "Twisting (oblique muscles)":
            planData.q = 0.15
            break
         case "Подтягивания":
         case "Pull - ups":
            planData.q = 0.7
            break
         case "Отжимания":
         case "Push-ups":
            planData.q = 0.2
            break
         case "Отжимания (брусья)":
         case "Push-ups (uneven bars)":
            planData.q = 0.25
            break
         case "Приседания":
         case "Squats":
            planData.q = 0.25
            break
         case "Подъёмы на носках":
         case "Подъёмы на носках (тренажёр)":
         case "Toe lifts":
         case "Toe lifts (apparatus)":
            planData.q = 0.15
            break
         case "Ослик":
         case "Donkey":
            planData.q = 0.2
            break
         case "Шраги со штангой":
         case "Шраги с гантелями":
         case "Scars with a barbell":
         case "Scars with dumbbells":
            planData.q = 0.15
            break
      }

      setPlanDataComplete([...planDataComplete, planData])
      setPlanData({ id: 0, exercise: "", weight: 0, sets: 0, repeats: 0, q: 1, meters: 0, calories: 0 })
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

      planDataCompleteReset()
      trainingForm.current.reset()
   }

   useEffect(() => {
      setFormData({ ...formData, plan: [...planDataComplete] })
      console.log(planDataComplete);
      console.log(formData);
   }, [planDataComplete])

   return <div className="training-add-wrapper">
      <button type="button"
         className="exit-button"
         onClick={trainingDiaryExit}>
         {currentLanguage === "ru"
            ? "Выйти"
            : "Quit"}
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
            <div className="date-input-wrapper">
               <label htmlFor="date-input">
                  {currentLanguage === "ru"
                     ? "Дата: "
                     : "Date: "}
               </label>
               <input type="date"
                  name="date"
                  id="date-input"
                  onChange={formDataUpdate} />
            </div>

            <div className="myweight-input-wrapper">
               <label htmlFor="myweight-input">
                  {currentLanguage === "ru"
                     ? "Ваш вес: "
                     : "Your weight: "}
               </label>
               <input type="number"
                  name="myweight"
                  id="myweight-input"
                  step={0.1}
                  min={0}
                  disabled={planDataComplete.length > 1}
                  onChange={formDataUpdate}
               />
            </div>
         </div>

         {planDataComplete.map((training: any, index: number) => {
            return <div className="exercise-info-container" key={index}>
               <span>
                  {planDataComplete.length === index + 1 ? `${index + 1}* :` : `${index + 1} :`}
               </span>
               <select title={currentLanguage === "ru"
                  ? "Выберите упражнение"
                  : "Choose an exercise"}
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

               {planDataComplete.length === index + 1
                  ? planData.exercise === "Бег быстрый"
                     || planData.exercise === "Бег трусцой"
                     || planData.exercise === "High-speed running"
                     || planData.exercise === "Jogging"
                     || planData.exercise === "Ходьба"
                     || planData.exercise === "Ходьба быстрая"
                     || planData.exercise === "Walking"
                     || planData.exercise === "Walking fast"
                     ? <>
                        <label htmlFor="meters-input">
                           {currentLanguage === "ru"
                              ? "Метры: "
                              : "Meters: "}
                        </label>
                        <input type="number"
                           name="meters"
                           id="meters-input"
                           step={10}
                           min={0}
                           disabled={planDataComplete.length === index + 1
                              ? false
                              : true}
                           onChange={planDataUpdate}
                        />
                     </>
                     : <>
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
                     </>
                  : training.exercise === "Бег быстрый"
                     || training.exercise === "Бег трусцой"
                     || training.exercise === "High-speed running"
                     || training.exercise === "Jogging"
                     || training.exercise === "Ходьба"
                     || training.exercise === "Ходьба быстрая"
                     || training.exercise === "Walking"
                     || training.exercise === "Walking fast"
                     ? <>
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
                     </>
                     : <>
                        <label htmlFor="meters-input">
                           {currentLanguage === "ru"
                              ? "Метры: "
                              : "Meters: "}
                        </label>
                        <input type="number"
                           name="meters"
                           id="meters-input"
                           step={10}
                           min={0}
                           disabled={planDataComplete.length === index + 1
                              ? false
                              : true}
                           onChange={planDataUpdate}
                        />
                     </>
               }

               {planDataComplete.length === index + 1
                  && <button type="button"
                     className="exercise-add-button"
                     onClick={exerciseAdd}
                  >+
                  </button>}
            </div>
         })}

         <label htmlFor="comment-input">{currentLanguage === "ru" ? "Комментарий: " : "Comment: "}</label>
         <textarea
            name="comment"
            id="comment-input"
            maxLength={100}
            onChange={formDataUpdate}
         />

         <div className="buttons-container">
            <button type="submit">{currentLanguage === "ru" ? "Добавить " : "Add "}</button>
            <button type="reset"
               onClick={planDataCompleteReset}
            >{currentLanguage === "ru" ? "Очистить " : "Clear "}</button>
         </div>

         <span className="note">{currentLanguage === "ru" ? "* - нажмите \"+\" для добавления" : "* - press \"+\" to add"}</span>
      </form>
   </div>
}