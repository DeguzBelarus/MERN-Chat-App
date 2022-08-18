import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { authorization, checkAuthorization } from "./userAPI"
import jwtDecode from "jwt-decode"
interface UserState {
   token: string,
   isAuth: boolean,
   role: "USER" | "ADMIN" | "CREATOR",
   userId: string,
   nickname: string | null,
   isStayLoggedIn: boolean,
   status: "idle" | "loading" | "failed",
   authMessage: string
}

const initialState = {
   token: "",
   isAuth: false,
   role: "USER",
   userId: "",
   nickname: null,
   isStayLoggedIn: true,
   status: "idle",
   authMessage: ""
} as UserState

export interface UserRegistrationObject {
   email: string,
   password: string,
   nickname: string,
   role?: string,
   lang: string
}

// thunks
export const registrationAsync = createAsyncThunk(
   "user/registration",
   async (body: any) => {
      const url = `/api/user/registration`
      const response: any = await authorization(url, JSON.stringify(body))
      const result = await response.json()
      if (result.token) {
         return { userData: jwtDecode(result.token), responseData: result }
      } else {
         return result
      }
   }
)

export interface UserLoginObject {
   email: string,
   password: string,
   lang: string
}

export const loginAsync = createAsyncThunk(
   "user/login",
   async (body: any) => {
      const url = `/api/user/login`
      const response: any = await authorization(url, JSON.stringify(body))
      const result = await response.json()
      if (result.token) {
         return { userData: jwtDecode(result.token), responseData: result }
      } else {
         return result
      }
   }
)

export const checkAuthorizationAsync = createAsyncThunk(
   "user/checkauthorization",
   async (token: string) => {
      const url = `/api/user/authcheck`
      const response: any = await checkAuthorization(url, token)
      const result = await response.json()
      if (result.token) {
         return { userData: jwtDecode(result.token), responseData: result }
      } else {
         return result
      }
   }
)
// thunks

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUserToken(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.token = action.payload
         } else {
            state.token = initialState.token
         }
      }, setUserId(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.userId = action.payload
         } else {
            state.userId = initialState.userId
         }
      }, setUserNickname(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.nickname = action.payload
         } else {
            state.nickname = initialState.nickname
         }
      }, setAuthMessage(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.authMessage = action.payload
         } else {
            state.authMessage = initialState.authMessage
         }
      }, setIsStayLoggedIn(state: any, action: PayloadAction<any>) {
         if (state.isStayLoggedIn) {
            state.isStayLoggedIn = false
         } else {
            state.isStayLoggedIn = true
         }
      }, setIsAuth(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.isAuth = action.payload
         } else {
            state.isAuth = initialState.isAuth
         }
      }, setRole(state: any, action: PayloadAction<any>) {
         if (action.payload) {
            state.role = action.payload
         } else {
            state.role = initialState.role
         }
      }
   },
   extraReducers: (builder) => {
      builder

         // login
         .addCase(loginAsync.pending, (state) => {
            state.status = "loading"
         })
         .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = "idle"

            if (action.payload.userData) {
               state.isAuth = true
               state.userId = action.payload.userData.id
               state.nickname = action.payload.userData.nickname
               state.role = action.payload.userData.role
               state.authMessage = action.payload.userData.message
               state.token = action.payload.userData.token

               if (state.isStayLoggedIn) {
                  localStorage.setItem("MySNToken", action.payload.responseData.token)
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(loginAsync.rejected, (state, action) => {
            state.status = "failed"
            state.authMessage = String(action.error.message)
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // login

         // check authorization
         .addCase(checkAuthorizationAsync.pending, (state) => {
            state.status = "loading"
         })
         .addCase(checkAuthorizationAsync.fulfilled, (state, action) => {
            state.status = "idle"

            if (action.payload.userData) {
               state.isAuth = true
               state.userId = action.payload.userData.id
               state.nickname = action.payload.userData.nickname
               state.role = action.payload.userData.role
               state.authMessage = action.payload.userData.message
               state.token = action.payload.userData.token

               if (state.isStayLoggedIn) {
                  localStorage.setItem("MySNToken", action.payload.responseData.token)
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(checkAuthorizationAsync.rejected, (state, action) => {
            state.status = "failed"
            state.authMessage = String(action.error.message)
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
         // check authorization

         // registration
         .addCase(registrationAsync.pending, (state) => {
            state.status = "loading"
         })
         .addCase(registrationAsync.fulfilled, (state, action) => {
            state.status = "idle"

            if (action.payload.userData) {
               state.isAuth = true
               state.userId = action.payload.userData.id
               state.nickname = action.payload.userData.nickname
               state.role = action.payload.userData.role
               state.authMessage = action.payload.userData.message
               state.token = action.payload.userData.token

               if (state.isStayLoggedIn) {
                  localStorage.setItem("MySNToken", action.payload.responseData.token)
               }
            } else {
               state.authMessage = action.payload.message
            }
         })
         .addCase(registrationAsync.rejected, (state, action) => {
            state.status = "failed"
            state.authMessage = String(action.error.message)
            console.error("\x1b[40m\x1b[31m\x1b[1m", action.error.message);
         })
      // registration
   }
})

export const {
   setUserToken,
   setUserId,
   setUserNickname,
   setAuthMessage,
   setIsStayLoggedIn,
   setIsAuth,
   setRole
} = userSlice.actions

export const getToken = (state: RootState) => state.user.token
export const getUserId = (state: RootState) => state.user.userId
export const getUserNickname = (state: RootState) => state.user.nickname
export const getAuthMessage = (state: RootState) => state.user.authMessage
export const getAuthStatus = (state: RootState) => state.user.status
export const getIsStayLoggedIn = (state: RootState) => state.user.isStayLoggedIn
export const getIsAuth = (state: RootState) => state.user.isAuth
export const getRole = (state: RootState) => state.user.role

export default userSlice.reducer