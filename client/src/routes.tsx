import { Route, Routes } from "react-router-dom"
import { useAppSelector } from "./app/hooks";
import { selectToken } from "./app/userSlice";

import { AuthorizationPage } from "./pages/AuthorizationPage/AuthorizationPage";
import { RegistrationPage } from "./pages/RegistrationPage/RegistrationPage"
import { UserRoom } from "./pages/UserRoom/UserRoom";
import { ChatMainPage } from "./pages/ChatMainPage/ChatMainPage";

export const useRoutes = (socket: any) => {
   const token = useAppSelector(selectToken)
   if (token) {
      return <Routes>
         <Route path="/" element={<UserRoom socket={socket} />}></Route>
         <Route path="*" element={<UserRoom socket={socket} />}></Route>
         <Route path="/usersroom" element={<UserRoom socket={socket} />}></Route>
         <Route path="/chat" element={<ChatMainPage socket={socket} />}></Route>
      </Routes >
   }

   return <Routes>
      <Route path="/" element={<AuthorizationPage />}></Route>
      <Route path="*" element={<AuthorizationPage />}></Route>
      <Route path="/registration" element={<RegistrationPage />}></Route>
   </Routes>
}