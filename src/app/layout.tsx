// Note: This file is used to define the layout of the application...!

"use client";

import React, { useState, useEffect } from 'react';
import { getCookie } from "cookies-next";
import { Inter } from "next/font/google";

// Note: Redux Integration...!
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

// Note: Mantine UI Integration...!
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import MantinreUiProvider from "@/components/mantine-ui-provider/mantine-ui-provider";

// Note: Importing required components...!
import LoginScreen from './login/page';
import AppLayOut from '@/components/app-layout/app-layout';

// Note: Font family integration for Next JS...!
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // This is optional, but helpful for custom usage
});

const RootLayout = (
  { children }: Readonly<{ children: React.ReactNode; }>
) => {

  // Note: handling states here...!
  const [cookieValue, setCookieValue] = useState("");

  // Note: THis hook will run only once when the component mounts...!
  useEffect(() => {
    const cookie = getCookie("UserAuthenticated");
    // console.log("Cookie value: ", cookie);
    if (cookie) setCookieValue(cookie as string);
    else setCookieValue("");
  }, []);

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
    >
      <head>
        <title> Z-Connect </title>
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