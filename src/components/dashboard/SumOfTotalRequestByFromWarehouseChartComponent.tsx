"use client";

import { useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Customized, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'




const SumOfTotalRequestByFromWarehouseChartComponent = () => {
    const { ITRRequestsFromWarehouse } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

    // const data = [
    //     {
    //         period: "2025-09-29T00:00:00Z",
    //         fromWarehouseCode: "W-KHI-KG",
    //         warehouseName: "Main Warehouse - Korangi",
    //         totalRequests: 1
    //     },
    //     {
    //         period: "2025-09-29T00:00:00Z",
    //         fromWarehouseCode: "W-GW-SM",
    //         warehouseName: "General Warehouse SM",
    //         totalRequests: 5
    //     },
    //     {
    //         period: "2025-09-29T00:00:00Z",
    //         fromWarehouseCode: "W-KHI-KG",
    //         warehouseName: "Main Warehouse - Korangi",
    //         totalRequests: 4
    //     },
    //     {
    //         period: "2025-09-30T00:00:00Z",
    //         fromWarehouseCode: "W-KHI-KG",
    //         warehouseName: "Main Warehouse - Korangi",
    //         totalRequests: 5
    //     },
    //     {
    //         period: "2025-10-01T00:00:00Z",
    //         fromWarehouseCode: "W-GW-SM",
    //         warehouseName: "General Warehouse SM",
    //         totalRequests: 1
    //     },
    //     {
    //         period: "2025-10-01T00:00:00Z",
    //         fromWarehouseCode: "W-KHI-KG",
    //         warehouseName: "Main Warehouse - Korangi",
    //         totalRequests: 7
    //     },
    //     {
    //         period: "2025-10-02T00:00:00Z",
    //         fromWarehouseCode: "W-KHI-KG",
    //         warehouseName: "Main Warehouse - Korangi",
    //         totalRequests: 1
    //     },
    //     {
    //         period: "2025-10-03T00:00:00Z",
    //         fromWarehouseCode: "W-FG-SM",
    //         warehouseName: "Finished Good Warehouse SM",
    //         totalRequests: 7
    //     },
    //     {
    //         period: "2025-10-03T00:00:00Z",
    //         fromWarehouseCode: "W-KHI-KG",
    //         warehouseName: "Main Warehouse - Korangi",
    //         totalRequests: 5
    //     },
    //     {
    //         period: "2025-10-03T00:00:00Z",
    //         fromWarehouseCode: "W-PL-SM",
    //         warehouseName: "Plates Warehouse SM",
    //         totalRequests: 1
    //     },
    //     {
    //         period: "2025-10-03T00:00:00Z",
    //         fromWarehouseCode: "W-RM-KG",
    //         warehouseName: "Raw Material Warehouse KG",
    //         totalRequests: 8
    //     },
    //     {
    //         period: "2025-10-03T00:00:00Z",
    //         fromWarehouseCode: "W-SKR-01",
    //         warehouseName: "Main Warehouse - Sukkur",
    //         totalRequests: 1
    //     },
    //     {
    //         period: "2025-10-04T00:00:00Z",
    //         fromWarehouseCode: "W-FG-SM",
    //         warehouseName: "Finished Good Warehouse SM",
    //         totalRequests: 1
    //     },
    //     {
    //         period: "2025-10-04T00:00:00Z",
    //         fromWarehouseCode: "W-RM-KG",
    //         warehouseName: "Raw Material Warehouse KG",
    //         totalRequests: 3
    //     }
    // ];

    const formattedData = ITRRequestsFromWarehouse
        // .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
        .map((item, index) => ({
            ...item,
            uniqueKey: `${index}`, // ensure uniqueness
        }));

    // const chartData = data.map((item) => ({
    //     warehouseCode: item.fromWarehouseCode,
    //     // period: item.period.split("T")[0],
    //     period: item.period,
    //     totalRequests: item.totalRequests,
    // }));

    // const groupData = data.reduce((acc: any, curr: any) => {
    //     if (!acc[curr.period]) {
    //         acc[curr.period] = [];
    //     }
    //     acc[curr.period].push({
    //         fromWarehouseCode: curr.fromWarehouseCode,
    //         warehouseName: curr.warehouseName,
    //         totalRequests: curr.totalRequests,
    //     });
    //     return acc;
    // }, {});

    // const groupDataArr = Object.entries(groupData)


    // const maxValue = Math.max(...groupData.map((d: any) => d.userRequests));
    const CustomTooltip = ({ active, payload, coordinate }: any) => {
        // const currentPayload = formattedData.find(p => p.uniqueKey === payload[0]?.payload.uniqueKey);
        // const value = currentPayload?.totalRequests;
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

    const CustomAxisTick = ({ x, y, payload, index, data }: any) => {
        const item = formattedData.find(d => d.uniqueKey === payload.value);
        if (!item) return null;

        return (
            <g transform={`translate(${x - 7},${50})`}>
                <text
                    x={0}
                    y={0}
                    dy={10}
                    textAnchor="middle"
                    fill="#909090"
                    fontSize={10}
                    fontWeight={500}
                    transform="rotate(-90)"
                    style={{ marginRight: 20 }}
                >
                    {item.fromWarehouseCode}
                </text>
                {/* <text
                x={0}
                y={12}
                dy={10}
                textAnchor="middle"
                fill="#999"
                fontSize={9}
                width={50}
                style={{ textWrap: "wrap" }}
            >
                {new Date(item.period).toLocaleDateString()}
            </text> */}
                {/* Divider line between date groups */}
                {/* {showDivider && (
                <line
                    x1={25}
                    y1={0}
                    x2={25}
                    y2={30}
                    stroke="#909090"
                    strokeWidth={1}
                />
            )} */}
            </g>
        );
    };

    const CustomAxisTick2 = ({ x, y, payload, index, data }: any) => {
        // Step 1: Unique periods
        const mappedData = [...new Set(data.map((item: any) => item.period))];

        // Step 2: Find all last indexes for those periods
        const actualData = mappedData.map((period: any) => {
            return data.findLastIndex((d: any) => d.period === period);
        });

        // Step 3: Get the current tick item
        const item = data[index];
        if (!item) return null;

        // Step 4: Check if this tick should show divider or label
        const isLastTick = index === data.length - 1;
        const showDivider = actualData.includes(index) || isLastTick;
        const showDate = actualData.includes(index) || isLastTick;

        return (
            <g transform={`translate(${x - 7},${y - 20})`}>
                {showDate && (
                    <text
                        x={-10}
                        y={0}
                        dy={10}
                        textAnchor="middle"
                        fill="#909090"
                        fontSize={10}
                        fontWeight={500}
                        transform="rotate(-45)"
                        style={{ marginRight: 20, color: "#909090" }}
                    >
                        {new Date(item.period).toLocaleDateString()}
                    </text>
                )}
                {/* <text
                    x={-10}
                    y={0}
                    dy={10}
                    textAnchor="middle"
                    fill="#909090"
                    fontSize={10}
                    fontWeight={500}
                    transform="rotate(-45)"
                    style={{ marginRight: 20, color: "#909090" }}
                >
                    {new Date(item.period).toLocaleDateString()}
                </text> */}
                {showDivider && (
                    <line
                        x1={25}
                        y1={-15}
                        x2={25}
                        y2={30}
                        stroke="#E1E7EC"
                        strokeWidth={1}
                    />
                )}
            </g>
        );
    };

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
                    Sum of Total Requests by from Warehouse
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
            <Box w={"100%"} h={430}>
                <ResponsiveContainer width="100%" height="100%" >
                    <BarChart width={250} data={formattedData} dataKey={(entry) => entry.uniqueKey} margin={{ top: 0, right: 0, left: 0, bottom: 40 }}>
                        {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
                        {/* <XAxis allowDataOverflow dataKey="uniqueKey" width={"auto"} tickFormatter={(key) => {
                            const item = formattedData.find(d => d.uniqueKey === key);
                            return item?.fromWarehouseCode || ''; // display only warehouse code
                        }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
                        {/* <XAxis dataKey="period" width={"auto"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
                        {/* <XAxis dataKey="uniqueKey" width={"auto"} tickFormatter={(key) => {
                            const item = formattedData.find(d => d.uniqueKey === key);
                            return item?.period || ''; // display only warehouse code
                        }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
                        <XAxis
                            dataKey="uniqueKey"
                            axisLine={false}
                            tickLine={false}
                            tick={<CustomAxisTick data={formattedData} />}
                            xAxisId="A"
                        />
                        {/* Bottom axis: centered period labels */}
                        {/* <XAxis
                            dataKey="period"
                            axisLine={false}
                            tickLine={false}
                            xAxisId="period"
                            interval={0}
                            tick={<CustomGroupedPeriodTick data={formattedData} />}
                            height={30}
                        /> */}
                        <XAxis
                            dataKey="period"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(item) => new Date(item).toLocaleDateString()}
                            interval={0}
                            // interval={0}
                            // tick={renderQuarterTick}
                            // height={1}
                            // scale="band"
                            // tick={{ fontSize: 10, fill: "#909090", textAnchor: "middle" }}
                            // allowDuplicatedCategory={false} // ensures only one label per quarter
                            // tickFormatter={(q) => q}
                            height={30}
                            tick={<CustomAxisTick2 data={formattedData} />}
                            // allowDuplicatedCategory={false}
                            xAxisId="B"
                        />
                        {/* <XAxis
                            dataKey="uniqueKey"
                            axisLine={false}
                            tickLine={false}
                            tick={<CustomizedTick />}
                        /> */}
                        {/* <XAxis
                            dataKey="uniqueKey"
                            tickFormatter={(key) => {
                                const item = formattedData.find(d => d.uniqueKey === key);
                                return `${item?.fromWarehouseCode ?? ''} \n (${item?.period ?? ''})`;
                            }}
                            tick={{ fontSize: 10, fill: "#4D4D4D" }}
                            axisLine={false}
                            tickLine={false}
                        /> */}
                        {/* <XAxis dataKey="fromWarehouseCode" width={"auto"} tickFormatter={(value) => {
                            return value
                        }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
                        <YAxis
                            width={30}
                            dataKey="totalRequests"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#909090" }}
                            interval={5}
                            // domain={[0, maxValue]}
                            allowDecimals={false}
                            tickCount={Math.max(...formattedData.map((d: any) => d.totalRequests)) + 20}
                            ticks={Array.from(
                                { length: Math.max(...formattedData.map((d: any) => d.totalRequests)) + 20 },
                                (_, i) => i
                            )}
                            tickMargin={10}
                        />
                        {/* Period group labels */}
                        {/* <Customized
                            component={({ xAxisMap, data }: any) => {
                                const xAxis = Object.values(xAxisMap)[0];
                                return <CustomGroupLabel xAxis={xAxis} data={data} />;
                            }}
                        /> */}
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27, 89, 248, 0.05)" }} />
                        <Bar dataKey="totalRequests" fill="#1B59F8" maxBarSize={20} radius={[5, 5, 5, 5]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </>
    )
}

export default SumOfTotalRequestByFromWarehouseChartComponent