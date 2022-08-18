import { Route, Routes } from "react-router-dom"
import { useAppSelector } from "../app/hooks";

import { getIsAuth } from "../app/userSlice";
import { UserRoom } from "../pages/UserRoom/UserRoom";
import { ChatMainPage } from "../pages/ChatMainPage/ChatMainPage";
import { TrainingDiaryPage } from "../pages/TrainingDiaryPage/TrainingDiaryPage";
import { VideoChatMainPage } from "../pages/VideoChatMainPage/VideoChatMainPage";
import { VideoChatIndividualPage } from "../pages/VideoChatIndividualPage/VideoChatIndividualPage";
import { AuthPageProgressive } from "../pages/AuthPageProgressive/AuthPageProgressive";

export const useRoutes = (socket: any, peer: any) => {
   const isAuth: boolean = useAppSelector(getIsAuth)
   if (isAuth) {
      return <Routes>
         <Route path="usersroom/*" element={<UserRoom socket={socket} />}></Route>
         <Route path="chat/*" element={<ChatMainPage socket={socket} />}></Route>
         <Route path="videochat" >
            <Route path="main/*" element={<VideoChatMainPage socket={socket} peer={peer} />} />
            <Route path=":nickname" element={<VideoChatIndividualPage socket={socket} peer={peer} />} />
            <Route path="*" element={<VideoChatMainPage socket={socket} peer={peer} />} />
         </Route>
         <Route path="trainingdiary/*" element={<TrainingDiaryPage />}></Route>
         <Route path="*" element={<UserRoom socket={socket} />}></Route>
      </Routes >
   }

   return <Routes>
      <Route path="login" element={<AuthPageProgressive type="login" />}></Route>
      <Route path="registration" element={<AuthPageProgressive type="registration" />}></Route>
      <Route path="*" element={<AuthPageProgressive type="default" />}></Route>
   </Routes>
}