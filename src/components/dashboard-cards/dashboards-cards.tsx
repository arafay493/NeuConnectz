// Note: DashboardCards component ...!

"use client";

import React, { memo, useEffect } from 'react';
import { Card, Text, Group, SimpleGrid, ThemeIcon, Stack, Title } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { customStyles } from '@/styles/custom-theme';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { fetchDashboardAnalytics } from '@/redux/actions/dashboard-actions/dashboard-actions';

const statsData = [
    {
        label: 'ITR Posted',
        value: '6,260',
        color: '#FA5A7D',
        pendingOrIntegrated: "totalItrIntegrated"
    },
    {
        label: 'ITR Unposted',
        value: 0,
        color: '#FF947A',
        pendingOrIntegrated: "totalItrPending"
    },
    {
        label: 'IT Posted',
        value: '5,420',
        color: '#3CD755',
        pendingOrIntegrated: "totalItIntegrated"
    },
    {
        label: 'IT Unposted',
        value: 167,
        color: '#4E7CF4',
        pendingOrIntegrated: "totalItPending"
    },
    {
        label: 'TR Posted',
        value: '26,295',
        color: '#B97FF6',
        pendingOrIntegrated: "totalTrIntegrated"
    },
    {
        label: 'TR Unposted',
        value: 0,
        color: '#5BB0FF',
        pendingOrIntegrated: "totalTrPending"
    },
];

const DashboardCards = () => {

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => { return dashboardStates });
    // console.log("Dashboard Stats: ", dashboardAnalyticsData);

    // Note: Function to show stats values...!
    const getStatsValue = (penAndIntValue: string) => {
        // console.log("Pending and Integrated value: ", penAndIntValue);
        const { transferStatistics } = dashboardAnalyticsData || {};
        // const statsValue = transferStatistics ? transferStatistics[penAndIntValue] : 0;
        const statsValue = transferStatistics ? transferStatistics[penAndIntValue as keyof typeof transferStatistics] : 0;
        return statsValue;
    };

    // Note: Fetching dashboard analytics on component mount...!
    useEffect(() => {
        if (authenticatedUser) dispatch(fetchDashboardAnalytics(authenticatedUser.token));
    }, []);

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
                cols={{ base: 1, sm: 2, md: 3, lg: 5, xl: 6 }}
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
                            <Group justify={customStyles.alignment.spaceBetween} mb="sm">
                                <Text size="sm" style={{ color: customStyles.colors._4D4D4D }}>
                                    {stat.label}
                                </Text>
                            </Group>

                            <Group justify={customStyles.alignment.spaceBetween} align="flex-end">
                                <ThemeIcon
                                    variant="light"
                                    color={'white'}
                                    size="xl"
                                    style={{ borderRadius: 30, backgroundColor: stat.color }}
                                >
                                    <IconChartBar size="1.5rem" />
                                </ThemeIcon>

                                <Text fw={700} size="xl" c="dark">
                                    {getStatsValue(stat.pendingOrIntegrated)}
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