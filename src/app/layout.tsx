// Note: This file is used to define the layout of the application...!

import { Inter } from "next/font/google";
import { ReactNode } from 'react';

// Note: Mantine UI CSS imports (must come before global CSS)
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

// Note: Global styles (must come after Mantine CSS)
import '@/app/globals.css';

// Note: Mantine UI Integration...!
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';

// Note: Custom hook to monitor network status...!


// Note: Importing required components...!
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