"use client";

import { useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


const UserRequestChartComponent = () => {
    const { userITRCountList } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

    const formattedData = userITRCountList
        // .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
        .map((item, index) => ({
            ...item,
            uniqueKey: `${index}`,
        }));

    const CustomTooltip = ({ active, payload, coordinate }: any) => {
        const value = payload[0]?.value;
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        position: "absolute",
                        left: coordinate.x,
                        top: coordinate.y - 40, // move tooltip above bar
                        // top: 0, // move tooltip above bar
                        transform: "translateX(-50%)", // center align with bar
                        background: "#D9D9D9",
                        borderRadius: 8,
                        padding: "6px 10px",
                        // boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        color: customStyles.colors._1B59F8,
                        pointerEvents: "none",
                        fontSize: 12,
                        fontWeight: 500,
                        width: 50,
                        textAlign: "center"
                    }}
                >
                    {value}
                    <div
                        style={{
                            position: "absolute",
                            bottom: -3,
                            left: "50%",
                            transform: "translateX(-50%) rotate(45deg)",
                            width: 6,
                            height: 6,
                            background: "#D9D9D9",
                            boxShadow: "-2px 2px 5px rgba(0,0,0,0.05)",

                        }}
                    />
                </div>
            );
        }
        return null;
    };

    // const groupData = userITRCountList.reduce((acc: any, curr) => {
    //     const found: any = acc.find((item: any) => item?.userName === curr.userName);
    //     if (found) {
    //         found.itrCount += curr.itrCount;
    //     } else {
    //         acc.push({ userName: curr.userName, itrCount: curr.itrCount });
    //     }
    //     return acc;
    // }, []);
    return (
        <>
            <Group
                justify="space-between"
                mb="md"
                wrap="wrap"
            // gap="sm"
            // style = {{border: "2px solid black"}}
            >
                <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
                    User Requests
                </Text>
                <Group gap="sm">
                    <Select
                        w={{ base: "100%", sm: 130 }}
                        data={["This Week", "This Month", "This Quarter"]}
                        defaultValue="This Week"
                        size="sm"
                        rightSection={<IconChevronDown size={16} />}
                        styles={{
                            input: {
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                                color: customStyles.colors._909090,
                                fontSize: 14
                            },
                        }}
                    />
                </Group>
            </Group>
            {!formattedData?.length ? <Box w="100%" h={350} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" c="dimmed">No data available</Text>
            </Box> : <Box w={"100%"} h={350}>
                <ResponsiveContainer width="100%" height="100%" >
                    <BarChart width={250} data={formattedData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="userName" width={"auto"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#909090" }} />
                        <YAxis
                            width={30}
                            dataKey="uniqueKey"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#909090" }}
                            interval={4}
                            // domain={[0, maxValue]}
                            allowDecimals={false}
                            tickCount={Math.max(...formattedData.map((d: any) => d.itrCount)) + 5}
                            ticks={Array.from(
                                { length: Math.max(...formattedData.map((d: any) => d.itrCount)) + 5 },
                                (_, i) => i
                            )}
                            tickMargin={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27, 89, 248, 0.05)" }} />
                        <Bar dataKey="itrCount" fill="#1B59F8" maxBarSize={20} radius={[5, 5, 5, 5]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            }

        </>
    )
}

export default React.memo(UserRequestChartComponent)
