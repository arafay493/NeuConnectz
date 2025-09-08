import AuthService from "@/lib/auth-service/auth-service";
import { apiPost } from "@/lib/api-service";
import { customStyles } from "@/styles/custom-theme";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { logout } from "./logout";

export const handleRefreshToken = async (message: string): Promise<boolean> => {
    try {
        const accessToken = AuthService.getAccessToken();
        const refreshToken = AuthService.getRefreshToken();

        if (!accessToken || !refreshToken) {
            logout("Session Expired", "No valid tokens found");
            return false;
        }

        const response = await apiPost(`/auth${process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN}`, {
            accessToken,
            refreshToken
        });

        const { status, data } = response;

        if (status === 200) {
            // Update tokens using AuthService
            AuthService.setTokens(data.data.accessToken, data.data.refreshToken);
            showNotificationToast("Token Refreshed", "Session has been renewed", customStyles.colors._408CCE);

            window.location.reload();
            return true; // Return success
        }

        if (status === 401) {
            logout("Session Expired", message);
            window.location.reload();
            return false;
        }

        return false;
    } catch (error) {
        console.error("Refresh token failed:", error);
        logout("Session Expired", "Unable to refresh session");
        return false;
    }
};