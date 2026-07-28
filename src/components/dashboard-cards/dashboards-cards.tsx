// Note: DashboardCards component ...!

"use client";

import React, { memo, useEffect } from 'react';
import { Card, Text, Group, SimpleGrid, ThemeIcon, Stack, Title } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { customStyles } from '@/styles/custom-theme';
import { useAppSelector, useAppDispatch } from '@/redux/store';

const statsData = [
    {
        label: 'Active Lines',
        color: '#FA5A7D',
        val: "5/6",
    },
    {
        label: 'Bottles Produced',
        color: '#FF947A',
        val: "125,480",
    },
    {
        label: 'Cartons Produced',
        color: '#3CD755',
        val: "20,913",
    },
    {
        label: 'Pallets Produced',
        color: '#4E7CF4',
        val: "120"
    },
    {
        label: 'Dispatched Today',
        color: '#B97FF6',
        val: "105"
    }
];

const DashboardCards = () => {

    // Note: Handeling redux here...!
    // const dispatch = useAppDispatch();
    // const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    // const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => { return dashboardStates });

    // // Note: Function to show stats values...!
    // const getStatsValue = (penAndIntValue: string) => {
    //     const mergeObj = { ...dashboardAnalyticsData?.transferStatistics, ...dashboardAnalyticsData?.grnStatistics };
    //     const statsObj = mergeObj || {};
    //     const statsValue = statsObj ? statsObj[penAndIntValue as keyof typeof statsObj] : 0;
    //     return statsValue;
    // };

    // // Note: Fetching dashboard analytics on component mount...!
    // useEffect(() => {
    //     if (authenticatedUser) dispatch(fetchDashboardAnalytics(authenticatedUser.token));
    // }, []);

    return (
        <div>
            <Stack gap={4}>
                <Title
                    order={3}
                    style={{
                        color: customStyles.colors._4D4D4D,
                        fontSize: "24px",
                        fontWeight: 700
                    }}
                >
                    Home
                </Title>

                <Text size="sm" c="dimmed" mb="xl" style={{ color: customStyles.colors._909090 }}>
                    Dashboard
                </Text>
            </Stack>

            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3, lg: 5, xl: 5 }}
                spacing="lg"
                verticalSpacing="lg"
            >
                {
                    statsData.map((stat) => (
                        <Card
                            key={stat.label}
                            shadow="sm"
                            padding="md"
                            radius={16}
                            withBorder
                        >
                            <Group style={{ display: "flex", flexDirection: 'column' }}>
                                <ThemeIcon
                                    variant="light"
                                    color={'white'}
                                    size="xl"
                                    style={{ borderRadius: 30, backgroundColor: stat.color }}
                                >
                                    <IconChartBar size="1.5rem" />
                                </ThemeIcon>

                                <Text size="sm" style={{ color: customStyles.colors._4D4D4D }}>
                                    {stat.label}
                                </Text>

                                <Text fw={700} size="xl" c="dark">
                                    {stat.val}
                                </Text>
                            </Group>
                        </Card>
                    ))
                }
            </SimpleGrid>
        </div>
    );
};

export default memo(DashboardCards);