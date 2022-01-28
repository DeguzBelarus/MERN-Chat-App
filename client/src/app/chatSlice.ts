import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface chatState {
    privateRecipient: any | null,
    usersInChat: object,
    messagesInChat: object
}

const initialState = {
    privateRecipient: null,
    usersInChat: [],
    messagesInChat: []
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
        usersInChatSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.usersInChat = action.payload
            } else {
                state.usersInChat = []
            }
        },
        messagesInChatSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.messagesInChat = action.payload
            } else {
                state.messagesInChat = []
            }
        }
    }
})

export const { privateRecipientSave, usersInChatSave, messagesInChatSave } = chatSlice.actions
export const selectPrivateRecipient = (state: RootState) => state.chat.privateRecipient
export const selectUsersInChat = (state: RootState) => state.chat.usersInChat
export const selectMessagesInChat = (state: RootState) => state.chat.messagesInChat

export default chatSlice.reducer