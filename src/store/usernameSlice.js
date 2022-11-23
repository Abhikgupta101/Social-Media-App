import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userName: '',
}

const usernameSlice = createSlice({
    name: "username",
    initialState,
    reducers: {
        setUserName: (state, action) => {
            state.userName = action.payload;
        },
    }
})

export const { setUserName } = usernameSlice.actions;

export default usernameSlice.reducer;