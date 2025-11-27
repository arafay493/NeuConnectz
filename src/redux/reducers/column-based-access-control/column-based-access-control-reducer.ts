import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    putaway_unposted_columns: {
        serialNumber: {
            label: "S.No",
            value: true,
        },
        docNum: {
            label: "Doc Number",
            value: true,
        },
        transferReceiptNumber: {
            label: "TR Number",
            value: true,
        },
        material: {
            label: "Material Code",
            value: true,
        },
        materialDescription: {
            label: "Material Name",
            value: true,
        },
        materialDocument: {
            label: "Material Doc",
            value: true,
        },
        baseUOM: {
            label: "UOM",
            value: true,
        },
        totalQuantity: {
            label: "Quantity",
            value: true,
        },
        movementType: {
            label: "Movement Type",
            value: true,
        },
        purchaseOrder: {
            label: "Purchase Order",
            value: true,
        },
        supplierName: {
            label: "Suppliers",
            value: true,
        },
        sourceStorageBin: {
            label: "Source Bin",
            value: true,
        },
        confirmationStatus: {
            label: "Status",
            value: true,
        },
        createdOn: {
            label: "Date",
            value: true,
        },
        actions: {
            label: "Actions",
            value: true,
        },
    },
    userList: {}
};


const columnBasedAccessControlSlice = createSlice({
    name: "columnBasedAccessControl",
    initialState,
    reducers: {
        PUTAWAY_UNPOSTED: (state, action: PayloadAction<any>) => {
            state.putaway_unposted_columns = action?.payload
        }
    }
});

export const
    {
        PUTAWAY_UNPOSTED
    } = columnBasedAccessControlSlice.actions;
export default columnBasedAccessControlSlice.reducer;