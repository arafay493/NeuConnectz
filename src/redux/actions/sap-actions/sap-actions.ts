// Note: All SAP action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { AddSAPConfigDataType } from "@/types/modules/sap-types/sap-types";
import { ResHandler } from "@/types/api-types";

// Note: Action function to add SAP configuration...!
const addSAPConfiguration = createAsyncThunk(
    "sap/addSAPConfiguration",
    async (
        { token, sapConfigData, resHandler }:
            {
                token: string,
                sapConfigData: AddSAPConfigDataType,
                resHandler: ResHandler
            },
        { dispatch }
    ) => {
        console.log("Add SAP configuration data in SAP action: ", sapConfigData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: sapConfigData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_ADD_SAP_CONFIGURATION
                }
            });
        console.log("Response in SAP action: ", response);
        const { status, data } = response;

        if (status == 200) {
        //     resHandler(response);
        };
        }

        catch (error: any) {
        console.log('Error occured in Add SAP configuration api integration: ', error);
        // resHandler(error?.response);
        };
    }
);

export { addSAPConfiguration };