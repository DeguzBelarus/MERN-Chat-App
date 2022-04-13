import React from 'react';
import { io } from "socket.io-client";
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

const socket = io()

test('renders learn react link', () => {
   const { getByText } = render(
      <Provider store={store}>
         <App socket={socket} />
      </Provider>
   );

   expect(getByText(/learn/i)).toBeInTheDocument();
});
