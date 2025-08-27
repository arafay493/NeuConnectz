// NOte: BarChart component...!

"use client";

import React, { memo } from 'react';
import { Card, Box, Text } from '@mantine/core';
import { barChartData, barChartYAxisLabels } from '@/constants/chart-data';
import { useAppSelector } from '@/redux/store';

const BarChart = () => {

    // Note: Fetchinf data from redux...!
    const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => { return dashboardStates });
    
    return (
        <Card withBorder shadow="md" radius="lg" p="lg">
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    borderBottomWidth: 1,
                    borderBottom: '1px solid silver',
                }}
            >
                <Text size="lg" style={{ color: '#4D4D4D', fontWeight: 500 }}>
                    Top Transfer Items
                </Text>
            </Box>

            <Box style={{ display: 'flex', alignItems: 'flex-end' }} pt={'3%'}>
                {/* Y-axis Labels */}
                <Box
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: 250,
                        marginRight: 16,
                    }}
                >
                    {
                        barChartYAxisLabels.map((label, idx) => (
                            <Text key={idx} size="xs" c="dimmed">
                                {label}
                            </Text>
                        ))
                    }
                </Box>

                {/* Bar Chart */}
                <Box
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        height: 250,
                        width: '100%',
                    }}
                >
                    {
                        dashboardAnalyticsData?.topCreatedItems.map((data : any, idx) => {
                            const maxValue = 10;
                            const valueHeight = (data.count / maxValue) * 100;
                            return (
                                <Box key={idx} style={{ textAlign: 'center', width: '80%' }}>
                                    <Box
                                        style={{
                                            position: 'relative',
                                            height: 250,
                                            width: 30,
                                            margin: '0 auto',
                                        }}
                                    >
                                        {/* Max bar */}
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                height: '100%',
                                                width: '100%',
                                                backgroundColor: '#E0EDFF',
                                                borderRadius: 20,
                                            }}
                                        />
                                        {/* Value bar */}
                                        <Box
                                            style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                height: `${valueHeight}%`,
                                                width: '100%',
                                                backgroundColor: '#1B59F8',
                                                borderRadius: 20,
                                            }}
                                        />
                                    </Box>
                                    <Text size="xs" mt="xs" c="dimmed">
                                        {data?.itemCode}
                                    </Text>
                                </Box>
                            );
                        })
                    }
                </Box>
            </Box>
        </Card>
    );
};

export default memo(BarChart);