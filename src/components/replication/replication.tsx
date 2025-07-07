// Note: Replication component...!

"use client";

import React, { memo, useState } from 'react';
import { Card, Text, Progress, Grid, Group, Box, Stack, Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { getSAPData } from '@/redux/actions/sap-actions/sap-actions';
import { customStyles } from '@/styles/custom-theme';
import Loader from '../loader/loader';

const data = [
    { label: "Warehouse", value: 100, count: "60/60" },
    { label: "Group Code", value: 40, count: "37/60" },
    { label: "Stock Master", value: 0, count: "0/60" },
    { label: "Stock Barcode", value: 0, count: "0/60" },
    { label: "Stock Warehouse", value: 0, count: "0/60" },
    { label: "Bin Location", value: 0, count: "0/80" },
    { label: "Vendor Master", value: 0, count: "0/60" },
    { label: "Unit of Measure", value: 0, count: "0/60" },
];

const ReplicationComponent = () => {

    // Note: Handeling states here...!
    const [loading, setLoading] = useState(false);

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });

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

            <Box mb="lg">
                <Text size="sm" style={{ fontWeight: 500 }} mb={4}>
                    Overall Syncing Status
                </Text>
                <Progress value={20} radius="xl" />
                <Text size="xs" mt={4}>
                    20%
                </Text>
            </Box>

            <Grid gutter="sm">
                {
                    data.map((item, index) => (
                        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                            <Card withBorder radius="md" padding="md" shadow="xs">
                                <Stack gap={4}>
                                    <Group justify="space-between">
                                        <Text size="sm" style={{ fontWeight: 500 }}>
                                            {item.label}
                                        </Text>
                                        <Text size="sm" color="dimmed">
                                            {item.value}%
                                        </Text>
                                    </Group>
                                    <Progress value={item.value} radius="xl" />
                                    <Text size="xs" color="dimmed">
                                        {item.count}
                                    </Text>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </Card>
    );
};

export default memo(ReplicationComponent);