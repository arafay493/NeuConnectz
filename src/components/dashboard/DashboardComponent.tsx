"use client";

import { customStyles } from "@/styles/custom-theme";
import { Box, Button, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import DashboardPostedDocuments from "./DashboardPostedDocuments";
import DashboardUnPostedDocuments from "./DashboardUnpostedDocuments";
import { IconUserCircle } from "@tabler/icons-react";
import React from "react";

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

const DashboardComponent = ({ selectedUser, setDeleteModalOpened, handleOpenModal }: any) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  return (
    <Box>
      {/* Title */}
      <Group mb={24} align="center" justify="space-between">
        <Stack gap={8}>
          <Title
            order={isSmallScreen ? 3 : 2}
            c={customStyles.colors._4D4D4D}
            // size={isSmallScreen ? "h3" : "h2"}
            style={{ fontWeight: 700, fontSize: 24 }}
          >
            Home
          </Title>
          <Text
            mb={isSmallScreen ? 16 : 24}
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
