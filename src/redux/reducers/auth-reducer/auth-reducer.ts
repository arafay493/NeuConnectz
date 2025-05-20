/***** Note: AuthReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: AuthStateType = {
    authenticatedUser: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        REFRESH_TOKEN: (state, action: PayloadAction<any>) => {
            // console.log("Refresh token data in auth reducer: ", action.payload);

            if (state.authenticatedUser) {
                state.authenticatedUser.token = action.payload.accessToken;
                state.authenticatedUser.refreshToken = action.payload.refreshToken;
            };
        },

        LOG_IN_USER: (state, action: PayloadAction<any>) => {
            // console.log("User data in auth reducer: ", action.payload);
            state.authenticatedUser = action?.payload;
        },

        LOG_OUT_USER: (state) => {
            state.authenticatedUser = null;
        }
    }
});

export const
    {
        LOG_IN_USER,
        LOG_OUT_USER,
        REFRESH_TOKEN
    } = authSlice.actions;
export default authSlice.reducer;