"use client";

import React, { FC, useEffect, memo } from 'react';
import { Center, Stack, Text } from '@mantine/core';
import styles from './loader.module.css';
import { customStyles } from '@/styles/custom-theme';

type LoaderProps = {
    loadingState: boolean;
};

const Loader: FC<LoaderProps> = ({ loadingState }) => {

    // Note: This effect is used to manage the body's overflow style based on the loading state.
    useEffect(() => {
        if (loadingState) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [loadingState]);

    if (!loadingState) return null;

    return (
        <div className={styles.fullscreenOverlay}>
            <Center style={{ height: '100%' }}>
                <Stack align="center" gap="xs">
                    <div className={styles.loader}></div>
                    <Text fw={500} size="lg" style={{ color: customStyles.colors._408CCE }}>
                        Please wait...
                    </Text>
                </Stack>
            </Center>
        </div>
    );
};

export default memo(Loader);