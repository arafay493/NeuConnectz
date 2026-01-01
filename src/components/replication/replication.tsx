// Note: Replication component...!

"use client";

import React, { memo, useState, useEffect } from 'react';
import { Card, Text, Progress, Grid, Group, Box, Stack, Button, ThemeIcon, SimpleGrid, Title } from "@mantine/core";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { getSAPData, handleGetSapStagingDataCounts } from '@/redux/actions/sap-actions/sap-actions';
import { customStyles } from '@/styles/custom-theme';
import { IconChartBar, IconRefresh, IconBuildingWarehouse, IconFileCode, IconPackage, IconFileBarcode, IconLibrary, IconUserCircle, IconStack2 } from '@tabler/icons-react';
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

// Note: Icon mapping for each data type
const iconMapping = {
    "Warehouse": IconBuildingWarehouse,
    "Group Code": IconFileCode,
    "Stock Master": IconPackage,
    "Stock Barcode": IconFileBarcode,
    "Stock Warehouse": IconStack2,
    "Bin Location": IconLibrary,
    "Vendor Master": IconUserCircle
};

const ReplicationComponent = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Note: Handeling states here...!
    const [replicationStats, setReplicationStats] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { sapStagingDataCounts } = useAppSelector(({ sapStates }) => { return sapStates });

    // Note: Get SAP data api response handler...!
    const handleResponse = (response: any): void => {

        if (response && response.statusCode == 200) {
            showNotificationToast("Great", "Data fetched successfully", customStyles.colors._408CCE);

            handleSyncAll()
            return;
        }
    };

    // Note: Handle Sync All button click...!
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
            const statsArray: any = Object.entries(sapStagingDataCounts).filter(([key]) => key !== "vendorMasterTotal").map(([key, value], index) => ({
                label: key,
                value,
                displayLabel: data[index],
                icon: iconMapping[data[index] as keyof typeof iconMapping] || IconChartBar
            }))
            statsArray && setReplicationStats(statsArray);
        };
    }, [sapStagingDataCounts]);

    return (
        <Card h={600} radius={16} p={24}>
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

            <Group
                mb={24}
                style={{
                    border: `1px solid ${customStyles.colors._E1E7EC}`,
                    borderRadius: 16,
                    padding: '16px'
                }}
            >
                <Stack flex={1} gap={0}>
                    <Group justify='space-between' align='flex-start' mb={24}>
                        <Text size="md" c={customStyles.colors._4D4D4D} fw={600}>
                            Overall Syncing Status ({currentStep}/5 completed)
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
                    className={'outlineButton'}
                    size="md"
                    leftSection={<IconRefresh size={22} />}
                    onClick={handleSyncAll}
                    disabled={currentStep >= 5}
                >
                    Sync All
                </Button>
            </Group>

            {/* <Grid gutter="sm"> */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {replicationStats.map((stat: any, index: number) => {
                    const IconComponent = stat.icon;
                    return (
                        <Card
                            key={stat.label}
                            bg={customStyles.colors.white}
                            padding={16}
                            radius={16}
                            style={{
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                            }}
                        >
                            <Group justify="space-between" gap={0} wrap='nowrap' align="flex-end">
                                <div>
                                    <Text
                                        size='md'
                                        c={customStyles.colors._4D4D4D}
                                        fw={600}
                                        mb={20}
                                        style={{
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {stat.displayLabel || data[index]}
                                    </Text>

                                    <ThemeIcon size={40} radius="xl" color={customStyles.colors._1B59F8}>
                                        <IconComponent size={24} />
                                    </ThemeIcon>
                                </div>

                                <Text size="xl" fw={700}>
                                    {stat.value}
                                </Text>
                            </Group>
                        </Card>
                    );
                })}
            </SimpleGrid>
        </Card>
    );
};

export default memo(ReplicationComponent);