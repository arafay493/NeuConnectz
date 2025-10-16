import { Paper, Stack, Group, Text, Title, Divider } from "@mantine/core";
import React from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

const SumOfTotalUsageChartComponent = () => {
    const series = [
        {
            name: "Mon",
            data: [
                { x: "1 AM", y: 20 },
                { x: "2 AM", y: 40 },
                { x: "3 AM", y: 15 },
                { x: "4 AM", y: 50 },
                { x: "5 AM", y: 30 },
                { x: "6 AM", y: 10 },
                { x: "7 AM", y: 45 },
                { x: "8 AM", y: 35 },
                { x: "9 AM", y: 25 },
                { x: "10 AM", y: 50 },
            ],
        },
        {
            name: "Tue",
            data: [
                { x: "1 AM", y: 15 },
                { x: "2 AM", y: 25 },
                { x: "3 AM", y: 35 },
                { x: "4 AM", y: 45 },
                { x: "5 AM", y: 30 },
                { x: "6 AM", y: 40 },
                { x: "7 AM", y: 25 },
                { x: "8 AM", y: 15 },
                { x: "9 AM", y: 50 },
                { x: "10 AM", y: 10 },
            ],
        },
        {
            name: "Wed",
            data: [
                { x: "1 AM", y: 10 },
                { x: "2 AM", y: 20 },
                { x: "3 AM", y: 30 },
                { x: "4 AM", y: 40 },
                { x: "5 AM", y: 50 },
                { x: "6 AM", y: 25 },
                { x: "7 AM", y: 15 },
                { x: "8 AM", y: 35 },
                { x: "9 AM", y: 45 },
                { x: "10 AM", y: 30 },
            ],
        },
        {
            name: "Thu",
            data: [
                { x: "1 AM", y: 18 },
                { x: "2 AM", y: 27 },
                { x: "3 AM", y: 42 },
                { x: "4 AM", y: 37 },
                { x: "5 AM", y: 33 },
                { x: "6 AM", y: 15 },
                { x: "7 AM", y: 48 },
                { x: "8 AM", y: 25 },
                { x: "9 AM", y: 40 },
                { x: "10 AM", y: 50 },
            ],
        },
        {
            name: "Fri",
            data: [
                { x: "1 AM", y: 25 },
                { x: "2 AM", y: 35 },
                { x: "3 AM", y: 40 },
                { x: "4 AM", y: 20 },
                { x: "5 AM", y: 15 },
                { x: "6 AM", y: 30 },
                { x: "7 AM", y: 50 },
                { x: "8 AM", y: 45 },
                { x: "9 AM", y: 35 },
                { x: "10 AM", y: 25 },
            ],
        },
        {
            name: "Sat",
            data: [
                { x: "1 AM", y: 40 },
                { x: "2 AM", y: 30 },
                { x: "3 AM", y: 45 },
                { x: "4 AM", y: 50 },
                { x: "5 AM", y: 35 },
                { x: "6 AM", y: 20 },
                { x: "7 AM", y: 25 },
                { x: "8 AM", y: 30 },
                { x: "9 AM", y: 15 },
                { x: "10 AM", y: 10 },
            ],
        },
        {
            name: "Sun",
            data: [
                { x: "1 AM", y: 22 },
                { x: "2 AM", y: 42 },
                { x: "3 AM", y: 32 },
                { x: "4 AM", y: 28 },
                { x: "5 AM", y: 15 },
                { x: "6 AM", y: 20 },
                { x: "7 AM", y: 48 },
                { x: "8 AM", y: 35 },
                { x: "9 AM", y: 25 },
                { x: "10 AM", y: 45 },
            ],
        },
    ];


    const options: ApexOptions = {
        chart: {
            type: "heatmap",
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ["#DCE7FF", "#91B9FF", "#3579F6", "#0047FF"],
        title: {
            text: "Sum of Total Usage",
            align: "left",
            style: {
                fontSize: "16px",
                fontWeight: 600,
            },
        },
        xaxis: {
            type: "category",
            labels: {
                rotate: 0,
                style: {
                    fontSize: "10px",
                    fontWeight: 400,
                },
            },

        },
        yaxis: {
            labels: {
                style: {
                    fontWeight: 500,
                },
            },
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                colorScale: {
                    ranges: [
                        { from: 0, to: 10, color: "#DCE7FF" },
                        { from: 11, to: 30, color: "#91B9FF" },
                        { from: 31, to: 50, color: "#3579F6" },
                        { from: 51, to: 100, color: "#0047FF" },
                    ],
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val: any) => `${val} Time Usage`,
            },
        },
    };

    return (
        <Paper shadow="md" radius="lg" p="lg" withBorder>
            {/* Chart */}
            <Chart options={options} series={series} type="heatmap" height={450} />

            <Divider my="md" />

            {/* Summary Section */}
            <Group mt="md">
                <Stack align="center" gap={4}>
                    <Text fw={500} c="dimmed">
                        Today
                    </Text>
                    <Title order={4}>6h 15m</Title>
                    <Text size="sm" c="green">
                        ↑ 2.3%
                    </Text>
                </Stack>

                <Stack align="center" gap={4}>
                    <Text fw={500} c="dimmed">
                        This Week
                    </Text>
                    <Title order={4}>34h 12m</Title>
                    <Text size="sm" c="red">
                        ↓ 10.1%
                    </Text>
                </Stack>

                <Stack align="center" gap={4}>
                    <Text fw={500} c="dimmed">
                        This Month
                    </Text>
                    <Title order={4}>123h 47m</Title>
                    <Text size="sm" c="red">
                        ↓ 3.2%
                    </Text>
                </Stack>
            </Group>
        </Paper>
    );
};

export default SumOfTotalUsageChartComponent;
