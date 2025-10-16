"use client";

import { customStyles } from "@/styles/custom-theme";
import { Box, Button, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DashboardPostedDocuments from "./DashboardPostedDocuments";
import DashboardUnPostedDocuments from "./DashboardUnpostedDocuments";
import { IconUserCircle } from "@tabler/icons-react";
import React from "react";
import DashboardTitleBar from "./DashboardTitleBar";

interface User {
  userId: string;
  userName: string;
  email: string;
  role: string;
  phone: string;
  department: string;
  isActive: boolean;
}

interface SelectedUserProps {
  userId: string,
  userName: string,
  email: string,
  phone: string,
  department: string,
  role: string,
  createdBy: string,
  updatedBy: string,
  createdDate: string,
  updatedDate: string,
  isActive: boolean
}

const DashboardComponent = ({ selectedUser, setDeleteModalOpened, handleOpenModal, dashboard }: any) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <Box>
      {/* Title */}
      <DashboardTitleBar dashboard={dashboard} selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} />

      <Stack gap={24}>
        {/* Posted Documents Cards Component */}
        <DashboardPostedDocuments />

        {/* Un Posted Documents Cards Component */}
        <DashboardUnPostedDocuments />

        {/* 2nd Last Row - Charts */}
        {/* <Grid gutter={24}>
          <Grid.Col span={isMediumScreen ? 12 : 6}>
            <TopTransferItemsChart />
          </Grid.Col>
          <Grid.Col span={isMediumScreen ? 12 : 6}>
            <AppUsageComponent />
          </Grid.Col>
        </Grid> */}

        {/* <AverageConversionComponent /> */}
      </Stack>
    </Box>
  );
};

export default React.memo(DashboardComponent);
