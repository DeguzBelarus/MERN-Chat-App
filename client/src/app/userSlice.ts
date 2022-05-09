import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { authorization } from "./userAPI"
interface UserState {
   userId: string | null,
   token: string | null,
   nickname: string | null,
   status: "idle" | "loading" | "failed",
   authMessage: string
   isStayLoggedIn: boolean
}

const initialState = {
   userId: null,
   token: null,
   nickname: null,
   status: "idle",
   authMessage: "",
   isStayLoggedIn: true
} as UserState

export const loginAsync = createAsyncThunk(
   "autorization/login",
   async (body: any) => {
      const url = "/api/authorization/login"
      const response: any = await authorization(url, body)
      return await response.json()
   }
)

export const registrationAsync = createAsyncThunk(
   "autorization/registration",
   async (body: any) => {
      const url = "/api/authorization/registration"
      const response: any = await authorization(url, body)
      return await response.json()
   }
)

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      userTokenSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.token = action.payload
         } else {
            state.token = initialState.token
         }
      }, userIdSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.userId = action.payload
         } else {
            state.userId = initialState.userId
         }
      }, userNicknameSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.nickname = action.payload
         } else {
            state.nickname = initialState.nickname
         }
      }, authMessageSave(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.authMessage = action.payload
         } else {
            state.authMessage = initialState.authMessage
         }
      }, isStayLoggedInSave(state: any, action: PayloadAction<any>) {
         if (state.isStayLoggedIn) {
            state.isStayLoggedIn = false
         } else {
            state.isStayLoggedIn = true
         }
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(loginAsync.pending, (state) => {
            state.status = "loading"
         })
         .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = "idle"
            if (action.payload.token
               && action.payload.nickname
               && action.payload.message
               && action.payload.userId) {
               state.token = action.payload.token
               state.nickname = action.payload.nickname
               state.userId = action.payload.userId
               state.authMessage = action.payload.message

               if (state.isStayLoggedIn) {
                  localStorage.setItem("saveChat", JSON.stringify({
                     token: state.token, nickname: state.nickname, userId: state.userId
                  }))
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(loginAsync.rejected, (state, action) => {
            state.status = "failed"
            state.authMessage = String(action.error.message)
         })
         .addCase(registrationAsync.pending, (state) => {
            state.status = "loading"
         })
         .addCase(registrationAsync.fulfilled, (state, action) => {
            state.status = "idle"
            state.authMessage = action.payload.message
         })
         .addCase(registrationAsync.rejected, (state, action) => {
            state.status = "failed"
            state.authMessage = String(action.error.message)
         })
   }
})

export const {
   userTokenSave,
   userIdSave,
   userNicknameSave,
   authMessageSave,
   isStayLoggedInSave
} = userSlice.actions

export const selectToken = (state: RootState) => state.user.token
export const selectUserId = (state: RootState) => state.user.userId
export const selectUserNickname = (state: RootState) => state.user.nickname
export const selectAuthMessage = (state: RootState) => state.user.authMessage
export const selectAuthStatus = (state: RootState) => state.user.status
export const selectIsStayLoggedIn = (state: RootState) => state.user.isStayLoggedIn

export default userSlice.reducer