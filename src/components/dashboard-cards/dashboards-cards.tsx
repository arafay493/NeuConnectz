// Note: DashboardCards component ...!

"use client";

import React, { memo } from 'react';
import { Card, Text, Group, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { customStyles } from '@/styles/custom-theme';
// import { useAppSelector } from '@/redux/store';

const statsData = [
    { label: 'ITR Posted', value: '6,260', color: '#FA5A7D' },
    { label: 'ITR Unposted', value: 0, color: '#FF947A' },
    { label: 'IT Posted', value: '5,420', color: '#3CD755' },
    { label: 'IT Unposted', value: 167, color: '#4E7CF4' },
    { label: 'TR Posted', value: '26,295', color: '#B97FF6' },
    { label: 'TR Unposted', value: 0, color: '#5BB0FF' },
];

const DashboardCards = () => {

    // const { listAll_ITR_IT_TRS, pendingAndIntegratedData } = useAppSelector(({ sapStates }) => { return sapStates });
    // console.log("listAll_ITR_IT_TRS: ", listAll_ITR_IT_TRS);
    // console.log("pendingAndIntegratedData: ", pendingAndIntegratedData);

    return (
        <div>
            <Text fw={700} size="xl" mb={2}>
                Home
            </Text>

            <Text c="dimmed" size="sm" mb="md">
                Dashboard
            </Text>

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
                                    style={{ borderRadius: 30 , backgroundColor: stat.color }}
                                >
                                    <IconChartBar size="1.5rem" />
                                </ThemeIcon>

                                <Text fw={700} size="xl" c="dark">
                                    {stat.value}
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