import { FC, useEffect, useRef } from "react";

import "./VideoChatMainBox.scss"

interface Props {
   socket: any,
   peer: any,
   setUserStream: any,
   setPoster: any,
   userStream: any
}

export const VideoChatMainBox: FC<Props> = ({
   socket, peer, setUserStream, setPoster, userStream
}) => {
   const streamPlayer: any = useRef(null)
   const canvas: any = useRef(null)
   const updateInterval: any = useRef()

   useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
         .then((stream) => {
            streamPlayer.current.srcObject = stream
            const canvasContext = canvas.current.getContext("2d")

            setTimeout(() => {
               canvasContext.drawImage(streamPlayer.current, 0, 0, canvas.current.width, canvas.current.height)
               canvas.current.toBlob((poster: any) => {
                  setPoster(poster)
               }, "image/*")
            }, 70)

            const updateIntervalId = setInterval(() => {
               canvasContext.drawImage(streamPlayer.current, 0, 0, canvas.current.width, canvas.current.height)
               canvas.current.toBlob((poster: any) => {
                  setPoster(poster)
               }, "image/*")
            }, 2000)

            updateInterval.value = updateIntervalId

            if (!userStream) {
               setUserStream(stream)
            }
         })
         .catch((error) => console.log(error))

      return () => {
         clearInterval(updateInterval.value)
      }
   }, [])
   return <div className="main-box-wrapper">
      <video className="stream-player" controls autoPlay muted ref={streamPlayer}></video>
      <canvas ref={canvas}></canvas>
   </div>
}