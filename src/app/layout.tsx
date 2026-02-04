// Note: This file is used to define the layout of the application...!

"use client";

import
React,
{
  ReactNode,
  useState,
  useEffect
} from 'react';
import { Inter } from "next/font/google";
import { getCookie } from "cookies-next";

// Note: Redux Integration...!
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

// Note: Mantine UI Integration...!
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import MantinreUiProvider from "@/components/mantine-ui-provider/mantine-ui-provider";

// Note: Custom hook to monitor network status...!
import { useNetworkStatus } from "@/hooks/userNetworkStatus";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false
});


// import Lottie from 'lottie-react';
import InternetNotConnectedAnimation from "../assets/lottie/no-internet-connection.json";

// Note: Importing required components...!
import LoginScreen from './login/page';
import AppLayOut from '@/components/app-layout/app-layout';
import { customStyles } from '@/styles/custom-theme';
import '@/app/globals.css'; // Import global styles

// Note: Internet not connected component...!
const InternetNotConnected = () => {
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
      <Lottie
        animationData={InternetNotConnectedAnimation}
        loop={true}
        style={{
          width: 400,
          height: 400
        }}
      />
      <h1 style={{ color: customStyles.colors.black }}>Internet Not Connected</h1>
      <p style={{ color: customStyles.colors.black }}>Please check your internet connection and try again.</p>
    </div>
  );
};

// Note: Font family configuration for Next JS...!
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {

  // Note: Custom hook to monitor network status...!
  const isOnline = useNetworkStatus();

  // Note: handling states here...!
  const [cookieValue, setCookieValue] = useState("");

  // Note: THis hook will run only once when the component mounts...!
  useEffect(() => {
    const cookie = getCookie("UserAuthenticated");
    // console.log("Cookie value: ", cookie);
    if (cookie) setCookieValue(cookie as string);
    else setCookieValue("");
  }, []);

  // Note: If the user is not online, then we will show the internet not connected component...!
  if (!isOnline) {
    return (
      <InternetNotConnected />
    );
  };

  // Note: If the user is online, then we will show the main layout...!
  return (
    <html
      lang="en"
      {...mantineHtmlProps}
    >
      <head>
        <title> NeuConnectz </title>
        <ColorSchemeScript />
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
      </head>

      <body
        suppressHydrationWarning={true}
        className={inter.className}
      >
        <Provider store={store}>
          <PersistGate
            loading={null}
            persistor={persistor}
          >
            <MantinreUiProvider>
              {
                cookieValue === ""
                  ?
                  (<LoginScreen />)
                  :
                  (
                    <AppLayOut>
                      {children}
                    </AppLayOut>
                  )
              }
            </MantinreUiProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;