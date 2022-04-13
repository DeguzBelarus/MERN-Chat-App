import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from "../app/userSlice"
import chatReducer from "../app/chatSlice"
import globalReducer from "../app/globalSlice"

export const store = configureStore({
   reducer: {
      user: userReducer,
      chat: chatReducer,
      global: globalReducer
   },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
   ReturnType,
   RootState,
   unknown,
   Action<string>
>;
