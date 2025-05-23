// Note: All authenticated action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { LoginUserDataType, RefreshTokenType } from "@/types/modules/user-types/user-types";
import { LOG_IN_USER, REFRESH_TOKEN } from "@/redux/reducers/auth-reducer/auth-reducer";
import { ResHandler } from "@/types/api-types";
import { logout } from "@/constants/logout";

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
                    "Api-Url": process.env.NEXT_PUBLIC_AUTH_LOGIN_API
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

// Note: Action function to refresh token...!
const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (tokenData: RefreshTokenType, { dispatch }) => {
        // console.log("Token data in auth action: ", tokenData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: tokenData,
                headers: {
                    "Api-Url": process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN
                }
            });
            // console.log("Response in auth action: ", response);
            const { status, data } = response;

            if (status == 200) {
                // Note: Update the token in local storage...!
                localStorage.removeItem("AuthToken");
                localStorage.setItem("AuthToken", data?.data?.accessToken);

                // Note: Update the token data in reducer...!
                dispatch(REFRESH_TOKEN(data?.data));
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            };
        }

        catch (error: any) {
            // console.log('Error occured in refresh token api integration: ', error);
            const { status, data } = error?.response;

            const message = "Session Expired";
            const description = data?.error;

            // Note: 401
            if (status == 401) {
                logout(message, description);
            };
        };
    }
);

export { logInUser, refreshToken };