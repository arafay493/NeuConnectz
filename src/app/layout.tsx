"use client";

// Note: This file is used to define the layout of the application...!

import React from 'react';

// Note: Redux Integration...!
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

// Note: Mantine UI Integration...!
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import MantinreUiProvider from "@/components/mantine-ui-provider/mantine-ui-provider";

const RootLayout = (
  { children }: Readonly<{ children: React.ReactNode; }>
) => {

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
              {children}
            </MantinreUiProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;