// Note: ProductStackedBarChart Component...!

"use client";

import React, { memo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { Paper, Box, Text } from "@mantine/core";

const data = [
    { name: "Jan", A: 40, B: 30, C: 30 },
    { name: "Feb", A: 25, B: 50, C: 25 },
    { name: "Mar", A: 20, B: 40, C: 40 },
    { name: "Apr", A: 30, B: 30, C: 40 },
    { name: "May", A: 30, B: 50, C: 20 }
];

const ProductStackedBarChart = () => {
    return (
        <Paper radius="md" shadow="sm" p="md" withBorder>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} stackOffset="expand">
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${Math.round(value * 100)}%`} />
                    <Tooltip
                        formatter={(value?: number) =>
                            value ? `${Math.round(value * 100)}%` : "0%"
                        }
                    />
                    <Legend />
                    <Bar dataKey="A" stackId="a" fill="#1B59F8" name="Product A" />
                    <Bar dataKey="B" stackId="a" fill="#7EA6F8" name="Product B" />
                    <Bar dataKey="C" stackId="a" fill="#E1ECFD" name="Product C" />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
}

export default memo(ProductStackedBarChart);