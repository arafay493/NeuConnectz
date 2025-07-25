// Note: This file is used to define the layout of the application...!

import React, { ReactNode } from 'react';
import { Inter } from "next/font/google";

// Note: Mantine UI Integration...!
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import '@/app/globals.css'; // Import global styles

// Note: Client Layout Component
import ClientLayout from '@/components/client-layout/client-layout';

// Note: Font family configuration for Next JS...!
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout;