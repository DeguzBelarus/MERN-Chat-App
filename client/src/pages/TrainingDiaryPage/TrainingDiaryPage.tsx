import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentLanguage } from "../../app/globalSlice";
import { getUserNickname } from "../../app/userSlice";
import { firebaseDB } from "../..";
import { ref, set, onValue } from "firebase/database";

import { TrainingItem } from "../components/TrainingItem/TrainingItem";
import "./TrainingDiaryPage.scss"
import { TrainingAdd } from "../components/TrainingAdd/TrainingAdd";

export const TrainingDiaryPage: FC = () => {
   const navigate = useNavigate()

   const currentLanguage = useAppSelector(selectCurrentLanguage)
   const nickname = useAppSelector(getUserNickname)

   const [trainingData, setTrainingData]: any[] = useState([])
   const [planningMode, setPlanningMode]: any = useState(false)
   const [selectedTraining, setSelectedTraining]: any = useState(null)

   const trainingDiaryExit = () => {
      navigate(`/usersroom/${nickname}`)
   }

   const removeTraining = (id: string) => {
      const trainingDataUpdated = trainingData.filter((trainig: any) => trainig.id !== id)

      if (!planningMode) {
         set(ref(firebaseDB, `trainings/` + nickname), trainingDataUpdated)
      } else {
         set(ref(firebaseDB, `trainings-plan/` + nickname), trainingDataUpdated)
      }
   }

   const trainingSetcompleted = (id: number) => {
      const trainingDataUpdated = trainingData.map((trainig: any) => {
         if (trainig.id === id) {
            trainig.completed = !trainig.completed
            return trainig
         } else return trainig
      })

      set(ref(firebaseDB, `trainings-plan/` + nickname), trainingDataUpdated)
   }

   useEffect(() => {
      //== database reading and onchange etry listener run
      if (!planningMode) {
         onValue(ref(firebaseDB, `trainings/` + nickname), (snapshot) => {
            setTrainingData(snapshot.val())
         })
      } else {
         onValue(ref(firebaseDB, `trainings-plan/` + nickname), (snapshot) => {
            setTrainingData(snapshot.val())
         })
      }
      //== database reading and onchange etry listener run
   }, [planningMode])

   useEffect(() => {
      document.title = currentLanguage === "ru"
         ? `MySN: ${nickname} - Тренировки`
         : `MySN: ${nickname} - Training`
   }, [])

   return <div className="training-diary-wrapper">
      <TrainingAdd
         trainingData={trainingData}
         trainingDiaryExit={trainingDiaryExit}
         planningMode={planningMode}
         setPlanningMode={setPlanningMode}
      />

      <div className="training-items-wrapper">
         {trainingData
            ? trainingData.map((training: any, index: number) => {
               return <TrainingItem
                  info={training}
                  removeTraining={removeTraining}
                  trainingSetcompleted={trainingSetcompleted}
                  planningMode={planningMode}
                  selectedTraining={selectedTraining}
                  setSelectedTraining={setSelectedTraining}
                  key={index}
               />
            })
            :
            !planningMode
               ? <span className="no-trainings-span">
                  {currentLanguage === "ru"
                     ? "У Вас нет тренировок ещё :)"
                     : "You don't have any training yet :)"
                  }
               </span>
               :
               <span className="no-trainings-span">
                  {currentLanguage === "ru"
                     ? "У Вас не запланировано тренировок :)"
                     : "You don't have any training planned :)"
                  }
               </span>
         }
      </div>
   </div>
}