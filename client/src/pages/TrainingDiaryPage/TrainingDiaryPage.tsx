import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { selectUserNickname } from "../../app/userSlice";
import { firebaseDB } from "../..";
import { ref, set, onValue } from "firebase/database";

import { TrainingItem } from "../components/TrainingItem/TrainingItem";
import "./TrainingDiaryPage.scss"
import { TrainingAdd } from "../components/TrainingAdd/TrainingAdd";

export const TrainingDiaryPage: FC = () => {
   const navigate = useNavigate()

   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const nickname = useAppSelector(selectUserNickname)

   const [trainingData, setTrainingData]: any[] = useState([])

   const trainingDiaryExit = () => {
      navigate(`/usersroom/${nickname}`)
   }

   const removeTraining = (id: string) => {
      const trainingDataUpdated = trainingData.filter((trainig: any) => trainig.id !== id)
      set(ref(firebaseDB, `trainings/` + nickname), trainingDataUpdated)
   }

   useEffect(() => {
      document.title = currentLanguage === "ru" ? `MySN: ${nickname} - Тренировки` : `MySN: ${nickname} - Training`
      navigate(`/trainingdiary/${nickname}`)

      //== database reading and onchange etry listener run
      onValue(ref(firebaseDB, `trainings/` + nickname), (snapshot) => {
         setTrainingData(snapshot.val())
      })
      //== database reading and onchange etry listener run
   }, [])

   return <div className="training-diary-wrapper">
      <TrainingAdd
         trainingData={trainingData}
         trainingDiaryExit={trainingDiaryExit}
      />

      <div className="training-items-wrapper">
         {trainingData
            ? trainingData.map((training: any, index: number) => {
               return <TrainingItem
                  info={training}
                  removeTraining={removeTraining}
                  key={index}
               />
            })
            : currentLanguage === "ru"
               ? "У Вас нет тренировок ещё :)"
               : "You don't have any training yet :)"
         }
      </div>
   </div>
}