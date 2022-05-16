import { FC } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { selectCurrentLanguage } from "../../../../app/globalSlice";

import "./ExerciseItem.scss"

interface Props {
   exerciseRemove: any,
   index: number,
   exercise: any
}

export const ExerciseItem: FC<Props> = ({ exerciseRemove, index, exercise }) => {
   const currentLanguage: string = useAppSelector(selectCurrentLanguage)

   const exerciseRemoveHandler = () => {
      exerciseRemove(exercise.id)
   }

   return <div className="exercise-info-container" key={index}>
      <span>
         {`${index + 1} :`}
      </span>
      <select title={currentLanguage === "ru"
         ? "Выберите упражнение"
         : "Choose an exercise"}
         id="exercise-input"
         disabled
      >
         <option value={exercise.exercise}>{exercise.exercise}</option>
      </select>

      {exercise.exercise === "Бег быстрый"
         || exercise.exercise === "Бег трусцой"
         || exercise.exercise === "High-speed running"
         || exercise.exercise === "Jogging"
         || exercise.exercise === "Ходьба"
         || exercise.exercise === "Ходьба быстрая"
         || exercise.exercise === "Walking"
         || exercise.exercise === "Walking fast" ?
         <>
            <label htmlFor="meters-input">
               {currentLanguage === "ru"
                  ? "Метры: "
                  : "Meters: "}
            </label>
            <input type="number"
               id="meters-input"
               disabled
               value={exercise.meters}
            />
         </>
         :
         <>
            <label htmlFor="weight-input">
               {currentLanguage === "ru"
                  ? "Вес: "
                  : "Weight: "}
            </label>
            <input type="number"
               id="weight-input"
               disabled
               value={exercise.weight}
            />

            <label htmlFor="sets-input">
               {currentLanguage === "ru"
                  ? "Сеты: "
                  : "Sets: "}
            </label>
            <input type="number"
               id="sets-input"
               disabled
               value={exercise.sets}
            />

            <label htmlFor="repeats-input">
               {currentLanguage === "ru"
                  ? "Повторения: "
                  : "Repeats: "}
            </label>
            <input type="number"
               id="repeats-input"
               disabled
               value={exercise.repeats}
            />
         </>
      }

      <button type="button"
         className="exercise-remove-button"
         onClick={exerciseRemoveHandler}
      >
         -
      </button>
   </div>
} 