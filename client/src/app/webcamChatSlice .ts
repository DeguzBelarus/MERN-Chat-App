import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface webcamChatState {
   peerId: string | null,
}

const initialState = {
   peerId: null,
} as webcamChatState

export const webcamChatSlice = createSlice({
   name: "webcam chat",
   initialState,
   reducers: {
      peerIdSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.peerId = action.payload
         } else {
            state.peerId = initialState.peerId
         }
      }
   }
})

export const { peerIdSave } = webcamChatSlice.actions
export const selectPeerId = (state: RootState) => state.webcamChat.peerId

export default webcamChatSlice.reducer