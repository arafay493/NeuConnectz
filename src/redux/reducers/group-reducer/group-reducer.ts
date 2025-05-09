/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: GroupStateType = {
    ListAllGroupCodes: [],
    GroupErrorState: ""
};

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA: (state) => {
            state.ListAllGroupCodes = [];
            state.GroupErrorState = "You are not authorized to access this data!";
        },

        FETCH_ALL_GROUP_CODES: (state, action: PayloadAction<any>) => {
            // console.log("Group codes list data in reducer: ", action.payload);
            state.GroupErrorState = "";
            state.ListAllGroupCodes = action?.payload;
        },

        CLEAR_ALL_GROUP_STATES: (state) => {
            state.ListAllGroupCodes = [];
            state.GroupErrorState = "";
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GROUPS_DATA,
        FETCH_ALL_GROUP_CODES,
        CLEAR_ALL_GROUP_STATES
    } = groupSlice.actions;
export default groupSlice.reducer;