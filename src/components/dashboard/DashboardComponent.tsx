"use client";

import { customStyles } from "@/styles/custom-theme";
import { Box, Button, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import AppUsageComponent from "./AppUsageComponent";
import AverageConversionComponent from "./AverageConversionComponent";
import DashboardPostedDocuments from "./DashboardPostedDocuments";
import DashboardUnPostedDocuments from "./DashboardUnpostedDocuments";
import TopTransferItemsChart from "./TopTransferItemsChart";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { fetchDashboardAnalytics } from "@/redux/actions/dashboard-actions/dashboard-actions";
import { IconUserCircle, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const DashboardComponent = () => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(max-width: 1200px)");

  // Note: Router for switch page
  const route = useRouter();

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => {
    return authStates;
  });
  const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => {
    return dashboardStates;
  });
  console.log(
    "🚀 ~ DashboardComponent ~ dashboardAnalyticsData:",
    dashboardAnalyticsData
  );

  // Note: Fetching dashboard analytics on component mount...!
  useEffect(() => {
    if (authenticatedUser)
      dispatch(fetchDashboardAnalytics(authenticatedUser.token));
  }, []);

  return (
    <Box>
      {/* Title */}
      <Group mb={24} align="center" justify="space-between">
        <Stack gap={8}>
          <Title
            order={isSmallScreen ? 3 : 2}
            c={customStyles.colors._4D4D4D}
            size={isSmallScreen ? "h3" : "h2"}
          >
            Home
          </Title>
          <Text
            mb={isSmallScreen ? 16 : 24}
            c={customStyles.colors._909090}
            size={isSmallScreen ? "sm" : "md"}
          >
            Dashboard
          </Text>
        </Stack>
        <Stack gap={8}>
          <Button
            leftSection={<IconUserCircle size={24} />}
            // className="filledButton"
            color="gray"
            size="md"
            radius={8}
            onClick={() => route.push("/")}

          >
            Select User
          </Button>
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
  );
};

export default DashboardComponent;
