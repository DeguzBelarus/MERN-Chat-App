import { FC } from "react"

import "./ImageBox.scss"
interface Props {
   fileOfFileBoxSRC: any,
   setFileBoxIsShown: any
}

export const ImageBox: FC<Props> = ({
   fileOfFileBoxSRC,
   setFileBoxIsShown }) => {
   const fileBoxIsShownHandler = () => {
      setFileBoxIsShown(false)
   }

   return <div className="image-and-video-box">
      <img src={fileOfFileBoxSRC} alt="image in file box" />
      <button type="button" onClick={fileBoxIsShownHandler}>✗</button>
   </div>
}