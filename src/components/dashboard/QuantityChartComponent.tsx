import { customStyles } from '@/styles/custom-theme'
import { Box, Group, Select, Text } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const QuantityChartComponent = () => {
    const data = [
        {
            "period": "2025-09-29T00:00:00Z",
            "itemName": "Box Board BS Coated W/Dup 35\" 300g",
            "uniqueItems": 1,
            "quantity": 4
        },
        {
            "period": "2025-09-30T00:00:00Z",
            "itemName": "Bleach Card Reel Cutting 270G 31 X 28",
            "uniqueItems": 5,
            "quantity": 45
        },
        {
            "period": "2025-10-01T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Bottom ) 12\"\" X 8.75\"\" X 8.40 3 Ply",
            "uniqueItems": 4,
            "quantity": 40.526
        },
        {
            "period": "2025-10-01T00:00:00Z",
            "itemName": "Bleach Card Reel Cutting 270G 31 X 28",
            "uniqueItems": 3,
            "quantity": 40.5
        },
        {
            "period": "2025-10-01T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Top ) 12.25\"\" X 3.25 X 8.75 3 Ply",
            "uniqueItems": 1,
            "quantity": 8.9
        },
        {
            "period": "2025-10-02T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Bottom ) 12\"\" X 8.75\"\" X 8.40 3 Ply",
            "uniqueItems": 1,
            "quantity": 10
        },
        {
            "period": "2025-10-03T00:00:00Z",
            "itemName": "Bleach Card Reel Cutting 270G 31 X 28",
            "uniqueItems": 11,
            "quantity": 81.73
        },
        {
            "period": "2025-10-03T00:00:00Z",
            "itemName": "Bleach Card Reel 31\" 270Gsm",
            "uniqueItems": 6,
            "quantity": 48
        },
        {
            "period": "2025-10-03T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Bottom ) 12\"\" X 8.75\"\" X 8.40 3 Ply",
            "uniqueItems": 4,
            "quantity": 26.45
        },
        {
            "period": "2025-10-03T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Top ) 12.25\"\" X 3.25 X 8.75 3 Ply",
            "uniqueItems": 1,
            "quantity": 9
        },
        {
            "period": "2025-10-04T00:00:00Z",
            "itemName": "Bleach Card Reel 31\" 270Gsm",
            "uniqueItems": 2,
            "quantity": 17
        },
        {
            "period": "2025-10-04T00:00:00Z",
            "itemName": "Imported Paper A-4 80G 210 X 297Mm",
            "uniqueItems": 1,
            "quantity": 12500
        },
        {
            "period": "2025-10-04T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Bottom ) 12\"\" X 8.75\"\" X 8.40 3 Ply",
            "uniqueItems": 1,
            "quantity": 200
        },
        {
            "period": "2025-10-06T00:00:00Z",
            "itemName": "Box Board (Benison) 25.50 x 31.75 300Gsm",
            "uniqueItems": 7,
            "quantity": 804
        },
        {
            "period": "2025-10-06T00:00:00Z",
            "itemName": "CTP Printing Plate 1030X770X0.24 (Local)",
            "uniqueItems": 2,
            "quantity": 4
        },
        {
            "period": "2025-10-06T00:00:00Z",
            "itemName": "Ctp Printing Plate 1030X790X0.24",
            "uniqueItems": 2,
            "quantity": 4
        },
        {
            "period": "2025-10-06T00:00:00Z",
            "itemName": "Offset Paper 23.50  x 31 80Gsm (Tehreer)",
            "uniqueItems": 2,
            "quantity": 2002
        },
        {
            "period": "2025-10-06T00:00:00Z",
            "itemName": "CTP Printing Plate 1050X795X0.24",
            "uniqueItems": 1,
            "quantity": 4
        },
        {
            "period": "2025-10-07T00:00:00Z",
            "itemName": "Bleach Card Reel 31\" 270Gsm",
            "uniqueItems": 2,
            "quantity": 135
        },
        {
            "period": "2025-10-07T00:00:00Z",
            "itemName": "A - 4 Magic Copy Box ( Bottom ) 12\"\" X 8.75\"\" X 8.40 3 Ply",
            "uniqueItems": 1,
            "quantity": 3.52
        },
        {
            "period": "2025-10-07T00:00:00Z",
            "itemName": "Ctp Printing Plate 1030X790X0.24",
            "uniqueItems": 1,
            "quantity": 28
        },
        {
            "period": "2025-10-07T00:00:00Z",
            "itemName": "Offset Paper Imported 24.5 x 34 80Gsm",
            "uniqueItems": 1,
            "quantity": 26500
        }
    ]

    // Format data for chart (convert date to readable label)
    const formattedData = data.map((d, i) => ({
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
                    Quantity
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
                {/* <ResponsiveContainer width="100%" height="100%">
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
                </ResponsiveContainer> */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={500}
                        height={400}
                        data={data}
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
                        <Area type="monotone" dataKey="quantity" stroke="#1B59F8" fill="url(#colorUv)" strokeDasharray="3 3" activeDot={{
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
