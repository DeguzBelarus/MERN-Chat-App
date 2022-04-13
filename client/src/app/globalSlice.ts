import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface globalState {
   currentLanguage: string,
}

const initialState = {
   currentLanguage: "ru",
} as globalState

export const globalSlice = createSlice({
   name: "global",
   initialState,
   reducers: {
      currentLanguageSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.currentLanguage = action.payload
         } else {
            state.currentLanguage = initialState.currentLanguage
         }
      }
   }
})

export const { currentLanguageSave } = globalSlice.actions
export const selectCurrentLanguage = (state: RootState) => state.global.currentLanguage

export default globalSlice.reducer