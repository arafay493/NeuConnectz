// Note: Replication component...!

"use client";

import React, { memo, useState, useEffect } from 'react';
import { Card, Text, Progress, Grid, Group, Box, Stack, Button, ThemeIcon, SimpleGrid, Title } from "@mantine/core";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { getSAPData, handleGetSapStagingDataCounts } from '@/redux/actions/sap-actions/sap-actions';
import { customStyles } from '@/styles/custom-theme';
import { IconChartBar, IconChevronRight, IconCheck, IconRefresh } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

// const data = [
//     { label: "Warehouse", dynamicLabel: "warehouseTotal" },
//     { label: "Group Code", dynamicLabel: "groupCodeTotal" },
//     { label: "Stock Master", dynamicLabel: "stockMasterTotal" },
//     { label: "Stock Barcode", dynamicLabel: "stockBarcodeTotal" },
//     { label: "Stock Warehouse", dynamicLabel: "stockWarehouseTotal" },
//     { label: "Bin Location", dynamicLabel: "binLocationTotal" },
//     { label: "Vendor Master", dynamicLabel: "vendorMasterTotal" },
// ];

const data = ["Warehouse", "Group Code", "Stock Master", "Stock Barcode", "Stock Warehouse", "Bin Location", "Vendor Master"];

