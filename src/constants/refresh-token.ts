// Note: Refresh token handler...!

import { store } from "@/redux/store";
import { refreshToken } from "@/redux/actions/auth-actions/auth-actions";
import { RefreshTokenType } from "@/types/modules/user-types/user-types";

export const handleRefreshToken = (message: string): void => {
    const fetchAuthUser = store.getState().authStates.authenticatedUser;

    if (fetchAuthUser) {
        // console.log("Expired token data: ", fetchAuthUser);
        const tokenData: RefreshTokenType = {
            accessToken: fetchAuthUser?.token,
            refreshToken: fetchAuthUser?.refreshToken
        };
        store.dispatch(refreshToken(tokenData));
    };
};