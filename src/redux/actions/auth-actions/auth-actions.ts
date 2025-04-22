// Note: All authenticated action functions are defined here...!

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiRequestRoutes from "@/constants/api-request";
import API_METHODS from "@/constants/api-methods";
import { LoginUserDataType } from "@/types/modules/user-types/user-types";

// Note: Action function to login user...!
const loginUser = createAsyncThunk(
    "auth/login",
    async (loginData: LoginUserDataType) => {
        console.log("Login data in auth action: ", loginData);

        try {
            const response = await axios({
                method: API_METHODS.POST,
                url: apiRequestRoutes.postRequest,
                data: loginData,
                headers: {
                    "Login-Api-Url": process.env.NEXT_PUBLIC_AUTH_LOGIN_API
                }
            });
            console.log("Response in login action: ", response);
        }

        catch (error) {
            console.log('Error occured in login api integration: ', error);
        };
    }
);

export { loginUser };