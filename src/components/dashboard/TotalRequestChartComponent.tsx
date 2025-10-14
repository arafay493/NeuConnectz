// import { customStyles } from '@/styles/custom-theme'
// import { Box, Group, Select, Text } from '@mantine/core'
// import { IconChevronDown } from '@tabler/icons-react'
// import React from 'react'
// import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// const TotalRequestChartComponent = () => {
//     const data = [
//         {
//             period: "2025-09-29T00:00:00Z",
//             totalRequests: 1,
//             dayOfWeek: "1"
//         },
//         {
//             period: "2025-09-30T00:00:00Z",
//             totalRequests: 5,
//             dayOfWeek: "2"
//         },
//         {
//             period: "2025-10-01T00:00:00Z",
//             totalRequests: 8,
//             dayOfWeek: "3"
//         },
//         {
//             period: "2025-10-02T00:00:00Z",
//             totalRequests: 1,
//             dayOfWeek: "4"
//         },
//         {
//             period: "2025-10-03T00:00:00Z",
//             totalRequests: 22,
//             dayOfWeek: "5"
//         },
//         {
//             period: "2025-10-04T00:00:00Z",
//             totalRequests: 4,
//             dayOfWeek: "6"
//         },
//         {
//             period: "2025-10-06T00:00:00Z",
//             totalRequests: 14,
//             dayOfWeek: "1"
//         }
//     ]

//     const formattedData = data
//         .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
//         .map((item, index) => ({
//             ...item,
//             uniqueKey: `${index}`, // ensure uniqueness
//         }));
//     return (
//         <>
//             <Group
//                 justify="space-between"
//                 mb="md"
//                 wrap="wrap"
//             // gap="sm"
//             // style = {{border: "2px solid black"}}
//             >
//                 <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
//                     Total Requests
//                 </Text>
//                 <Group gap="sm">
//                     <Select
//                         w={{ base: "100%", sm: 130 }}
//                         data={["This Week", "This Month", "This Quarter"]}
//                         defaultValue="This Week"
//                         size="sm"
//                         rightSection={<IconChevronDown size={16} />}
//                         styles={{
//                             input: {
//                                 border: `1px solid ${customStyles.colors._E1E7EC}`,
//                                 color: customStyles.colors._909090,
//                                 fontSize: 14
//                             },
//                         }}
//                     />
//                 </Group>
//             </Group>
//             <Box w={"100%"} h={430}>
//                 <ResponsiveContainer width="100%" height="100%" >
//                     <LineChart width={250} data={formattedData} dataKey={(entry) => entry.uniqueKey} margin={{ top: 0, right: 0, left: 0, bottom: 40 }}>
//                         {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
//                         <XAxis allowDataOverflow dataKey="uniqueKey" width={"auto"} tickFormatter={(key) => {
//                             const item = formattedData.find(d => d.uniqueKey === key);
//                             return item?.period || '';
//                         }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} />
//                         {/* <XAxis dataKey="period" width={"auto"} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
//                         {/* <XAxis dataKey="uniqueKey" width={"auto"} tickFormatter={(key) => {
//                             const item = formattedData.find(d => d.uniqueKey === key);
//                             return item?.period || ''; // display only warehouse code
//                         }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
//                         {/* <XAxis
//                             dataKey="uniqueKey"
//                             axisLine={false}
//                             tickLine={false}
//                             tick={<CustomAxisTick data={data} />}
//                             xAxisId="A"
//                         /> */}
//                         {/* Bottom axis: centered period labels */}
//                         {/* <XAxis
//                             dataKey="period"
//                             axisLine={false}
//                             tickLine={false}
//                             xAxisId="period"
//                             interval={0}
//                             tick={<CustomGroupedPeriodTick data={formattedData} />}
//                             height={30}
//                         /> */}
//                         {/* <XAxis
//                             dataKey="period"
//                             axisLine={false}
//                             tickLine={false}
//                             tickFormatter={(item) => new Date(item).toLocaleDateString()}
//                             // interval={0}
//                             // tick={renderQuarterTick}
//                             // height={1}
//                             // scale="band"
//                             tick={{ fontSize: 10, fill: "#4D4D4D", textAnchor: "middle" }}
//                             // allowDuplicatedCategory={false} // ensures only one label per quarter
//                             // tickFormatter={(q) => q}
//                             height={30}
//                             // allowDuplicatedCategory={false}
//                             xAxisId="B"
//                         /> */}
//                         {/* <XAxis
//                             dataKey="uniqueKey"
//                             axisLine={false}
//                             tickLine={false}
//                             tick={<CustomizedTick />}
//                         /> */}
//                         {/* <XAxis
//                             dataKey="uniqueKey"
//                             tickFormatter={(key) => {
//                                 const item = formattedData.find(d => d.uniqueKey === key);
//                                 return `${item?.fromWarehouseCode ?? ''} \n (${item?.period ?? ''})`;
//                             }}
//                             tick={{ fontSize: 10, fill: "#4D4D4D" }}
//                             axisLine={false}
//                             tickLine={false}
//                         /> */}
//                         {/* <XAxis dataKey="fromWarehouseCode" width={"auto"} tickFormatter={(value) => {

//                             return value
//                         }} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#4D4D4D" }} /> */}
//                         <YAxis
//                             width={30}
//                             dataKey="totalRequests"
//                             axisLine={false}
//                             tickLine={false}
//                             tick={{ fontSize: 10, fill: "#4D4D4D" }}
//                             interval={2}
//                             // domain={[0, maxValue]}
//                             allowDecimals={false}
//                             tickCount={Math.max(...data.map((d: any) => d.totalRequests)) + 5}
//                             ticks={Array.from(
//                                 { length: Math.max(...data.map((d: any) => d.totalRequests)) + 5 },
//                                 (_, i) => i
//                             )}
//                             tickMargin={10}
//                         />
//                         <Tooltip />
//                         <Legend />
//                         {/* <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(27, 89, 248, 0.05)" }} /> */}
//                         <Line type="natural" dataKey="totalRequests" stroke="#8884d8" activeDot={{ r: 8 }} />
//                     </LineChart>
//                 </ResponsiveContainer>
//             </Box>
//         </>
//     )
// }

// export default TotalRequestChartComponent






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

const TotalRequestChartComponent = () => {
    const { dailyITRTransferKPIs } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });

    const formattedData = dailyITRTransferKPIs.map((d, i) => ({
        ...d,
        uniqueKey: `${i}`,
        dateLabel: new Date(d.period).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    }))

    // Custom tooltip to match your image
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const value = payload[0].value.toLocaleString()
            return (
                <div
                    style={{
                        background: 'transparent',
                        color: '#1B59F8',
                        fontWeight: '600',
                        fontSize: 16,
                    }}
                >
                    {value}
                </div>
            )
        }
        return null
    }

    return (
        <>
            <Group justify="space-between" mb="md" wrap="wrap">
                <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
                    Total Request
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
                    <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }} >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="dateLabel"
                            axisLine={false}
                            tickLine={false}
                            width={"auto"}
                            tick={{ fontSize: 10, fill: "#909090" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={30}
                            padding={{ top: 10, bottom: 40 }}
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
                            type="monotone"
                            dataKey="totalRequests"
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
            </Box>}
        </>
    )
}

export default React.memo(TotalRequestChartComponent)
