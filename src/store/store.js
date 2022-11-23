import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import usernameReducer from "./usernameSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        username: usernameReducer,
    },
})

export default store;