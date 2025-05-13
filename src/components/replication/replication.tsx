// Note: Replication component...!

"use client";

import React, { memo } from 'react';
import { Card, Text, Progress, Grid, Group, Box, Stack } from "@mantine/core";

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
    return (
        <Card withBorder radius="md" p="lg" shadow="sm">
            <Group justify="space-between" mb="md">
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
                {data.map((item, index) => (
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
                ))}
            </Grid>
        </Card>
    );
};

export default memo(ReplicationComponent);