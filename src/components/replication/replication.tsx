// Note: Replication component...!

"use client";

import React, { memo, useState, useEffect } from 'react';
import { Card, Text, Progress, Grid, Group, Box, Stack, Button, ThemeIcon, SimpleGrid } from "@mantine/core";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { getSAPData, handleGetSapStagingDataCounts } from '@/redux/actions/sap-actions/sap-actions';
import { customStyles } from '@/styles/custom-theme';
import Loader from '../loader/loader';
import { IconChartBar } from '@tabler/icons-react';

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

    // Note: Handeling states here...!
    const [loading, setLoading] = useState(false);
    const [replicationStats, setReplicationStats] = useState([]);

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
            //     // Note: Stop loading...!
            setLoading(false);
            showNotificationToast("Great", "Data fetched successfully", customStyles.colors._408CCE);
            return;
        }
    };

    // Note: Get SAP data handler...!
    const getSAPDataHandler = (params: string | undefined) => {
        // console.log("Params: ", params);

        // Enablde loader...!
        setLoading(true);

        params && dispatch(getSAPData({
            token: authenticatedUser?.token || "",
            apiUrl: params,
            resHandler: handleResponse
        }));
    };

    // Note: This hook will run when component mounts...!
    useEffect(() => {
        if (authenticatedUser) {
            dispatch(handleGetSapStagingDataCounts(authenticatedUser?.token));
        };
    }, []);

    // Note: This hook will run when sapStagingDataCounts state update...!
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
        <Card withBorder radius="md" p="lg" shadow="sm">

            {/* Note: Loader component */}
            {loading && <Loader loadingState={loading} />}

            <Group grow gap="md" wrap="wrap">
                <Button
                    color={customStyles.colors._1B59F8}
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_ITEMS_MASTER_DATA)}
                >
                    Fetch Items
                </Button>
                <Button
                    color={customStyles.colors._1B59F8}
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_VENDOR_MASTER_DATA)}
                >
                    Fetch Vendors
                </Button>
                <Button
                    color={customStyles.colors._1B59F8}
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_ITEM_BARCODES_MASTER_DATA)}
                >
                    Fetch Barcodes
                </Button>
                <Button
                    color={customStyles.colors._1B59F8}
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_WAREHOUSES_MASTER_DATA)}
                >
                    Fetch Warehouses
                </Button>
                <Button
                    color={customStyles.colors._1B59F8}
                    onClick={() => getSAPDataHandler(process.env.NEXT_PUBLIC_FETCH_ITEM_GROUP_MASTER_DATA)}
                >
                    Fetch Item Groups
                </Button>
            </Group>

            <Group justify="space-between" mb="md" mt="md">
                <div>
                    <Text size="lg" style={{ fontWeight: 600 }}>
                        Replication
                    </Text>
                    <Text size="sm" color="dimmed">
                        Progress of inventory sync with SAP.
                    </Text>
                </div>

                <Text size="xs" color="dimmed">
                    Last sync at 1 hr 20 min ago
                </Text>
            </Group>

            <Box mb="lg" style={{
                border: "1px solid lightgray",
                borderRadius: 10,
                padding: '15px'
            }}>
                <Text size="sm" style={{ fontWeight: 500 }} mb={4}>
                    Overall Syncing Status
                </Text>
                <Progress value={20} radius="xl" />
                <Text size="xs" mt={4}>
                    20%
                </Text>
            </Box>

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