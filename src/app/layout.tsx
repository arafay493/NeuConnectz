import { Inter } from "next/font/google";
import { ReactNode } from 'react';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@/app/globals.css';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import '@/app/globals.css'; 
import ClientLayout from '@/components/client-layout/client-layout';

// Font family configuration for Next JS
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