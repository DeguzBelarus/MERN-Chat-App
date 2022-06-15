import React from 'react';
import { io } from "socket.io-client";
import Peer from "peerjs";
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

const socket = io()
const peer = new Peer({
   path: "/peerjs",
   host: "/",
   port: 5000
})

test('renders learn react link', () => {
   const { getByText } = render(
      <Provider store={store}>
         <App socket={socket} peer={peer} />
      </Provider>
   );

   expect(getByText(/learn/i)).toBeInTheDocument();
});
