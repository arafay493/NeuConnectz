/***** Note: UserReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: UserStateType = {
    usersList: []
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        FETCH_ALL_USERS: (state, action: PayloadAction<any>) => {
            // console.log("Users list data in user reducer: ", action.payload);
            state.usersList = action?.payload;
        },

        CLEAR_ALL_USER_STATES: (state) => {
            state.usersList = [];
        },
    }
});

export const
    {
        FETCH_ALL_USERS,
        CLEAR_ALL_USER_STATES
    } = userSlice.actions;
export default userSlice.reducer;