import { FC, useEffect } from "react";
import { useRoutes } from './routes';
interface Props {
   socket: any
}

const App: FC<Props> = ({ socket }) => {
   const routes = useRoutes(socket)

   useEffect(() => {
      //== notification of connection establishment
      socket.on("connect", () => {
         console.log("websocket connection has been established...");
      })
      //== notification of connection establishment
   }, [socket])

   return (
      <>
         {routes}
      </>
   );
}

export default App;
