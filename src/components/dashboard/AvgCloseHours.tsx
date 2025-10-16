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
    CartesianGrid,
} from 'recharts'

const AvgCloseHours = () => {
    const { ITRAvgCloseTime } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

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

            {!formattedData?.length ? <Box w="100%" h={350} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" c="dimmed">No data available</Text>
            </Box> : <Box w={"100%"} h={350}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
            }

        </>
    )
}

export default React.memo(AvgCloseHours)
