import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface UserState {
    userId: string | null,
    token: string | null,
    nickname: string | null
}

const initialState = {
    userId: null,
    token: null,
    nickname: null,
} as UserState

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userTokenSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.token = action.payload
            } else {
                state.token = null
            }
        },
        userIdSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.userId = action.payload
            } else {
                state.userId = null
            }
        },
        userNicknameSave(state: any, action: PayloadAction<any>) {
            if (action.payload) {
                state.nickname = action.payload
            } else {
                state.nickname = null
            }
        }
    }
})

export const { userTokenSave, userIdSave, userNicknameSave } = userSlice.actions

export const selectToken = (state: RootState) => state.user.token
export const selectUserId = (state: RootState) => state.user.userId
export const selectUserNickname = (state: RootState) => state.user.nickname

export default userSlice.reducer