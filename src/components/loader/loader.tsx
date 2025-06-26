// Note: Loader component...!

"use client";

import React, { FC, useEffect, memo } from 'react';
import { Text, LoadingOverlay, Center, Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import styles from './loader.module.css';

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


    return (
        <LoadingOverlay
            visible={loadingState}
            loaderProps={{
                children: (
                    <Center>
                        <Stack align={customStyles.alignment.center} gap="xs">
                            <div className={styles.loader}></div>
                            <Text
                                fw={500}
                                size="lg"
                                style={{ color: customStyles.colors._408CCE }}
                            >
                                Please wait...
                            </Text>
                        </Stack>
                    </Center>
                ),
            }}
        />
    );
};

export default memo(Loader);