import AuthService from "@/lib/auth-service/auth-service";
import { apiPost } from "@/lib/api-service";
import { customStyles } from "@/styles/custom-theme";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { logout } from "./logout";

export const handleRefreshToken = async (message: string) => {
    const accessToken = AuthService.getAccessToken();
    const refreshToken = AuthService.getRefreshToken();

    const response = await apiPost('/auth/login', { accessToken, refreshToken });

    const { status, data } = response;

    console.log("Response from refresh token API: ", response);

    if (status === 200) {
        showNotificationToast("Session Expired", "Token has been refreshed", customStyles.colors._408CCE)
        AuthService.setTokens(data.data.accessToken, data.data.refreshToken)
    }


    if (status === 401) {
        console.log(message)
        logout("Session Expired", message);
    }
};