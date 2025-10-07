"use client"
import { Box, Grid, GridCol, Group, Select, Text } from '@mantine/core'
import React, { useEffect } from 'react'
import RequestPerPeriodComponent from './RequestPerPeriodComponent'
import UserRequestChartComponent from './UserRequestChartComponent'
import { customStyles } from '@/styles/custom-theme'
import { IconChevronDown } from '@tabler/icons-react'
import { fetchITRDashboardUserCountList } from '@/redux/actions/dashboard-actions/dashboard-actions'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { useMediaQuery } from '@mantine/hooks'
import UserRequestPerPeriodChartComponent from './UserRequestPerPeriodChartComponent'
import SumOfTotalRequestByWarehouseChartComponent from './SumOfTotalRequestByWarehouseChartComponent'

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
    }, [authenticatedUser?.token, dispatch]);
    return (
        <Box>
            {/* <Stack justify='between' display={"flex"} >
                <Stack>
                    <Group></Group>
                    <Group bg={"white"}>1</Group>
                </Stack>
                <Stack>
                    <Group></Group>
                    <Group bg={"white"}>2</Group>
                </Stack>
            </Stack> */}
            <Grid gutter="md" justify='space-between'>
                <GridCol span={isMobile ? 12 : isTablet ? 6 : 4} bg={"white"} mih={230} p={20} mr={10} mb={10} style={{ borderRadius: 10 }}>
                    <UserRequestChartComponent />
                </GridCol>
                {/* <GridCol span={isMobile ? 12 : isTablet ? 6 : 4} bg={"white"} mih={230} p={20} style={{ borderRadius: 10 }}>
                    <UserRequestPerPeriodChartComponent />
                </GridCol> */}
                <GridCol span={12} bg={"white"} mih={230} p={20} style={{ borderRadius: 10 }}>
                    <SumOfTotalRequestByWarehouseChartComponent />
                </GridCol>
            </Grid>
        </Box>
    )
}

export default ITR_DashboardComponent
