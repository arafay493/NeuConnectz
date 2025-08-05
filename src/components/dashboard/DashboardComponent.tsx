'use client';

import { customStyles } from "@/styles/custom-theme";
import { Box, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import AppUsageComponent from "./AppUsageComponent";
import AverageConversionComponent from "./AverageConversionComponent";
import DashboardPostedDocuments from "./DashboardPostedDocuments";
import DashboardUnPostedDocuments from "./DashboardUnpostedDocuments";
import TopTransferItemsChart from "./TopTransferItemsChart";

const DashboardComponent = () => {
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1200px)');

    return (
        <Box>
            {/* Title */}
            <Group mb={24} align="center">
                <Stack gap={8}>
                    <Title
                        order={isSmallScreen ? 3 : 2}
                        c={customStyles.colors._4D4D4D}
                        size={isSmallScreen ? 'h3' : 'h2'}
                    >
                        Dashboard
                    </Title>
                    <Text
                        mb={isSmallScreen ? 16 : 24}
                        c={customStyles.colors._909090}
                        size={isSmallScreen ? 'sm' : 'md'}
                    >
                        View, search, and manage all users by using multiple filters.
                    </Text>
                </Stack>
            </Group>

            <Stack gap={24}>
                {/* Posted Documents Cards Component */}
                <DashboardPostedDocuments />

                {/* Un Posted Documents Cards Component */}
                <DashboardUnPostedDocuments />

                {/* 2nd Last Row - Charts */}
                <Grid gutter={24}>
                    <Grid.Col span={isMediumScreen ? 12 : 6}>
                        <TopTransferItemsChart />
                    </Grid.Col>
                    <Grid.Col span={isMediumScreen ? 12 : 6}>
                        <AppUsageComponent />
                    </Grid.Col>
                </Grid>

                <AverageConversionComponent />
            </Stack>
        </Box>
    )
}

export default DashboardComponent