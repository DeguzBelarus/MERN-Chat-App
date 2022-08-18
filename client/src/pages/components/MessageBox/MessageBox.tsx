import { FC } from "react"
import { useAppSelector } from "../../../app/hooks"

import { getAuthMessage } from "../../../app/userSlice"
import "./MessageBox.scss"

export const MessageBox: FC = () => {
   const authMessage: string = useAppSelector(getAuthMessage)

   return <div
      className="message-box">
      <span>
         {authMessage}
      </span>
   </div>
}
