// Note: MantinreUiProvider component...!

'use client';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

import { ReactNode, memo } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const MantinreUiProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MantineProvider defaultColorScheme="light">
            {/* Note: Required to render toast notifications */}
            <Notifications position="top-right" />
            {children}
        </MantineProvider>
    );
};

export default memo(MantinreUiProvider);