const ReplicationComponent = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Note: Handeling states here...!
    const [replicationStats, setReplicationStats] = useState([]);
    const [currentStep, setCurrentStep] = useState(0); // Track which button should be enabled

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { sapStagingDataCounts } = useAppSelector(({ sapStates }) => { return sapStates });
    // console.log("Sap Staging Data Counts in component: ", sapStagingDataCounts);

    // Note: Get SAP data api response handler...!
    const handleResponse = (response: any): void => {
        // console.log("Get SAP data api response: ", response);

        if (response && response.statusCode == 200) {
            showNotificationToast("Great", "Data fetched successfully", customStyles.colors._408CCE);

            handleSyncAll()
            return;
        }
    };

    // Note: Get SAP data handler...!
    const getSAPDataHandler = (params: string | undefined, stepIndex: number) => {
        // Only proceed if this is the current step
        if (stepIndex !== currentStep) {
            return;
        }

        params && dispatch(getSAPData({
            token: authenticatedUser?.token || "",
            apiUrl: params,
            resHandler: handleResponse
        }));
    };

    // Note: Sync all data sequentially
    // const handleSyncAll = () => {
    //     const API_URLS = [
    //         process.env.NEXT_PUBLIC_FETCH_WAREHOUSES_MASTER_DATA,
    //         process.env.NEXT_PUBLIC_FETCH_ITEM_GROUP_MASTER_DATA,
    //         process.env.NEXT_PUBLIC_FETCH_ITEMS_MASTER_DATA,
    //         process.env.NEXT_PUBLIC_FETCH_ITEM_BARCODES_MASTER_DATA,
    //         process.env.NEXT_PUBLIC_FETCH_VENDOR_MASTER_DATA
    //     ];

    //     if (currentStep >= API_URLS.length) {
    //         showNotificationToast("Info", "All data has been synced", customStyles.colors._408CCE);
    //         return;
    //     }

    //     const currentApiUrl = API_URLS[currentStep];
    //     // console.log("current step: ", currentStep);

    //     if (currentApiUrl && currentStep < 5) {
    //         dispatch(getSAPData({
    //             token: authenticatedUser?.token || "",
    //             apiUrl: currentApiUrl,
    //             resHandler: handleResponse
    //         }));
    //     }

    //     console.log("current step after increment: ", currentStep);
    //     setCurrentStep(prevStep => prevStep + 1);
    //     console.log("current step after increment: ", currentStep);
    // };
    const handleSyncAll = () => {
        const API_URLS = [
            process.env.NEXT_PUBLIC_FETCH_WAREHOUSES_MASTER_DATA,
            process.env.NEXT_PUBLIC_FETCH_ITEM_GROUP_MASTER_DATA,
            process.env.NEXT_PUBLIC_FETCH_ITEMS_MASTER_DATA,
            process.env.NEXT_PUBLIC_FETCH_ITEM_BARCODES_MASTER_DATA,
            process.env.NEXT_PUBLIC_FETCH_VENDOR_MASTER_DATA
        ];

        setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;

            if (prevStep >= API_URLS.length) {
                showNotificationToast("Info", "All data has been synced", customStyles.colors._408CCE);
                return prevStep;
            }

            const currentApiUrl = API_URLS[prevStep];

            if (currentApiUrl) {
                dispatch(getSAPData({
                    token: authenticatedUser?.token || "",
                    apiUrl: currentApiUrl,
                    resHandler: handleResponse
                }));
            }

            return nextStep;
        });
    };

    // Note: This hook will run when component mounts...!
    useEffect(() => {
        if (authenticatedUser) {
            dispatch(handleGetSapStagingDataCounts(authenticatedUser?.token));
        };
    }, []);

    // Note: Calculate progress percentage
    const progressPercentage = (currentStep / 5) * 100;
    useEffect(() => {
        if (sapStagingDataCounts) {
            const statsArray: any = Object.entries(sapStagingDataCounts).map(([key, value]) => ({
                label: key,
                value,
            }));
            console.log('Replication stats: ', statsArray);
            statsArray && setReplicationStats(statsArray);
        };
    }, [sapStagingDataCounts]);

    return (
        <Card radius={16} p={24}>

            {/* <Group grow gap="md" wrap="wrap">
                <Button
                    {...getButtonProps(0)}
                    size='md'
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_WAREHOUSES_MASTER_DATA, 0)}
                >
                    Fetch Warehouses
                </Button>
                <Button
                    {...getButtonProps(1)}
                    size='md'
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_ITEM_GROUP_MASTER_DATA, 1)}
                >
                    Fetch Item Groups
                </Button>
                <Button
                    {...getButtonProps(2)}
                    size='md'
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_ITEMS_MASTER_DATA, 2)}
                >
                    Fetch Items
                </Button>
                <Button
                    {...getButtonProps(3)}
                    size='md'
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_ITEM_BARCODES_MASTER_DATA, 3)}
                >
                    Fetch Barcode
                </Button>
                <Button
                    {...getButtonProps(4)}
                    size='md'
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_VENDOR_MASTER_DATA, 4)}
                >
                    Fetch Vendors
                </Button>
            </Group> */}

            <Group justify="space-between" align='flex-start' mb={24}>
                <div>
                    <Title order={3} size="lg" mb={6} c={customStyles.colors._4D4D4D}>
                        Replication
                    </Title>
                    <Text size="sm" c={customStyles.colors._909090}>
                        Progress of inventory sync with SAP.
                    </Text>
                </div>

                <Text size="sm" c={customStyles.colors._909090}>
                    Last sync at 1 hr 20 min ago
                </Text>
            </Group>

            <Group mb="lg"
                style={{
                    border: `1px solid ${customStyles.colors._E1E7EC}`,
                    borderRadius: 16,
                    padding: '16px'
                }}
            >
                <Stack flex={1} gap={0}>
                    <Group justify='space-between' align='flex-start' mb={24}>
                        <Text size="md" c={customStyles.colors._4D4D4D} fw={600}>
                            Overall Syncing Status ({currentStep}/5 steps completed)
                        </Text>
                        <Text size="md" c={customStyles.colors._4D4D4D} fw={600}>
                            {Math.round(progressPercentage)}%
                        </Text>
                    </Group>
                    <Progress animated color={customStyles.colors._1B59F8} value={progressPercentage} radius="xl" />
                </Stack>
                <Button
                    radius={8}
                    w={isMobile ? '100%' : 200}
                    variant="transparent"
                    className={currentStep === 5 ? 'completedButton' : 'outlineButton'}
                    size="md"
                    leftSection={currentStep === 5 ? <IconCheck size={22} /> : <IconRefresh size={22} />}
                    onClick={handleSyncAll}
                    disabled={currentStep >= 5}
                >
                    {currentStep >= 5 ? 'Sync Complete' : 'Sync All'}
                </Button>
            </Group>

            {/* <Grid gutter="sm"> */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {replicationStats.map((stat: any, index: number) => (
                    <Card
                        key={stat.label}
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                    >
                        <Group justify="space-between" align="flex-end">
                            <div>
                                <Text
                                    c="dimmed"
                                    style={{
                                        fontWeight: 500,
                                        fontSize: '16px',
                                        color: customStyles.colors._4D4D4D,
                                        height: '24px',
                                        lineHeight: '24px',
                                        textTransform: "capitalize"
                                    }}
                                    mb={'10px'}
                                >
                                    {data[index]}
                                </Text>

                                <ThemeIcon size={40} radius="xl" color="blue">
                                    <IconChartBar size={24} />
                                </ThemeIcon>
                            </div>

                            <Text size="xl" fw={700}>
                                {stat.value}
                            </Text>
                        </Group>
                    </Card>
                ))}

            </SimpleGrid>
            {/* </Grid> */}
        </Card>
    );
};

export default memo(ReplicationComponent);