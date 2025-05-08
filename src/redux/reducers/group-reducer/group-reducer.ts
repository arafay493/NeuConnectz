/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: GroupStateType = {
    ListAllGroupCodes: []
};

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        FETCH_ALL_GROUP_CODES: (state, action: PayloadAction<any>) => {
            // console.log("Group codes list data in reducer: ", action.payload);
            state.ListAllGroupCodes = action?.payload;
        },

        CLEAR_ALL_GROUP_STATES: (state) => {
            state.ListAllGroupCodes = [];
        },
    }
});

export const
    {
        FETCH_ALL_GROUP_CODES,
        CLEAR_ALL_GROUP_STATES
    } = groupSlice.actions;
export default groupSlice.reducer;