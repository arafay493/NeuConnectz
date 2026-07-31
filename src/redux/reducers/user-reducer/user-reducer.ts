/***** Note: UserReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: UserStateType = {
    usersList: {
        users: [],
        totalCount: 0
    },
    qtrackUsersList: {
        users: [],
        totalCount: 0
    },
    listDepartmentData: {
        departments: [],
        totalCount: 0
    },
    usersErrorState: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA: (state) => {
            state.usersList = {
                users: [],
                totalCount: 0
            };
            state.qtrackUsersList = {
                users: [],
                totalCount: 0
            };
            state.usersErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_USERS: (state, action: PayloadAction<any>) => {
            state.usersErrorState = ""
            state.usersList = action?.payload;
        },

        FETCH_ALL_QTRACK_USERS: (state, action: PayloadAction<any>) => {
            state.usersErrorState = ""
            state.qtrackUsersList = action?.payload?.data;
        },

        FETCH_ALL_LIST_DEPARTMENTS: (state, action: PayloadAction<any>) => {
            state.listDepartmentData = action?.payload;
        },

        CLEAR_ALL_USER_STATES: (state) => {
            state.usersList = {
                users: [],
                totalCount: 0
            };
            state.qtrackUsersList = {
                users: [],
                totalCount: 0
            };
            state.listDepartmentData = {
                departments: [],
                totalCount: 0
            };
            state.usersErrorState = ""
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_USERS_DATA,
        FETCH_ALL_USERS,
        FETCH_ALL_QTRACK_USERS,
        FETCH_ALL_LIST_DEPARTMENTS,
        CLEAR_ALL_USER_STATES
    } = userSlice.actions;
export default userSlice.reducer;