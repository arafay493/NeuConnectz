// Note: DashboardCards component ...!

import React, { memo } from 'react';
import { Card, Text, Group, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { customStyles } from '@/styles/custom-theme';

const statsData = [
    { label: 'ITR Posted', value: 6260, color: 'red' },
    { label: 'ITR Unposted', value: 0, color: 'orange' },
    { label: 'IT Posted', value: 5420, color: 'green' },
    { label: 'IT Unposted', value: 167, color: 'violet' },
    { label: 'TR Posted', value: 26295, color: 'blue' },
    { label: 'TR Unposted', value: 0, color: 'blue' },
];

const DashboardCards = () => {
    return (
        <div>
            <Text fw={700} size="xl" mb="xs">
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
                            radius="md"
                            withBorder
                        >
                            <Group justify={customStyles.alignment.spaceBetween} mb="sm">
                                <ThemeIcon
                                    variant="light"
                                    color={stat.color}
                                    size="xl"
                                    radius="md"
                                >
                                    <IconChartBar size="1.5rem" />
                                </ThemeIcon>
                            </Group>

                            <Text size="sm" c="dimmed">
                                {stat.label}
                            </Text>

                            <Text fw={700} size="xl" c="dark">
                                {stat.value}
                            </Text>
                        </Card>
                    ))
                }
            </SimpleGrid>
        </div>
    );
};

export default memo(DashboardCards);