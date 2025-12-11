// src/slices/signupSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import { setIn } from "formik";

const initialState = {
    user: {name : "ali xyz "},
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
    
     

    },
});

export const {
    setUser,
  
} = homeSlice.actions;

export default homeSlice.reducer;
