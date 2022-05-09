import { FC } from "react"

import "./ImageAndVideoBox.scss"
interface Props {
   fileOfFileBoxSRC: any,
   typeOfFileBox: string,
   setFileBoxIsShown: any
}

export const ImageAndVideoBox: FC<Props> = ({ fileOfFileBoxSRC,
   typeOfFileBox, setFileBoxIsShown }) => {
   const fileBoxIsShownHandler = () => {
      setFileBoxIsShown(false)
   }

   return <div className="image-and-video-box">
      {typeOfFileBox === "image"
         ? <img src={fileOfFileBoxSRC} alt="image in file box" />
         : <video src={fileOfFileBoxSRC}></video>}
      <button type="button" onClick={fileBoxIsShownHandler}>✗</button>
   </div>
}