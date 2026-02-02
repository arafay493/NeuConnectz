import { apiGet, apiPost } from "@/lib/api-service";
import { FETCH_HANDLING_UNIT_DATA, GET_HANDLING_UNIT_BY_ITEM_ID, SET_HANDLING_UNIT_LOADING } from "@/redux/reducers/handling-unit-reducer/handling-unit-reducer";
import { AddHandlingUnit } from "@/types/redux-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchHandlingUnits = createAsyncThunk(
    "handlingUnit/fetchHandlingUnits",
    async ({ lastCount = 40, skipRecords = 0 }:
        {
            lastCount?: number,
            skipRecords?: number
        }, { dispatch }) => {

        // Set loading to true at the start
        dispatch(SET_HANDLING_UNIT_LOADING(true));

        const params: { [key: string]: number } = {};
        if (lastCount !== undefined) params.LastCount = lastCount;
        if (skipRecords !== undefined) params.skipRecords = skipRecords;

        try {
            const response = await apiGet(
                `/trace-and-track/v2${process.env.NEXT_PUBLIC_LIST_HANDLING_UNIT}`, '',
                params
            );

            const { status, data } = response;

            if (status == 201 || status == 200) {
                dispatch(FETCH_HANDLING_UNIT_DATA(data?.data));
            } else {
                // Set loading to false if request fails
                dispatch(SET_HANDLING_UNIT_LOADING(false));
            }

            return response;
        } catch (error) {
            // Set loading to false if request fails
            dispatch(SET_HANDLING_UNIT_LOADING(false));
            throw error;
        }
    }
);

const getHandlingUnitByItemId = createAsyncThunk(
    "handlingUnit/getHandlingUnitByItemId",
    async ({ itemId }: { itemId: string }, { dispatch }) => {
        console.log('Item Id: ', itemId);
        const response = await apiGet(`trace-and-track/v2${process.env.NEXT_PUBLIC_GET_GROUP_BY_ITEM}/${itemId}`);
        console.log('getHandlingUnitByItemId res: ', response);

        const { status, data } = response;

        if (status == 201 || status == 200) {
            dispatch(GET_HANDLING_UNIT_BY_ITEM_ID(data?.data));
        }

        return response;
    }
)

const addHandlingUnit = createAsyncThunk(
    "handlingUnit/addHandlingUnit",
    async ({ body, resHandler }: { body: AddHandlingUnit, resHandler: (status: number) => void }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_ADD_HANDLING_UNIT}`, body);
        const { status, data } = response;

        resHandler(status);
    }
);

const assignHandlingUnitToItems = createAsyncThunk(
    "handlingUnit/assignHandlingUnitToItems",
    async ({ body, resHandler }: { body: { groupId: string, itemIds: string[] }, resHandler: (status: number) => void }, { dispatch }) => {
        const response = await apiPost(`/trace-and-track/v2${process.env.NEXT_PUBLIC_ASSIGN_GROUP_TO_ITEMS}`, body);
        console.log('Assign handeling unit res: ', response);
        const { status, data } = response;

        resHandler(status);
    }
);

export {
    addHandlingUnit, assignHandlingUnitToItems, fetchHandlingUnits,
    getHandlingUnitByItemId
};

