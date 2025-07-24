/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: GroupStateType = {
    ListAllGroupCodes: {
        groups: [],
        totalCount: 0
    },
    listGroupCodesByUserId: [],
    GroupErrorState: ""
};

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA: (state) => {
            state.ListAllGroupCodes = {
                groups: [],
                totalCount: 0
            };
            state.listGroupCodesByUserId = [];
            state.GroupErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_GROUP_CODES: (state, action: PayloadAction<any>) => {
            state.GroupErrorState = "";
            state.ListAllGroupCodes = action?.payload;
        },

        FETCH_GROUP_CODES_BY_USER_ID: (state, action: PayloadAction<any>) => {
            state.GroupErrorState = "";
            state.listGroupCodesByUserId = [];
            state.listGroupCodesByUserId = action?.payload;
        },

        CLEAR_ALL_GROUP_STATES: (state) => {
            state.ListAllGroupCodes = {
                groups: [],
                totalCount: 0
            };
            state.listGroupCodesByUserId = [];
            state.GroupErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA,
        FETCH_ALL_GROUP_CODES,
        FETCH_GROUP_CODES_BY_USER_ID,
        CLEAR_ALL_GROUP_STATES
    } = groupSlice.actions;
export default groupSlice.reducer;