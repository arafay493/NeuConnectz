// Note: This function will run when auth token expired or session expired...!

import { deleteCookie } from "cookies-next"
import showNotificationToast from "@/lib/notification-toast/notification-toast"
import { customStyles } from "@/styles/custom-theme";
import { store } from "@/redux/store";
import { LOG_OUT_USER } from "@/redux/reducers/auth-reducer/auth-reducer";
import { CLEAR_ALL_USER_STATES } from "@/redux/reducers/user-reducer/user-reducer";
import { CLEAR_ALL_WAREHOUSE_STATES } from "@/redux/reducers/warehouse-reducer/warehouse-reducer";
import { CLEAR_ALL_GROUP_STATES } from "@/redux/reducers/group-reducer/group-reducer";

export const sessionExpired = (message: string): void => {
    showNotificationToast("Session Expired", message, customStyles.colors._408CCE);
    setTimeout(() => {
        window.location.reload();
        store.dispatch(LOG_OUT_USER());
        store.dispatch(CLEAR_ALL_USER_STATES());
        store.dispatch(CLEAR_ALL_WAREHOUSE_STATES());
        store.dispatch(CLEAR_ALL_GROUP_STATES());
        deleteCookie("UserAuthenticated");
        deleteCookie("AuthToken");
        localStorage.clear();
    }, 2000);
};