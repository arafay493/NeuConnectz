'use client';

import { topTransferItemsData } from '@/constants/dashboard-chart-data';
import { customStyles } from '@/styles/custom-theme';
import { Box, Group, Paper, Select, Text } from '@mantine/core';
import { IconChevronDown, IconDownload } from '@tabler/icons-react';
import { memo } from 'react';
import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// Sample data for the stacked bar chart - you can replace this with the imported data
const data = topTransferItemsData;

const TopTransferItemsChart = () => {
    return (
        <Paper flex={1} radius={16} p={24}>
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Text size="lg" fw={500} c={customStyles.colors._4D4D4D}>
                    Top Transfer Items
                </Text>
                <Group gap="sm">
                    <Select
                        w={130}
                        data={['This Week', 'This Month', 'This Quarter']}
                        defaultValue="This Week"
                        size="md"
                        rightSection={<IconChevronDown size={16} />}
                        styles={{
                            input: {
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                                color: customStyles.colors._909090,
                            }
                        }}
                    />
                    <Select
                        w={130}
                        data={['Download', 'Export', 'Share']}
                        defaultValue="Download"
                        size="md"
                        rightSection={<IconDownload size={16} />}
                        styles={{
                            input: {
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                                color: customStyles.colors._909090,
                            }
                        }}
                    />
                </Group>
            </Group>

            {/* Chart */}
            <Box h={320} style={{ position: 'relative' }} pt="md">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        barCategoryGap="30%"
                        margin={{ top: 20, right: 150, left: 20, bottom: 20 }}
                    >
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: customStyles.colors._909090 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: customStyles.colors._909090 }}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value}%`, '']}
                            labelStyle={{ color: customStyles.colors._4D4D4D }}
                            contentStyle={{
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)'
                            }}
                            cursor={{ fill: 'rgba(27, 89, 248, 0.05)' }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            layout="vertical"
                            wrapperStyle={{
                                paddingLeft: '20px',
                                fontSize: '16px',
                                lineHeight: '48px',
                                marginTop: '20px',
                                paddingRight: '10px'
                            }}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Bar
                            dataKey="ProductA"
                            stackId="a"
                            fill="#1B59F8"
                            name="Product A"
                            radius={[0, 0, 0, 0]}
                            maxBarSize={60}
                        />
                        <Bar
                            dataKey="ProductB"
                            stackId="a"
                            fill="#A8C5F7"
                            name="Product B"
                            radius={[0, 0, 0, 0]}
                            maxBarSize={60}
                        />
                        <Bar
                            dataKey="ProductC"
                            stackId="a"
                            fill="#3D5AF11A"
                            name="Product C"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default memo(TopTransferItemsChart);
