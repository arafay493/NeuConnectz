/***** Note: AuthReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: Reducer states...!
const initialState = {
    authenticatedUser: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // LOG_IN_USER: (state, action: PayloadAction<any>) => {
        //     console.log("User data in auth reducer: ", action.payload);
        // },
    }
});

export const
    {
    } = authSlice.actions;
export default authSlice.reducer;