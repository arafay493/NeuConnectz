// Note: Custom hoook to monitor network status in a React and Next JS application...!

"use client";

import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(true);

    // Note: This hook will check the online and offline status of the internet...!
    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Initial check
        updateOnlineStatus();

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, [isOnline]);

    return isOnline;
};