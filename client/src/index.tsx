import React from 'react';
import { createRoot } from "react-dom/client";
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom"
import * as serviceWorker from './serviceWorker';

import App from './App';

import './index.scss';

const root = createRoot(document.getElementById("root") as Element);
root.render(
   <Provider store={store}>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </Provider>
);

serviceWorker.unregister();
