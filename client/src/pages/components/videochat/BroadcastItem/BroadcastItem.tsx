import { FC, useEffect, useState, useRef } from "react";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { remotePeerIdSave, selectRemotePeerId } from "../../../../app/webcamChatSlice ";
import "./BroadcastItem.scss"

interface Props {
   nickname: any,
   peerId: any,
   poster: any,
   peer: any
}

export const BroadcastItem: FC<Props> = ({ nickname, peerId, poster, peer }) => {
   const videoPlayerPreview: any = useRef(null)

   const dispatch = useAppDispatch()
   const remotePeerId = useAppSelector(selectRemotePeerId)

   const [posterSrc, setPosterSrc]: any = useState(null)
   const [previewMode, setPreviewMode]: any = useState(false)

   const previewModeOn = () => {
      setPreviewMode(true)
      dispatch(remotePeerIdSave(peerId))
   }

   const previewModeOff = () => {
      setPreviewMode(false)
      dispatch(remotePeerIdSave(null))
   }

   useEffect(() => {
      const posterBlob = new Blob([poster], { type: "image/*" })
      const decodedPosterUrl = URL.createObjectURL(posterBlob)
      setPosterSrc(decodedPosterUrl)
   }, [poster])

   useEffect(() => {
      console.log(remotePeerId);

      if (previewMode) {
         const connection = peer.connect(remotePeerId)
         console.log("Connected to: ", connection.peer);

         const call = peer.call(remotePeerId, "mediaStream");
         call.on("stream", (remoteStream: any) => {
            videoPlayerPreview.current.srcObject = remoteStream
         })
      }
   }, [previewMode])

   return <div
      className="broadcast-item-wrapper"
      onMouseEnter={previewModeOn}
      onMouseLeave={previewModeOff}
   >
      {previewMode
         ? <video autoPlay muted ref={videoPlayerPreview}></video>
         : <img src={posterSrc} alt="poster of broadcast" />}
      <span>{nickname}</span>
   </div>
}