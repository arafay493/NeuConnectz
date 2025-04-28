// Note: All authenticated action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { LoginUserDataType } from "@/types/modules/user-types/user-types";
import { LOG_IN_USER } from "@/redux/reducers/auth-reducer/auth-reducer";
import { ResHandler } from "@/types/api-types";

// Note: Action function to log in user...!
const logInUser = createAsyncThunk(
    "auth/login",
    async (
        { loginData, resHandler }: { loginData: LoginUserDataType, resHandler: ResHandler },
        { dispatch }
    ) => {
        // console.log("Login data in auth action: ", loginData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: loginData,
                headers: {
                    "Login-Api-Url": process.env.NEXT_PUBLIC_AUTH_LOGIN_API
                }
            });
            // console.log("Response in login action: ", response);
            const { status, data } = response;

            if (status == 200) {
                resHandler(response);
                dispatch(LOG_IN_USER(data?.data));
            };
        }

        catch (error: any) {
            // console.log('Error occured in login api integration: ', error);
            resHandler(error?.response);
        };
    }
);

export { logInUser };