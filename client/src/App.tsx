import { FC, useEffect } from "react";

import { useRoutes } from './routes';
import { useAppDispatch } from "./app/hooks";
import { peerIdSave } from "./app/webcamChatSlice ";

interface Props {
   socket: any,
   peer: any
}

const App: FC<Props> = ({ socket, peer }) => {
   const routes = useRoutes(socket, peer)
   const dispatch = useAppDispatch()

   useEffect(() => {
      //== notification of connection establishment
      socket.on("connect", () => {
         console.log("websocket connection has been established...");
      })
      //== notification of connection establishment
   }, [socket])

   useEffect(() => {
      peer.on("open", (id: any) => {
         dispatch(peerIdSave(id))
      })
   }, [peer])

   return (
      <>
         {routes}
      </>
   );
}

export default App;
