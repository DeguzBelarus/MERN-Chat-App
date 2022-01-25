import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface chatState {
    privateRecipient: any | null
}

const initialState = {
    privateRecipient: null
} as chatState

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        privateRecipientSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.privateRecipient = action.payload
            } else {
                state.privateRecipient = null
            }
        }
    }
})

export const { privateRecipientSave } = chatSlice.actions
export const selectPrivateRecipient = (state: RootState) => state.chat.privateRecipient

export default chatSlice.reducer