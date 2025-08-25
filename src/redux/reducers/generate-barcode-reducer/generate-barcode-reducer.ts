import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenerateBarcodeStateProps } from "@/types/redux-types";

// Note: Reducer states...!
const initialState: GenerateBarcodeStateProps = {
    generateBarcodeData: null,
};

const generateBarcode = createSlice({
    name: "generateBarcode",
    initialState,
    reducers: {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GENERATE_BARCODE_DATA: (state) => {
            state.generateBarcodeData = null;
        },

        FETCH_GENERATE_BARCODE_DATA: (state, action: PayloadAction<any>) => {
            state.generateBarcodeData = action?.payload;
        },

        CLEAR_ALL_GENERATE_BARCODE_STATES: (state) => {
            state.generateBarcodeData = null;
        },
    }
});

export const
    {
        UNAUTHORIZE_USER_TRYING_TO_ACCESS_GENERATE_BARCODE_DATA,
        FETCH_GENERATE_BARCODE_DATA,
        CLEAR_ALL_GENERATE_BARCODE_STATES
    } = generateBarcode.actions;
export default generateBarcode.reducer;