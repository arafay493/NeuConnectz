import { logout } from "@/constants/logout";
import { apiPost } from "@/lib/api-service";
import { LOG_IN_USER, REFRESH_TOKEN } from "@/redux/reducers/auth-reducer/auth-reducer";
import { ResHandler } from "@/types/api-types";
import { LoginUserDataType, RefreshTokenType } from "@/types/modules/user-types/user-types";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Note: Action function to log in user...!
const logInUser = createAsyncThunk(
    "auth/login",
    async (
        {
            loginData,
            resHandler
        }: { loginData: LoginUserDataType, resHandler: ResHandler },
        { dispatch }
    ) => {
        try {
            const response = await apiPost('/auth/signup', loginData);

            const { status, data } = response;

            if (status === 200) {
                resHandler(response);
                dispatch(LOG_IN_USER(data?.data));
            }
        } catch (error: any) {
            resHandler(error?.response);
        };
    }
);

// Note: Action function to refresh token...!
const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (tokenData: RefreshTokenType, { dispatch }) => {

        try {
            const response = await apiPost('/auth/login', tokenData, tokenData.accessToken)

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
