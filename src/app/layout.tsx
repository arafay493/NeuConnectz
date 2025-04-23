// Note: This file is used to define the layout of the application...!

"use client";

import React, { useState, useEffect } from 'react';
import { getCookie } from "cookies-next";

// Note: Redux Integration...!
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

// Note: Mantine UI Integration...!
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import MantinreUiProvider from "@/components/mantine-ui-provider/mantine-ui-provider";

// Note: Importing required components...!
import AppLayOut from "./page";
import LoginScreen from './login/page';

const RootLayout = (
  { children }: Readonly<{ children: React.ReactNode; }>
) => {

  // Note: handling states here...!
  const [cookieValue, setCookieValue] = useState("");

  // Note: THis hook will run only once when the component mounts...!
  useEffect(() => {
    const cookie = getCookie("UserAuthenticated");
    console.log("Cookie value: ", cookie);
    if (cookie) setCookieValue(cookie as string);
    else setCookieValue("");
  }, []);

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>

      <body suppressHydrationWarning={true}>
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