/***** Note: GroupReducer *****/

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductionRecieptStateType } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: ProductionRecieptStateType = {
    ListAllProductionReciept: {
        data: [],
        totalCount: 0
    },
    ListAllProductionRecieptViewDetailsData: {
        data: [],
        totalCount: 0
    },
    ProductionRecieptErrorState: ""
};

const productionRecieptSlice = createSlice({
    name: "productionRecieptSlice",
    initialState,
    reducers: {
        FETCH_ALL_PRODUCTION_RECIEPT: (state, action: PayloadAction<any>) => {
            state.ProductionRecieptErrorState = "";
            state.ListAllProductionReciept = action?.payload?.data;
        },

        FETCH_ALL_PRODUCTION_RECIEPT_DETAILS_BY_DOC_NO: (state, action: PayloadAction<any>) => {
            state.ProductionRecieptErrorState = "";
            state.ListAllProductionRecieptViewDetailsData = {
                data: action?.payload?.data?.materialDetails,
                totalCount: action?.payload?.data?.totalCount
            };
        },

        CLEAR_ALL_PRODUCTION_RECIEPT_STATES: (state) => {
            state.ListAllProductionReciept = {
                data: [],
                totalCount: 0
            };
            state.ProductionRecieptErrorState = "";
        },

        CLEAR_ALL_PRODUCTION_RECIEPT_DETAILS_STATES: (state) => {
            state.ListAllProductionRecieptViewDetailsData = {
                data: [],
                totalCount: 0
            };
            state.ProductionRecieptErrorState = "";
        },
    }
});

export const
    {
        FETCH_ALL_PRODUCTION_RECIEPT,
        FETCH_ALL_PRODUCTION_RECIEPT_DETAILS_BY_DOC_NO,
        CLEAR_ALL_PRODUCTION_RECIEPT_STATES,
        CLEAR_ALL_PRODUCTION_RECIEPT_DETAILS_STATES
    } = productionRecieptSlice.actions;
export default productionRecieptSlice.reducer;