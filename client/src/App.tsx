import { FC, useEffect } from "react";
import { useAppDispatch } from "./app/hooks";

import { checkAuthorizationAsync } from "./app/userSlice";
import { useRoutes } from './hooks/useRoutes';
import { peerIdSave } from "./app/webcamChatSlice ";

interface Props {
   socket: any,
   peer: any
}

const App: FC<Props> = ({ socket, peer }) => {
   const routes = useRoutes(socket, peer)
   const dispatch = useAppDispatch()

   useEffect(() => {
      socket.on("connect", () => {
         console.log("websocket connection has been established...");
      })
   }, [socket])

   useEffect(() => {
      peer.on("open", (id: any) => {
         dispatch(peerIdSave(id))
      })

      peer.on('connection', (connection: any) => {
         console.log("Connection: ", connection.peer);
      });
   }, [peer])


   useEffect(() => {
      if (localStorage.getItem("MySNToken")) {
         const token: string | null = localStorage.getItem("MySNToken")
         dispatch(checkAuthorizationAsync(token || ""))
      }
   }, [])
   return (
      <>
         {routes}
      </>
   );
}

export default App;
