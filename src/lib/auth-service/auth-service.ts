/***** Centralized Authentication Service *****/

import { setCookie, getCookie, deleteCookie } from "cookies-next";

class AuthService {
    private static readonly TOKEN_KEY = "AuthToken";
    private static readonly USER_AUTH_KEY = "UserAuthenticated";
    private static readonly REFRESH_TOKEN_KEY = "RefreshToken";

    // Set tokens (both access and refresh)
    static setTokens(accessToken: string, refreshToken?: string): void {
        try {
            // Set tokens as HTTP-only cookies for security
            setCookie(this.TOKEN_KEY, accessToken);
            setCookie(this.USER_AUTH_KEY, "true");

            if (refreshToken) {
                setCookie(this.REFRESH_TOKEN_KEY, refreshToken);
            }
        } catch (error) {
            console.error("Error setting tokens:", error);
        }
    }

    // Get access token
    static getAccessToken(): string | null {
        try {
            return getCookie(this.TOKEN_KEY) as string || null;
        } catch (error) {
            console.error("Error getting access token:", error);
            return null;
        }
    }

    // Get refresh token
    static getRefreshToken(): string | null {
        try {
            return getCookie(this.REFRESH_TOKEN_KEY) as string || null;
        } catch (error) {
            console.error("Error getting refresh token:", error);
            return null;
        }
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        return !!this.getAccessToken() && !!getCookie(this.USER_AUTH_KEY);
    }

    // Clear all tokens
    static clearTokens(): void {
        try {
            deleteCookie(this.TOKEN_KEY);
            deleteCookie(this.USER_AUTH_KEY);
            deleteCookie(this.REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error("Error clearing tokens:", error);
        }
    }

    // Token validation (check if token is expired)
    static isTokenValid(token?: string): boolean {
        const tokenToCheck = token || this.getAccessToken();
        if (!tokenToCheck) return false;

        try {
            // Decode JWT token to check expiration
            const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            console.error("Error validating token:", error);
            return false;
        }
    }
}

export default AuthService;
