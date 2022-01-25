import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from "../app/userSlice"
import chatReducer from "../app/chatSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer
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
