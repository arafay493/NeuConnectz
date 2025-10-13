"use client"
import { Box, Button, Grid, GridCol, Group, Select, Stack, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import RequestPerPeriodComponent from './RequestPerPeriodComponent'
import UserRequestChartComponent from './UserRequestChartComponent'
import { customStyles } from '@/styles/custom-theme'
import { IconChevronDown, IconUserCircle } from '@tabler/icons-react'
import { fetchITRDashboardDailyTranferKPI, fetchITRDashboardQuantity, fetchITRDashboardRequestsByDestinationWarehouse, fetchITRDashboardRequestsBySourceWarehouse, fetchITRDashboardUserCountList, fetchITRDashboardAverageCloseTime } from '@/redux/actions/dashboard-actions/dashboard-actions'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useMediaQuery } from '@mantine/hooks'
import SumOfTotalRequestByToWarehouseChartComponent from './SumOfTotalRequestByToWarehouseChartComponent'
import TotalRequestChartComponent from './TotalRequestChartComponent'
import AvgCloseHours from './AvgCloseHours'
import QuantityChartComponent from './QuantityChartComponent'
import SumOfTotalRequestByFromWarehouseChartComponent from './SumOfTotalRequestByFromWarehouseChartComponent'
import { getDateRange } from '@/utils/getDateRange'
import Loader from '../loader/loader'

const ITR_DashboardComponent = ({ selectedUser, setDeleteModalOpened, handleOpenModal }: any) => {
    const isMobile = useMediaQuery("(max-width: 480px)");     // small phones
    const isTablet = useMediaQuery("(max-width: 768px)");     // tablets
    const isLaptop = useMediaQuery("(max-width: 1024px)");    // small laptops
    const isDesktop = useMediaQuery("(max-width: 1280px)");   // normal desktops
    const isLargeDesktop = useMediaQuery("(min-width: 1281px)"); // big screens
    const { authenticatedUser } = useAppSelector(({ authStates }) => {
        return authStates;
    });
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!authenticatedUser?.token) return;

        const authToken = authenticatedUser.token;

        setLoading(true)
        Promise.all([
            dispatch(fetchITRDashboardUserCountList({ authToken })),
            dispatch(fetchITRDashboardDailyTranferKPI({ authToken })),
            dispatch(fetchITRDashboardQuantity({ authToken })),
            dispatch(fetchITRDashboardRequestsByDestinationWarehouse({ authToken })),
            dispatch(fetchITRDashboardRequestsBySourceWarehouse({ authToken })),
            dispatch(fetchITRDashboardAverageCloseTime({ authToken })),
        ])
            .then((responses) => {
                console.log("✅ All dashboard APIs completed:", responses);
            })
            .catch((error) => {
                console.error("❌ Error while fetching dashboard data:", error);
            })
            .finally(() => {
                setLoading(false)
            });
    }, [authenticatedUser?.token, dispatch]);

    const handleFilterChange = (filterType: string, dashboardType: string) => {
        const { startDate, endDate } = getDateRange(filterType);

        // switch (dashboardType) {
        //     case "quantity":
        //         dispatch(
        //             fetchITRDashboardQuantity({
        //                 authToken: authenticatedUser?.token || "",
        //                 startDate,
        //                 endDate,
        //             })
        //         );
        //         break;

        //     default:
        //         break;
        // }

    };

    if (loading) {
        return <Loader loadingState={loading} />
    }
    return (
        <Box>
            {/* Title */}
            <Group mb={24} align="center" justify="space-between">
                <Stack gap={8}>
                    <Title
                        order={isTablet ? 3 : 2}
                        c={customStyles.colors._4D4D4D}
                        // size={isSmallScreen ? "h3" : "h2"}
                        style={{ fontWeight: 700, fontSize: 24 }}
                    >
                        ITR
                    </Title>
                    <Text
                        mb={isTablet ? 16 : 24}
                        c={customStyles.colors._909090}
                        // size={isSmallScreen ? "sm" : "md"}
                        style={{ fontWeight: 500, fontSize: 16 }}
                    >
                        Dashboard
                    </Text>
                </Stack>
                <Stack gap={2}>
                    {selectedUser && <Button
                        // className="filledButton"
                        // bg="#E1E7EC"
                        style={{ color: "red", fontSize: 10, textAlign: "right", width: 50, alignSelf: "end", padding: 0 }}
                        size="xs"
                        variant="transparent"
                        onClick={() => setDeleteModalOpened(true)}
                    >
                        Cancel
                    </Button>}
                    <Button
                        leftSection={<IconUserCircle size={24} />}
                        // className="filledButton"
                        bg="#E1E7EC"
                        style={{ color: "#4D4D4D", fontSize: 16 }}
                        size="md"
                        px={40}
                        py={10}
                        radius={8}
                        onClick={handleOpenModal}
                    >
                        {!selectedUser ? "Select User" : selectedUser.userName}
                    </Button>
                </Stack>
            </Group>
            <Grid gutter="md" justify='space-between' align='center'>
                <GridCol span={isLaptop ? 12 : 6} bg={"white"} mih={230} p={20} mr={2} mb={10} style={{ borderRadius: 10 }}>
                    <TotalRequestChartComponent />
                </GridCol>
                <GridCol span={isLaptop ? 12 : 5.8} bg={"white"} mih={230} p={20} mb={10} style={{ borderRadius: 10 }}>
                    <UserRequestChartComponent />
                </GridCol>
                <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <SumOfTotalRequestByToWarehouseChartComponent />
                </GridCol>
                <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <QuantityChartComponent handleFilterChange={handleFilterChange} />
                </GridCol>
                <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <SumOfTotalRequestByFromWarehouseChartComponent />
                </GridCol>
                <GridCol span={isLaptop ? 12 : isTablet ? 8 : 6} bg={"white"} mih={230} p={20} mb={10} style={{ borderRadius: 10 }}>
                    <AvgCloseHours />
                </GridCol>

                {/* <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <SumOfTotalUsageChartComponent />
                </GridCol> */}
            </Grid>
        </Box>
    )
}

export default ITR_DashboardComponent
