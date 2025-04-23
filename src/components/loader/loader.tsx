// Note: Loader component...!

"use client";

import React, { FC, memo } from 'react';
import { Text, LoadingOverlay, Center, Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import styles from './loader.module.css';

type LoaderProps = {
    loadingState: boolean;
};

const Loader: FC<LoaderProps> = ({ loadingState }) => {
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