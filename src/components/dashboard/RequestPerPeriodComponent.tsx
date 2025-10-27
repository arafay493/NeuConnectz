"use client";

import React from "react";
import { Card, Group, Select, Button, Text, Box } from "@mantine/core";
import { Treemap, ResponsiveContainer } from "recharts";
import { customStyles } from "@/styles/custom-theme";
import { IconChevronDown } from "@tabler/icons-react";


// ============================================================
// 📊 MAIN COMPONENT
// ============================================================
const RequestPerPeriod = () => {
    // ============================================================
    // 🧩 SAMPLE DATA
    // ============================================================
    const data = [
        {
            period: "2025-09-29T00:00:00Z",
            userName: "harisbashir",
            userRequests: 2,
        },
        {
            period: "2025-09-29T00:00:00Z",
            userName: "sagartesting",
            userRequests: 1,
        },
        {
            period: "2025-09-30T00:00:00Z",
            userName: "sagartesting",
            userRequests: 18,
        },
        {
            period: "2025-10-01T00:00:00Z",
            userName: "as",
            userRequests: 14,
        },
        {
            period: "2025-10-02T00:00:00Z",
            userName: "nabeela",
            userRequests: 3,
        },
        {
            period: "2025-10-02T00:00:00Z",
            userName: "sufiyan",
            userRequests: 1,
        },
        {
            period: "2025-10-03T00:00:00Z",
            userName: "daniyal",
            userRequests: 6,
        },
    ];

    // ============================================================
    // 🌈 COLOR PALETTE (matching your screenshot)
    // ============================================================
    const colors = [
        "#FF8A8A",
        "#789EFF",
        "#BBC5FA",
        "#FFA261",
        "#D5A5FF",
    ];

    // ============================================================
    // 🧱 TREE DATA
    // ============================================================
    const treeData = [
        {
            name: "Users",
            children: data.map((d, i) => ({
                name: d.userName,
                size: d.userRequests,
                color: colors[i % colors.length],
                period: new Date(d.period).toLocaleDateString("en-GB"), // e.g. 16-09-2025
            })),
        },
    ];

    // ============================================================
    // 🎨 CUSTOM TREEMAP CELL
    // ============================================================
    const CustomizedContent = (props: any) => {
        const { depth, x, y, width, height, index, name, period, color } = props;
        if (depth === 0) return null;

        // Add visible gap between rectangles
        const gap = 6;
        const rectX = x + gap / 2;
        const rectY = y + gap / 2;
        const rectWidth = Math.max(0, width - gap);
        const rectHeight = Math.max(0, height - gap);

        return (
            <g>
                <rect
                    x={rectX}
                    y={rectY}
                    width={rectWidth}
                    height={rectHeight}
                    rx={12}
                    ry={12}
                    style={{
                        fill: color,
                        stroke: "#fff",
                        strokeWidth: 2,
                    }}
                />

                {rectWidth > 80 && rectHeight > 40 && (
                    <g transform={`translate(${rectX + rectWidth / 2}, ${rectY + 30})`}>
                        <text
                            y={-8}
                            fill="#fff"
                            fontSize={14}
                            fontWeight="600"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ pointerEvents: "none" }}
                        >
                            {name.charAt(0).toUpperCase() + name.slice(1)}
                        </text>

                        <text
                            y={rectHeight - 50}
                            fill="#fff"
                            fontSize={12}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ pointerEvents: "none" }}
                        >
                            {period}
                        </text>
                    </g>
                )}
            </g>
        );
    };
    return (
        <Card radius="lg" p="md">
            <Group
                justify="space-between"
                mb="md"
                wrap="wrap"
            // gap="sm"
            // style = {{border: "2px solid black"}}
            >
                <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
                    Request By User Per Period
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

            <Box w={"100%"} h={350}>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={treeData}
                        dataKey="size"
                        // stroke="#fff"
                        fill="#fff"
                        content={<CustomizedContent />}
                    />
                </ResponsiveContainer>
            </Box>
        </Card>
    );
};

export default RequestPerPeriod;
