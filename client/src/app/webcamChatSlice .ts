import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface webcamChatState {
   peerId: string | null,
   remotePeerId: string | null,
}

const initialState = {
   peerId: null,
   remotePeerId: null
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
      },
      remotePeerIdSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.remotePeerId = action.payload
         } else {
            state.remotePeerId = initialState.peerId
         }
      }
   }
})

export const { peerIdSave, remotePeerIdSave } = webcamChatSlice.actions
export const selectPeerId = (state: RootState) => state.webcamChat.peerId
export const selectRemotePeerId = (state: RootState) => state.webcamChat.remotePeerId

export default webcamChatSlice.reducer