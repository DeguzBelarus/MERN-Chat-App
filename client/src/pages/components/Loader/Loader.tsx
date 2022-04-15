import { FC } from "react"

import "./Loader.scss"

export const Loader: FC = () => {
   return (
      <div className="loader-container">
         <div className="loading-triangle"></div>
      </div>
   )
}