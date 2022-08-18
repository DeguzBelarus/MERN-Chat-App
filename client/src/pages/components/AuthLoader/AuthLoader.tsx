import { FC } from "react"
import { useAppSelector } from "../../../app/hooks"

import { getAuthStatus } from "../../../app/userSlice"
import "./AuthLoader.scss"

export const AuthLoader: FC = () => {
   const authStatus: string = useAppSelector(getAuthStatus)

   return <div className={authStatus === "loading"
      ? "auth-loader-wrapper loading"
      : "auth-loader-wrapper"}></div>
}