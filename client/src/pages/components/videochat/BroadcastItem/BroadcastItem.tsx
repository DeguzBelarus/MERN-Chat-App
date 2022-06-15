import { FC, useEffect, useState } from "react";

import "./BroadcastItem.scss"

interface Props {
   nickname: any,
   peerId: any,
   poster: any
}

export const BroadcastItem: FC<Props> = ({ nickname, peerId, poster }) => {
   const [posterSrc, setPosterSrc]: any = useState(null)

   useEffect(() => {
      const posterBlob = new Blob([poster], { type: "image/*" })
      const decodedPosterUrl = URL.createObjectURL(posterBlob)
      setPosterSrc(decodedPosterUrl)
   }, [poster])
   return <div className="broadcast-item-wrapper">
      <img src={posterSrc} alt="poster of broadcast" />
      <span>{nickname}</span>
   </div>
}