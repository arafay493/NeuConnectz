import { useAppSelector } from '@/redux/store'
import { customStyles } from '@/styles/custom-theme'
import { Box, Group, Select, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React from 'react'
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

const AvgCloseHours = () => {
    const { ITRAvgCloseTime } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

    // const data = [
    //     {
    //         period: "2025-09-29T14:00:00",
    //         avgCloseHours: 89.21868532583335,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-09-30T05:00:00",
    //         avgCloseHours: 30.759357235555555,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-09-30T06:00:00",
    //         avgCloseHours: 29.84012363833333,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-09-30T11:00:00",
    //         avgCloseHours: 75.94780860944444,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-09-30T12:00:00",
    //         avgCloseHours: 103.76567504694444,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-01T05:00:00",
    //         avgCloseHours: 122.43809141041666,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-01T06:00:00",
    //         avgCloseHours: 121.77135872402778,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-01T07:00:00",
    //         avgCloseHours: 120.87712687555555,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-01T10:00:00",
    //         avgCloseHours: 117.47102748638889,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-01T11:00:00",
    //         avgCloseHours: 116.92363739027778,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-02T05:00:00",
    //         avgCloseHours: 98.43670014833333,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T07:00:00",
    //         avgCloseHours: 72.66837207472221,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T10:00:00",
    //         avgCloseHours: 70.25295474944444,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T11:00:00",
    //         avgCloseHours: 69.16220710333333,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T13:00:00",
    //         avgCloseHours: 67.03596405138889,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T15:00:00",
    //         avgCloseHours: 64.82421502972223,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T18:00:00",
    //         avgCloseHours: 73.12048460097222,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T19:00:00",
    //         avgCloseHours: 64.00647553757936,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-03T20:00:00",
    //         avgCloseHours: 71.831997175,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-04T05:00:00",
    //         avgCloseHours: 51.13514255569444,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-04T07:00:00",
    //         avgCloseHours: 48.638363885,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-06T08:00:00",
    //         avgCloseHours: 1.8645339741666667,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-06T14:00:00",
    //         avgCloseHours: 0.19758003816666667,
    //         unit: "Hr"
    //     },
    //     {
    //         period: "2025-10-07T07:00:00",
    //         avgCloseHours: 0.07075420962962962,
    //         unit: "Hr"
    //     }
    // ]

    // Format data for chart (convert date to readable label)
    const formattedData = ITRAvgCloseTime.map((d, i) => ({
        ...d,
        uniqueKey: `${i}`,
        dateLabel: new Date(d.period).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }),
    }))

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value.toFixed(2)
            return (
                <div
                    style={{
                        background: 'transparent',
                        color: '#1B59F8',
                        fontWeight: '600',
                        fontSize: 16,
                    }}
                >
                    {value} Hr
                </div>
            )
        }
        return null
    }

    return (
        <>
            <Group justify="space-between" mb="md" wrap="wrap">
                <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
                    Average Close Hours
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
                    <Select
                        w={{ base: "100%", sm: 120 }}
                        data={["Download"]}
                        defaultValue="Download"
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
                    <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <XAxis
                            dataKey="dateLabel"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#909090" }}
                            // interval="preserveStartEnd"
                            minTickGap={30}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            tick={{ fontSize: 10, fill: "#909090" }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: "#1B59F8",
                                strokeWidth: 2,
                            }}
                        />
                        <Line
                            // type="monotone"
                            dataKey="avgCloseHours"
                            stroke="#909090"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "#fff",
                                stroke: "#1B59F8",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </>
    )
}

export default AvgCloseHours
