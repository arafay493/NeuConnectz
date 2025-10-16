import { Paper, Stack, Group, Text, Title, Divider, Box } from "@mantine/core";
import React, { useMemo } from "react";
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
                { x: "4 AM", y: 400 },
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
                { x: "7 AM", y: 300 },
                { x: "8 AM", y: 35 },
                { x: "9 AM", y: 25 },
                { x: "10 AM", y: 300 },
            ],
        },
    ];

    const fillMissingHours = (series: any) => {
        // 🔢 Define full 24-hour labels
        const hours = [
            "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM",
            "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
            "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM",
            "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
        ];

        return series.map((day: any) => {
            const hourMap = new Map(day.data.map((d: any) => [d.x, d.y]));

            const filledData = hours.map((hour) => ({
                x: hour,
                y: hourMap.get(hour) ?? 0, // if missing, default to 0
            }));

            return { ...day, data: filledData };
        });
    };

    const filledSeries = fillMissingHours(series);


    // 🧮 Calculate min & max from all y-values
    const { minY, maxY } = useMemo(() => {
        const allYValues = series.flatMap((day: any) => day.data.map((d: any) => d.y));
        return {
            minY: Math.min(...allYValues),
            maxY: Math.max(...allYValues),
        };
    }, [series]);

    // 🎨 Generate dynamic color scale ranges
    const generateColorRanges = () => {
        const steps = 6; // how many color levels
        // const stepValue = (maxY - minY) / steps;
        const stepValue = (maxY - minY) / (10 * steps);
        const colors = [
            "#d9e9ff",
            "#bbd9ff",
            "#8cc1ff",
            "#569eff",
            "#2f78ff",
            "#1B59F8",
        ];

        return Array.from({ length: steps }, (_, i) => ({
            from: Math.round(minY + stepValue * i),
            // to: Math.round(minY + stepValue * (i + 1)),
            to: i === steps - 1
                ? Math.ceil(maxY + 1) // ensure last range covers the max
                : Math.round(minY + stepValue * (i + 1)),
            color: colors[i],
        }));
    };

    // const generateColorRanges = () => {
    //     const steps = 6;
    //     const stepValue = (maxY - minY) / steps;
    //     const baseColors = ["#1B59F8"]; // one base color
    //     return Array.from({ length: steps }, (_, i) => {
    //         const intensity = 0.2 + i * (0.8 / steps); // from light to dark
    //         return {
    //             from: Math.round(minY + stepValue * i),
    //             to: Math.round(minY + stepValue * (i + 1)),
    //             color: `rgba(27, 89, 248, ${intensity.toFixed(2)})`, // varying opacity
    //         };
    //     });
    // };

    const options: ApexOptions = {
        chart: {
            type: "heatmap",
            toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        title: {
            text: "Sum of Total Usage",
            align: "left",
            style: { fontSize: "16px", fontWeight: 600 },
        },
        xaxis: {
            type: "category",
            labels: {
                rotate: 0,
                style: { fontSize: "10px", fontWeight: 400 },
            },
        },
        yaxis: {
            labels: {
                style: { fontWeight: 500 },
            },
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 10,
                radius: 40,
                colorScale: {
                    ranges: generateColorRanges(),
                },
                // ✅ make small cell gaps
                // useFillColorAsStroke: true,
                // distributed: true,
            },
        },
        
        tooltip: {
            y: {
                formatter: (val: number) => `${val} Time Usage`,
            },
        },
    };

    return (
        <Paper shadow="md" radius="lg" p="lg" withBorder>
            <style>
                {`
                    .apexcharts-heatmap-rect {
                    rx: 6px !important;
                    ry: 6px !important;
                    }
                `}
            </style>
            {/* Chart */}
            <Chart options={options} series={filledSeries} type="heatmap" height={450} />

            {/* Low to High Gradient */}
            <Box mt="sm" mb="md">
                <Group justify="space-between" align="center">
                    <Text size="sm" c="dimmed">
                        Low
                    </Text>
                    <Box
                        style={{
                            flexGrow: 1,
                            height: 4,
                            background:
                                "linear-gradient(90deg, #d9e9ff, #bbd9ff, #8cc1ff, #569eff, #2f78ff, #1B59F8)",
                            borderRadius: 4,
                        }}
                    />
                    <Text size="sm" c="dimmed">
                        High
                    </Text>
                </Group>
            </Box>

            {/* Summary Section */}
            <Group mt="md" justify="space-around">
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
