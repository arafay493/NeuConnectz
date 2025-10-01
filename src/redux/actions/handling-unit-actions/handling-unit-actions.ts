import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiDelete } from "@/lib/api-service";
import { AddHandlingUnit } from "@/types/redux-types";
import { FETCH_HANDLING_UNIT_DATA, SET_HANDLING_UNIT_LOADING } from "@/redux/reducers/handling-unit-reducer/handling-unit-reducer";

const fetchHandlingUnits = createAsyncThunk(
    "handlingUnit/fetchHandlingUnits",
    async ({ lastCount, skipRecords }:
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
        const { status, data } = response;

        resHandler(status);
    }
);

export {
    addHandlingUnit,
    fetchHandlingUnits,
    assignHandlingUnitToItems
};
