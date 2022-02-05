import { Route, Routes } from "react-router-dom"
import { useAppSelector } from "./app/hooks";
import { selectToken } from "./app/userSlice";
import AuthorizationPage from "./pages/AuthorizationPage/AuthorizationPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage"
import UserRoom from "./pages/UserRoom/UserRoom";
import ChatMainPage from "./pages/ChatMainPage/ChatMainPage";

export const useRoutes = () => {
    const token = useAppSelector(selectToken)
    if (token) {
        return <Routes>
            <Route path="/usersroom" element={<UserRoom />}></Route>
            <Route path="/chat" element={<ChatMainPage />}></Route>
            <Route path="*" element={<UserRoom />}></Route>
        </Routes >
    }

    return <Routes>
        <Route path="/" element={<AuthorizationPage />}></Route>
        <Route path="/registration" element={<RegistrationPage />}></Route>
        <Route path="*" element={<AuthorizationPage />}></Route>
    </Routes>
}