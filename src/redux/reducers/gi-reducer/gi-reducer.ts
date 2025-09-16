import { GoodsIssueListStateProps } from "@/types/redux-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Note: Reducer states...!
const initialState: GoodsIssueListStateProps = {
    listGoodIssue: [],
    totalCount: 0
};

const SAPReducer = createSlice({
    name: "sap",
    initialState,
    reducers: {

        FETCH_ALL_GOODS_ISSUE: (state, action: PayloadAction<any>) => {
            console.log('Goods issue data in GI reducer: ', action?.payload);
            state.listGoodIssue = [];
            state.listGoodIssue = action?.payload?.goodsIssueData;
            state.totalCount = action?.payload?.totalGoodsIssueCount;
        },

        CLEAR_ALL_GI_DATA: (state) => {
            state.listGoodIssue = [];
            state.totalCount = 0;
        },
    }
});

export const
    {
        FETCH_ALL_GOODS_ISSUE,
        CLEAR_ALL_GI_DATA
    } = SAPReducer.actions;
export default SAPReducer.reducer;