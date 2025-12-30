// Note: Logout handler...!

import { deleteCookie } from 'cookies-next';
import { store } from "@/redux/store";
import { LOG_OUT_USER } from "@/redux/reducers/auth-reducer/auth-reducer";
import { CLEAR_ALL_USER_STATES } from "@/redux/reducers/user-reducer/user-reducer";
import { CLEAR_ALL_WAREHOUSE_STATES } from "@/redux/reducers/warehouse-reducer1/warehouse-reducer";
import { CLEAR_ALL_GROUP_STATES } from "@/redux/reducers/group-reducer/group-reducer";
import { CLEAR_ALL_SAP_STATES } from "@/redux/reducers/sap-reducer/sap-reducer";
import { CLEAR_ALL_ROLES_STATES } from '@/redux/reducers/roles-reducer/roles-reducer';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';

export const logout = (message: string, description: string): void => {
    if (message) {
        // Note: For showing logout message...!
        showNotificationToast(message, description, customStyles.colors._408CCE);

        setTimeout(() => {

            // Note: Clearing redux states...!
            store.dispatch(LOG_OUT_USER());
            store.dispatch(CLEAR_ALL_USER_STATES());
            store.dispatch(CLEAR_ALL_WAREHOUSE_STATES());
            store.dispatch(CLEAR_ALL_GROUP_STATES());
            store.dispatch(CLEAR_ALL_SAP_STATES());
            store.dispatch(CLEAR_ALL_ROLES_STATES());

            // Note: Clearing cookies...!
            deleteCookie("UserAuthenticated");
            deleteCookie("AuthToken");

            // Note: Clearing local storage...!
            localStorage.clear();

            // Note: Reload the window and redirecting to login page...!
            window.location.reload();
        }, 2000);
    };
};