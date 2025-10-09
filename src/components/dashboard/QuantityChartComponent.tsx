import { useAppSelector } from '@/redux/store'
import { customStyles } from '@/styles/custom-theme'
import { Box, Group, Select, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface propTypes {
    handleFilterChange: (filterType: string, dashboardType: string) => void
}

const QuantityChartComponent = ({ handleFilterChange }: propTypes) => {
    const { ITRQuantity } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

    // Format data for chart (convert date to readable label)
    // const formattedData = ITRQuantity.map((d, i) => ({
    //     ...d,
    //     uniqueKey: `${i}`,
    //     dateLabel: new Date(d.period).toLocaleString("en-GB", {
    //         day: "2-digit",
    //         month: "2-digit",
    //         year: "2-digit",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //         hour12: false,
    //     }),
    // }))

    // // Custom Tooltip
    // const CustomTooltip = ({ active, payload }: any) => {
    //     if (active && payload && payload.length) {
    //         const value = payload[0].value.toFixed(2)
    //         return (
    //             <div
    //                 style={{
    //                     background: 'transparent',
    //                     color: '#1B59F8',
    //                     fontWeight: '600',
    //                     fontSize: 16,
    //                 }}
    //             >
    //                 {value} Hr
    //             </div>
    //         )
    //     }
    //     return null
    // }
    return (
        <>
            <Group justify="space-between" mb="md" wrap="wrap">
                <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
                    Quantity
                </Text>
                <Group gap="sm">
                    <Select
                        w={{ base: "100%", sm: 130 }}
                        // data={["This Week", "This Month", "This Quarter"]}
                        data={[
                            { value: 'week', label: 'This Week' },
                            { value: 'month', label: 'This Month' },
                            { value: 'quarter', label: 'This Quarter' },
                        ]}
                        onChange={() => handleFilterChange("week", "quantity")}
                        defaultValue="week"
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
                    <AreaChart
                        width={500}
                        height={400}
                        data={ITRQuantity}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="itemName"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: "#909090" }}
                            // interval="preserveStartEnd"
                            minTickGap={30}
                        />
                        {/* <XAxis dataKey="name" /> */}
                        <YAxis
                            dataKey="quantity"
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            domain={[0, 9999]}
                            tick={{ fontSize: 10, fill: "#909090" }}
                        />
                        <Tooltip />
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1B59F8" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#1B59F8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area dataKey="quantity" stroke="#1B59F8" fill="url(#colorUv)" strokeDasharray="3 3" activeDot={{
                            r: 5,
                            fill: "#fff",
                            stroke: "#1B59F8",
                            strokeWidth: 2,
                        }} />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </>
    )
}

export default QuantityChartComponent
