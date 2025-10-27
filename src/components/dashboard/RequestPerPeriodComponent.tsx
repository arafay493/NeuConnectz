"use client";

import React, { useMemo } from "react";
import { Card, Group, Select, Button, Text, Box } from "@mantine/core";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { customStyles } from "@/styles/custom-theme";
import { IconChevronDown } from "@tabler/icons-react";
import { useAppSelector } from "@/redux/store";

// ============================================================
// 📊 MAIN COMPONENT
// ============================================================
const RequestPerPeriodComponent = () => {
    const { userRequestsPerPeriod } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });
    // const data = [
    //     { period: "2025-09-29T00:00:00Z", userName: "harisbashir", userRequests: 2 },
    //     { period: "2025-09-29T00:00:00Z", userName: "sagartesting", userRequests: 1 },
    //     { period: "2025-09-30T00:00:00Z", userName: "sagartesting", userRequests: 18 },
    //     { period: "2025-10-01T00:00:00Z", userName: "as", userRequests: 14 },
    //     { period: "2025-10-02T00:00:00Z", userName: "nabeela", userRequests: 3 },
    //     { period: "2025-10-02T00:00:00Z", userName: "sufiyan", userRequests: 1 },
    //     { period: "2025-10-03T00:00:00Z", userName: "daniyal", userRequests: 6 },
    // ];

    const colors = ["#FF8A8A", "#789EFF", "#BBC5FA", "#FFA261", "#D5A5FF"];

    const treeData = useMemo(() => [
        {
            name: "Users",
            children: userRequestsPerPeriod.map((d, i) => ({
                name: d.userName,
                size: d.userRequests,
                color: colors[i % colors.length],
                period: new Date(d.period).toLocaleDateString("en-GB"),
            })),
        },
    ], [userRequestsPerPeriod]);

    // ============================================================
    // 🎨 CUSTOM TREEMAP CELL
    // ============================================================
    const CustomizedContent = (props: any) => {
        const { depth, x, y, width, height, name, period, color } = props;
        if (depth === 0) return null;

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

    // ============================================================
    // 🧰 CUSTOM TOOLTIP
    // ============================================================
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, size, period } = payload[0].payload;
            return (
                <div
                    style={{
                        background: "white",
                        padding: "8px 12px",
                        borderRadius: 8,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                        border: "1px solid #E1E7EC",
                    }}
                >
                    <Text fw={600} size="sm" c="#333">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Text>
                    <Text size="xs" c="#666">
                        Period: {period}
                    </Text>
                    <Text size="xs" c="#666">
                        Requests: {size}
                    </Text>
                </div>
            );
        }
        return null;
    };

    return (
        <Card radius="lg" p="md">
            <Group justify="space-between" mb="md" wrap="wrap">
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
                                fontSize: 14,
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
                        fill="#fff"
                        content={<CustomizedContent />}
                    >
                        {/* 🧠 Tooltip added here */}
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                    </Treemap>
                </ResponsiveContainer>
            </Box>
        </Card>
    );
};

export default React.memo(RequestPerPeriodComponent);
