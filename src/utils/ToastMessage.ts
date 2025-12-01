import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { customStyles } from "@/styles/custom-theme";

const ToastMessage = (title: string, message: string, statusCode: number, error: string | null = null) => {
    if (error) {
        return showNotificationToast(
            title,
            `${message}\n${error}`,
            customStyles.colors.red
        );
    }
    else if (statusCode === 201) {
        return showNotificationToast(title, message, customStyles.colors._408CCE);
    } else if (statusCode === 200) {
        return showNotificationToast(title, message, customStyles.colors.green);
    } else {
        // return showNotificationToast(title, message + error, customStyles.colors.red);
        return showNotificationToast(
            title,
            `${message}\n${error}`,
            customStyles.colors.red
        );
        // return showNotificationToast(
        //     title,
        //     `${message}
        //     ${error}`,
        //     customStyles.colors.red
        // );
        // return showNotificationToast(
        //     title,
        //     `${message}<br/>${error}`,
        //     customStyles.colors.red
        // );
    }
}

export { ToastMessage }