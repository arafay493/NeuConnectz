"use client";

// Note: This file is used to define the layout of the application...!

import React from 'react';

// Note: Redux Integration...!
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/redux/store";

const RootLayout = (
  { children }: Readonly<{ children: React.ReactNode; }>
) => {

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate
            loading={null}
            persistor={persistor}
          >
          {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;