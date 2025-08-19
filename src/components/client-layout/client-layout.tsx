'use client';

import HtmlAppLayout from '@/components/app-layout/html-app-layout';
import MantineUiProvider from "@/components/mantine-ui-provider/mantine-ui-provider";
import { useNetworkStatus } from "@/hooks/userNetworkStatus";
import { persistor, store } from "@/redux/store";
import { customStyles } from '@/styles/custom-theme';
import nextDynamic from 'next/dynamic';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

// Dynamically import Lottie to prevent SSR issues
const Lottie = nextDynamic(() => import('lottie-react'), { ssr: false });

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
    const isOnline = useNetworkStatus();

    if (!isOnline) {
        return <InternetNotConnected />;
    }

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <MantineUiProvider>
                    {children}
                </MantineUiProvider>
            </PersistGate>
        </Provider>
    );
};

export default ClientLayout;
