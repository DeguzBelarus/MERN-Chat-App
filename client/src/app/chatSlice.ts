import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface chatState {
    sendMessageFunction: any | null
}

const initialState = {
    sendMessageFunction: null
} as chatState

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        messageFunctionSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.sendMessageFunction = action.payload
            } else {
                state.sendMessageFunction = null
            }
        }
    }
})

export const { messageFunctionSave } = chatSlice.actions
export const selectMessageFunction = (state: RootState) => state.chat.sendMessageFunction

export default chatSlice.reducer