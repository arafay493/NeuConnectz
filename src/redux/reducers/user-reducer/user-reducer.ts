/***** Note: UserReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: UserStateType = {
    usersList: [],
    usersErrorState: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA: (state) => {
            state.usersList = [];
            state.usersErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_USERS: (state, action: PayloadAction<any>) => {
            // console.log("Users list data in user reducer: ", action.payload);
            state.usersErrorState = ""
            state.usersList = action?.payload;
        },

        CLEAR_ALL_USER_STATES: (state) => {
            state.usersList = [];
            state.usersErrorState = ""
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA,
        FETCH_ALL_USERS,
        CLEAR_ALL_USER_STATES
    } = userSlice.actions;
export default userSlice.reducer;