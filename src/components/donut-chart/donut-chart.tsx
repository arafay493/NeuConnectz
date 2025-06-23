// Note: DonutChart Component...!

"use client";

import React , { memo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";
import { Box, Paper, Text, Group, Stack } from "@mantine/core";

const data = [
    { name: "Category 1", value: 50000, color: "#78C3FB" },  // Blue
    { name: "Category 2", value: 25000, color: "#B7F0DB" },  // Green
    { name: "Category 3", value: 15000, color: "#F8B2BD" },  // Pink
    { name: "Category 4", value: 10000, color: "#FDBF61" },  // Orange
];

const total = data.reduce((sum, item) => sum + item.value, 0);

const DonutChart = () => {
    return (
        <Paper radius="md" shadow="sm" p="md" withBorder>
            <Group align="center" justify="space-between" wrap="nowrap">
                {/* Donut Chart */}
                <Box w="60%" h={250}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius="70%"
                                outerRadius="100%"
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Labels */}
                    {/* <Box
                        style={{
                            // position: "absolute",
                            // top: "50%",
                            // left: "22%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center"
                        }}
                    >
                        <Text size="xl" fw={700}>
                            1,234
                        </Text>
                        <Text size="sm" color="dimmed">
                            ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                    </Box> */}
                </Box>

                {/* Legend */}
                <Stack gap="xs" w="40%">
                    {data.map((item, i) => (
                        <Group key={i} gap="xs" align="center">
                            <Box w={8} h={8} bg={item.color} style={{ borderRadius: 999 }} />
                            <Text size="sm" color="dimmed" w={90}>
                                {item.name}
                            </Text>
                            <Text size="sm" fw={500}>
                                ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Text>
                        </Group>
                    ))}
                </Stack>
            </Group>
        </Paper>
    );
};

export default memo(DonutChart);