'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { getCookie } from "cookies-next";

// Note: Redux Integration...!
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

// Note: Mantine UI Integration...!
import MantinreUiProvider from "@/components/mantine-ui-provider/mantine-ui-provider";

// Note: Custom hook to monitor network status...!
import { useNetworkStatus } from "@/hooks/userNetworkStatus";

import nextDynamic from 'next/dynamic';
import { customStyles } from '@/styles/custom-theme';
import HtmlAppLayout from '@/components/app-layout/html-app-layout';

// Dynamically import Lottie to prevent SSR issues
const Lottie = nextDynamic(() => import('lottie-react'), { ssr: false });

// Dynamically import LoginScreen to prevent SSR issues
const LoginScreen = nextDynamic(() => import('../../app/login/page'), { ssr: false });

// Note: Internet not connected component...!
const InternetNotConnected = () => {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        // Dynamically import the animation data on client side only
        import("../../assets/lottie/no-internet-connection.json").then((data) => {
            setAnimationData(data.default);
        });
    }, []);

    return (
        <div
            style={{
                height: "100vh",
                width: "100%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            {animationData && (
                <Lottie
                    animationData={animationData}
                    loop={true}
                    style={{
                        width: 400,
                        height: 400
                    }}
                />
            )}
            <h1 style={{ color: customStyles.colors.black }}>Internet Not Connected</h1>
            <p style={{ color: customStyles.colors.black }}>Please check your internet connection and try again.</p>
        </div>
    );
};

interface ClientLayoutProps {
    children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
    // Note: Custom hook to monitor network status...!
    const isOnline = useNetworkStatus();

    // Note: handling states here...!
    const [cookieValue, setCookieValue] = useState("");
    const [mounted, setMounted] = useState(false);

    // Note: This hook will run only once when the component mounts...!
    useEffect(() => {
        setMounted(true);
        const cookie = getCookie("UserAuthenticated");
        if (cookie) setCookieValue(cookie as string);
        else setCookieValue("");
    }, []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div>Loading...</div>
            </div>
        );
    }

    // Note: If the user is not online, then we will show the internet not connected component...!
    if (!isOnline) {
        return <InternetNotConnected />;
    }

    // Note: If the user is online, then we will show the main layout...!
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                <MantinreUiProvider>
                    {cookieValue === "" ? (
                        <LoginScreen />
                    ) : (
                        <HtmlAppLayout>{children}</HtmlAppLayout>
                    )}
                </MantinreUiProvider>
            </PersistGate>
        </Provider>
    );
};

export default ClientLayout;
