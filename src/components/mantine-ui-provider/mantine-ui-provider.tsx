// Note: MantineUiProvider component...!

'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ReactNode, memo } from 'react';

const MantineUiProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MantineProvider defaultColorScheme="light">
            {/* Note: Required to render toast notifications */}
            <Notifications position="top-right" />
            {children}
        </MantineProvider>
    );
};

export default memo(MantineUiProvider);
