"use client";

import { useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { Box, Group, Select, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import React from 'react'
import { Bar, BarChart, CartesianGrid, Customized, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'


const SumOfTotalRequestByToWarehouseChartComponent = () => {
    const { ITRRequestsToWarehouse } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

    const formattedData = ITRRequestsToWarehouse
        // .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
        .map((item, index) => ({
            ...item,
            uniqueKey: `${index}`, // ensure uniqueness
        }));

    // const chartData = formattedData.map((item) => ({
    //     warehouseCode: item.toWarehouseCode,
    //     // period: item.period.split("T")[0],
    //     period: item.period,
    //     totalRequests: item.totalRequests,
    // }));

    // const groupData = formattedData.reduce((acc: any, curr: any) => {
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
        // console.log("🚀 ~ CustomTooltip ~ payload:", payload)
        // const currentPayload = formattedData.find(p => p.uniqueKey === payload[0]?.payload.uniqueKey);
        // const value = currentPayload?.totalRequests;
        const value = payload[0]?.value;
        if (active && payload && payload.length) {
            return (
                <div
                    style={{
                        position: "absolute",
                        left: coordinate.x,
                        top: coordinate.y - 40, 
                        transform: "translateX(-50%)",
                        background: "#D9D9D9",
                        borderRadius: 8,
                        padding: "6px 10px",
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
        const current = data[index];
        const prev = data[index - 1];
        const next = data[index + 1];

        const showDivider = next && next.period !== current.period;
        // console.log("🚀 ~ CustomAxisTick ~ showDivider:", showDivider, data)
        if (!item) return null;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={10}
                    textAnchor="middle"
                    fill="#4D4D4D"
                    fontSize={10}
                    fontWeight={500}
                    style={{ marginRight: 20 }}
                >
                    {item.toWarehouseCode}
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

    // function CustomizedTick(props: any) {
    //     const { x, y, stroke, payload } = props;
    //     return (
    //         <g transform={`translate(${x},${y})`}>
    //             <text x={0} y={0} dy={16} fill="#666">
    //                 <tspan textAnchor="middle" x="0">
    //                     Line 1
    //                 </tspan>
    //                 <tspan textAnchor="middle" x="0" dy="20">
    //                     Line 2
    //                 </tspan>
    //                 <tspan textAnchor="middle" x="0" dy="40">
    //                     Line 3
    //                 </tspan>
    //             </text>
    //         </g>
    //     );
    // }

    // const CustomGroupedPeriodTick = ({ x, y, payload, data }: any) => {
    //     const currentPeriod = payload.value;

    //     // Find all bars for this period
    //     const samePeriodItems = data.filter((d: any) => d.period === currentPeriod);
    //     if (!samePeriodItems.length) return null;

    //     // Get all indices of this period
    //     const allPeriods = data.map((d: any) => d.period);
    //     const firstIndex = allPeriods.indexOf(currentPeriod);
    //     const lastIndex = allPeriods.lastIndexOf(currentPeriod);

    //     // Compute center between first and last bar positions
    //     const xScale = payload.coordinate;
    //     const totalBars = allPeriods.length;
    //     const barWidth = (payload.coordinate * totalBars) / totalBars; // approximate width
    //     const centerX = (xScale * (firstIndex + lastIndex + 1)) / 2;

    //     // Only draw label for the first occurrence (avoid repeats)
    //     if (payload.index !== firstIndex) return null;

    //     return (
    //         <g transform={`translate(${centerX}, ${y + 20})`}>
    //             <text textAnchor="middle" fill="#4D4D4D" fontSize={12}>
    //                 {new Date(currentPeriod).toLocaleDateString()}
    //             </text>
    //         </g>
    //     );
    // };

    // const CustomGroupLabel = ({ xAxis, data }: any) => {
    //     const scale = xAxis.scale; // the X scale function from Recharts
    //     const positions: any = [];

    //     // group by period
    //     const grouped = data.reduce((acc: any, item: any, idx: any) => {
    //         if (!acc[item.period]) acc[item.period] = [];
    //         acc[item.period].push(idx);
    //         return acc;
    //     }, {});

    //     // compute center for each group
    //     Object.entries(grouped).forEach(([period, indices]: any) => {
    //         const first = indices[0];
    //         const last = indices[indices.length - 1];
    //         const firstX = scale(data[first].uniqueKey);
    //         const lastX = scale(data[last].uniqueKey);
    //         const centerX = (firstX + lastX) / 2;
    //         positions.push({ period, centerX });
    //     });

    //     return (
    //         <g>
    //             {positions.map((p: any) => (
    //                 <text
    //                     key={p.period}
    //                     x={p.centerX}
    //                     y={xAxis.y + 25}
    //                     textAnchor="middle"
    //                     fill="#4D4D4D"
    //                     fontSize={12}
    //                 >
    //                     {new Date(p.period).toLocaleDateString()}
    //                 </text>
    //             ))}
    //         </g>
    //     );
    // };


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
                    Sum of Total Requests by to Warehouse
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
                            // interval={0}
                            // tick={renderQuarterTick}
                            // height={1}
                            // scale="band"
                            tick={{ fontSize: 10, fill: "#4D4D4D", textAnchor: "middle" }}
                            // allowDuplicatedCategory={false} // ensures only one label per quarter
                            // tickFormatter={(q) => q}
                            height={30}
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
                            console.log("🚀 ~ value:", value)

                            return value
                        }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
                        <YAxis
                            width={30}
                            dataKey="totalRequests"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#4D4D4D" }}
                            interval={2}
                            // domain={[0, maxValue]}
                            allowDecimals={false}
                            tickCount={Math.max(...formattedData.map((d: any) => d.totalRequests)) + 5}
                            ticks={Array.from(
                                { length: Math.max(...formattedData.map((d: any) => d.totalRequests)) + 5 },
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

export default SumOfTotalRequestByToWarehouseChartComponent