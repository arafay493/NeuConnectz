// Note: This function will run when auth token expired or session expired...!

import { deleteCookie } from "cookies-next"
import showNotificationToast from "@/lib/notification-toast/notification-toast"
import { store } from "@/redux/store";
import { LOG_OUT_USER } from "@/redux/reducers/auth-reducer/auth-reducer";
import { CLEAR_ALL_USER_STATES } from "@/redux/reducers/user-reducer/user-reducer";
import { CLEAR_ALL_WAREHOUSE_STATES } from "@/redux/reducers/warehouse-reducer/warehouse-reducer";
import { CLEAR_ALL_GROUP_STATES } from "@/redux/reducers/group-reducer/group-reducer";
import { CLEAR_ALL_SAP_STATES } from "@/redux/reducers/sap-reducer/sap-reducer";
import { refreshToken } from "@/redux/actions/auth-actions/auth-actions";
import { RefreshTokenType } from "@/types/modules/user-types/user-types";
import { customStyles } from "@/styles/custom-theme";

export const sessionExpired = (message: string): void => {
    const fetchAuthUser = store.getState().authStates.authenticatedUser;

    if (fetchAuthUser) {
        console.log("Expired token data: ", fetchAuthUser);
        const tokenData: RefreshTokenType = {
            accessToken: fetchAuthUser?.token,
            refreshToken: fetchAuthUser?.refreshToken
        };
        store.dispatch(refreshToken(tokenData));
    };


    // showNotificationToast("Session Expired", message, customStyles.colors._408CCE);
    // setTimeout(() => {
    //     window.location.reload();
    //     store.dispatch(LOG_OUT_USER());
    //     store.dispatch(CLEAR_ALL_USER_STATES());
    //     store.dispatch(CLEAR_ALL_WAREHOUSE_STATES());
    //     store.dispatch(CLEAR_ALL_GROUP_STATES());
    //     store.dispatch(CLEAR_ALL_SAP_STATES());
    //     deleteCookie("UserAuthenticated");
    //     deleteCookie("AuthToken");
    //     localStorage.clear();
    // }, 2000);
};