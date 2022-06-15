import { io } from "socket.io-client";
import Peer from "peerjs";
import { createRoot } from "react-dom/client";
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom"
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth"
import * as serviceWorker from './serviceWorker';

import App from './App';
import './index.scss';

const socket = io()

//== for development
// const peer = new Peer({
//    path: "/peerjs",
//    host: "/",
//    port: 5000
// })
//== for development

//== for production
const peer = new Peer({
   path: "/peerjs",
   host: "mysn-deguz.herokuapp.com",
   port: 443,
   secure: true,
})
//== for production

//== firebase initializing
const firebaseConfig = {
   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
   databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.REACT_APP_FIREBASE_APP_ID,
   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
export const firebaseDB = getDatabase(app)
export const firebaseAuth = getAuth(app)
export const firebaseAnalytics = getAnalytics(app)
//== firebase initializing

const root = createRoot(document.getElementById("root") as Element);
root.render(
   <Provider store={store}>
      <BrowserRouter>
         <App socket={socket} peer={peer} />
      </BrowserRouter>
   </Provider>
);

serviceWorker.unregister();
