import React from 'react';
import { io } from "socket.io-client";
import { createRoot } from "react-dom/client";
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom"
import * as serviceWorker from './serviceWorker';

import App from './App';

import './index.scss';

const socket = io()

const root = createRoot(document.getElementById("root") as Element);
root.render(
   <Provider store={store}>
      <BrowserRouter>
         <App socket={socket} />
      </BrowserRouter>
   </Provider>
);

serviceWorker.unregister();
