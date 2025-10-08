"use client"
import { Box, Grid, GridCol, Group, Select, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import RequestPerPeriodComponent from './RequestPerPeriodComponent'
import UserRequestChartComponent from './UserRequestChartComponent'
import { customStyles } from '@/styles/custom-theme'
import { IconChevronDown } from '@tabler/icons-react'
import { fetchITRDashboardDailyTranferKPI, fetchITRDashboardQuantity, fetchITRDashboardRequestsByDestinationWarehouse, fetchITRDashboardRequestsBySourceWarehouse, fetchITRDashboardUserCountList, fetchITRDashboardAverageCloseTime } from '@/redux/actions/dashboard-actions/dashboard-actions'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useMediaQuery } from '@mantine/hooks'
import UserRequestPerPeriodChartComponent from './UserRequestPerPeriodChartComponent'
import SumOfTotalRequestByToWarehouseChartComponent from './SumOfTotalRequestByToWarehouseChartComponent'
import TotalRequestChartComponent from './TotalRequestChartComponent'
import AvgCloseHours from './AvgCloseHours'
import QuantityChartComponent from './QuantityChartComponent'
import SumOfTotalRequestByFromWarehouseChartComponent from './SumOfTotalRequestByFromWarehouseChartComponent'
import { getDateRange } from '@/utils/getDateRange'

const ITR_DashboardComponent = () => {
    const isMobile = useMediaQuery("(max-width: 480px)");     // small phones
    const isTablet = useMediaQuery("(max-width: 768px)");     // tablets
    const isLaptop = useMediaQuery("(max-width: 1024px)");    // small laptops
    const isDesktop = useMediaQuery("(max-width: 1280px)");   // normal desktops
    const isLargeDesktop = useMediaQuery("(min-width: 1281px)"); // big screens
    const { authenticatedUser } = useAppSelector(({ authStates }) => {
        return authStates;
    });
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!authenticatedUser?.token) return;

        dispatch(
            fetchITRDashboardUserCountList({
                authToken: authenticatedUser.token,
            })
        );
        dispatch(
            fetchITRDashboardDailyTranferKPI({
                authToken: authenticatedUser.token,
            })
        );
        dispatch(
            fetchITRDashboardQuantity({
                authToken: authenticatedUser?.token || "",
            })
        );
        dispatch(
            fetchITRDashboardRequestsByDestinationWarehouse({
                authToken: authenticatedUser.token,
            })
        );
        dispatch(
            fetchITRDashboardRequestsBySourceWarehouse({
                authToken: authenticatedUser.token,
            })
        );
        dispatch(
            fetchITRDashboardAverageCloseTime({
                authToken: authenticatedUser.token,
            })
        );
    }, [authenticatedUser?.token, dispatch]);

    const handleFilterChange = (filterType: string, dashboardType: string) => {
        const { startDate, endDate } = getDateRange(filterType);
        // console.log("🚀 ~ handleFilterChange ~ startDate:", startDate)

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
    return (
        <Box>
            <Grid gutter="md" justify='space-between'>
                <GridCol span={isMobile ? 12 : isTablet ? 8 : 6} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <TotalRequestChartComponent />
                </GridCol>
                <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <SumOfTotalRequestByToWarehouseChartComponent />
                </GridCol>
                <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <QuantityChartComponent handleFilterChange = {handleFilterChange}/>
                </GridCol>
                <GridCol span={isMobile ? 12 : isTablet ? 8 : 6} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <AvgCloseHours />
                </GridCol>
                <GridCol span={12} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <SumOfTotalRequestByFromWarehouseChartComponent />
                </GridCol>
                <GridCol span={isMobile ? 12 : isTablet ? 6 : 4} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <UserRequestChartComponent />
                </GridCol>
            </Grid>
        </Box>
    )
}

export default ITR_DashboardComponent
