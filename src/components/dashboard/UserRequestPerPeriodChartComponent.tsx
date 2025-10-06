"use client";

import { useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// const data = [
//     {
//         period: "2025-09-29T00:00:00Z",
//         createdBy: "gCRpy5kovs",
//         userName: "harisbashir",
//         userRequests: 2
//     },
//     {
//         period: "2025-09-29T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "sagartesting",
//         userRequests: 1
//     },
//     {
//         period: "2025-09-30T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "sagartesting",
//         userRequests: 18
//     },
//     {
//         period: "2025-10-01T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "sagartesting",
//         userRequests: 43
//     },
//     {
//         period: "2025-10-01T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "ahmed",
//         userRequests: 13
//     },
//     {
//         period: "2025-10-01T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "sufiyan",
//         userRequests: 4
//     },
//     {
//         period: "2025-10-01T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "zain",
//         userRequests: 2
//     },
//     {
//         period: "2025-10-02T00:00:00Z",
//         createdBy: "uAaXF8NPEW",
//         userName: "sagartesting",
//         userRequests: 1
//     },
//     {
//         period: "2025-10-02T00:00:00Z",
//         createdBy: "xQ9q6cmmdj",
//         userName: "nabeela",
//         userRequests: 3
//     }
// ]

// const groupedData = data.reduce((acc: any, curr) => {
//     const found: any = acc.find((item: any) => item?.userName === curr.userName);
//     if (found) {
//         found.userRequests += curr.userRequests;
//     } else {
//         acc.push({ userName: curr.userName, userRequests: curr.userRequests });
//     }
//     return acc;
// }, []);

// const maxValue = Math.max(...groupedData.map((d: any) => d.userRequests));
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

const UserRequestPerPeriodChartComponent = () => {
    const { userITRCountList } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });
    const groupData = userITRCountList.reduce((acc: any, curr) => {
        const found: any = acc.find((item: any) => item?.userName === curr.userName);
        if (found) {
            found.itrCount += curr.itrCount;
        } else {
            acc.push({ userName: curr.userName, itrCount: curr.itrCount });
        }
        return acc;
    }, []);
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
            <Box w={"100%"} h={230}>
                <ResponsiveContainer width="100%" height="100%" >
                    <BarChart width={250} data={groupData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="userName" width={"auto"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} />
                        <YAxis
                            width={30}
                            dataKey="itrCount"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#4D4D4D" }}
                            interval={4}
                            // domain={[0, maxValue]}
                            allowDecimals={false}
                            tickCount={Math.max(...groupData.map((d: any) => d.itrCount)) + 5}
                            ticks={Array.from(
                                { length: Math.max(...groupData.map((d: any) => d.itrCount)) + 5 },
                                (_, i) => i
                            )}
                            tickMargin={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27, 89, 248, 0.05)" }} />
                        <Bar dataKey="itrCount" fill="#1B59F8" maxBarSize={20} radius={[5, 5, 5, 5]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </>
    )
}

export default UserRequestPerPeriodChartComponent
