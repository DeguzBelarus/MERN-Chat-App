import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom"
import { useAppSelector } from "./app/hooks";
import { selectToken, selectUserNickname } from "./app/userSlice";
import AuthorizationPage from "./pages/AuthorizationPage/AuthorizationPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage"
import UserRoom from "./pages/UserRoom/UserRoom";
import ChatMainPage from "./pages/ChatMainPage/ChatMainPage";

export const useRoutes = () => {
    const token = useAppSelector(selectToken)
    const nickname = useAppSelector(selectUserNickname)

    if (token) {
        return <Routes>
            <Route path={`/usersroom/${nickname}`} element={<UserRoom />}></Route>
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