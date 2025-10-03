"use client"
import { Box, Grid, GridCol, Group, Select, Text } from '@mantine/core'
import React, { useEffect } from 'react'
import RequestPerPeriodComponent from './RequestPerPeriodComponent'
import UserRequestChartComponent from './UserRequestChartComponent'
import { customStyles } from '@/styles/custom-theme'
import { IconChevronDown } from '@tabler/icons-react'
import { fetchITRDashboardUserCountList } from '@/redux/actions/dashboard-actions/dashboard-actions'
import { useAppDispatch, useAppSelector } from '@/redux/store'

const ITR_DashboardComponent = () => {
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
                <GridCol span={4} bg={"white"} mih={450} p={20} style={{ borderRadius: 10 }}>
                    {/* <RequestPerPeriodComponent /> */}
                    <Group

                        justify="space-between"
                        mb="md"
                        wrap="wrap"
                        // gap="sm"
                    // style = {{border: "2px solid black"}}
                    >
                        <Text size="sm" fw={400} c={customStyles.colors._4D4D4D}>
                            User Requests
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
                    <Box w={"100%"} h={430}>
                        <UserRequestChartComponent />
                    </Box>
                </GridCol>
            </Grid>
        </Box>
    )
}

export default ITR_DashboardComponent
