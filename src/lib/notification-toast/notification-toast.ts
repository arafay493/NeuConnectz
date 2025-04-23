// Note: Notification toast function...!

import { notifications } from '@mantine/notifications';
import { customStyles } from '@/styles/custom-theme';

const showNotificationToast = (title: string, message: string, bgColor: string) => {
    notifications.show({
        title: title,
        message: message,
        color: customStyles.colors.white,
        autoClose: 3000,
        styles: (theme) => ({
            root: {
                backgroundColor: bgColor,
                border: '1px solid white',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
            },

            indicator: {
                backgroundColor: customStyles.colors.white,
            },

            title: {
                color: customStyles.colors.white,
                fontWeight: 700,
            },

            description: {
                color: customStyles.colors.white
            },

            closeButton: {
                color: customStyles.colors.white
            },
        }),
    });
};

export default showNotificationToast;