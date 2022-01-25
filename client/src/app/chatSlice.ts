import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface chatState {
    privateRecipient: any | null,
    privateRecipientNickname: any | null,
    usersInChatCount: 0
}

const initialState = {
    privateRecipient: null,
    privateRecipientNickname: null,
    usersInChatCount: 0
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
        },
        privateRecipientNicknameSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.privateRecipientNickname = action.payload
            } else {
                state.privateRecipientNickname = null
            }
        },
        usersInChatCountSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.usersInChatCount = action.payload
            } else {
                state.usersInChatCount = 0
            }
        }
    }
})

export const { privateRecipientSave, privateRecipientNicknameSave, usersInChatCountSave } = chatSlice.actions
export const selectPrivateRecipient = (state: RootState) => state.chat.privateRecipient
export const selectPrivateRecipientNickname = (state: RootState) => state.chat.privateRecipientNickname
export const selectUsersInChatCount = (state: RootState) => state.chat.usersInChatCount


export default chatSlice.reducer