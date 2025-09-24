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
import { useEffect, useState } from "react";
import { fetchDashboardAnalytics } from "@/redux/actions/dashboard-actions/dashboard-actions";
import { IconUserCircle, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import SelectUserModal from "../modals/select-user-modal/SelectUserModal";
import { PaginationState } from "@tanstack/react-table";
import { fetchAllUsers } from "@/redux/actions/user-actions/user-actions";

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

const DashboardComponent = () => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(max-width: 1200px)");
  const {
    usersList
  } = useAppSelector(({ userStates }) => userStates);
  // Note: State for pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Note: Router for switch page
  const route = useRouter();

  const [opened, setOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  // const [selectedUser, setSelectedUser] = useState<SelectedUserProps | null>(null);
  const [selectedUser, setSelectedUser] = useState<SelectedUserProps | null>(null);

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => {
    return authStates;
  });

  // useEffect(() => {
  //   if (authenticatedUser && selectedUser?.userId) {
  //     dispatch(
  //       fetchDashboardAnalytics({
  //         authToken: authenticatedUser?.token,
  //         userId: selectedUser?.userId,
  //       })
  //     );
  //   }else if (authenticatedUser){
  //     dispatch(fetchDashboardAnalytics({ authToken: authenticatedUser?.token }));
  //   }
  // }, [authenticatedUser, selectedUser?.userId, dispatch]);

  useEffect(() => {
    if (!authenticatedUser) return;

    dispatch(
      fetchDashboardAnalytics({
        authToken: authenticatedUser.token,
        userId: selectedUser?.userId,
      })
    );
  }, [authenticatedUser, selectedUser?.userId, dispatch]);

  const handleOpenModal = () => {
    if (authenticatedUser) {
      setOpened(true)
      setIsLoading(true)
      const skipRecord = pagination.pageIndex * pagination.pageSize;

      dispatch(
        fetchAllUsers({
          authToken: authenticatedUser?.token,
          // LastCount: pagination.pageSize,
          // skipRecord: skipRecord,
        })
      ).finally(() => {
        setIsLoading(false);
      });
    }
  }

  const handleNext = () => {

  }

  const handlePrevious = () => {

  }

  const handleSelectUser = (user: any) => {
    // setSelectedUser((prevState: any) => {
    //     const userExist = prevState.find((item: any) => item.userId === user.userId);
    //     if (userExist) {
    //         return prevState.filter((item: any) => item.userId !== user.userId);
    //     }
    //     return [...prevState, user];
    // });
    setSelectedUser((prevState: any) => prevState?.userId === user?.userId ? null : user);
  };

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
        <Stack gap={8}>
          <Button
            leftSection={<IconUserCircle size={24} />}
            // className="filledButton"
            color="gray"
            size="md"
            radius={8}
            onClick={handleOpenModal}
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

      {/* Modals */}
      <SelectUserModal
        opened={opened}
        handleModalClose={() => setOpened(false)}
        users={usersList?.users || []}
        selectedUser={selectedUser}
        handleSelectUser={handleSelectUser}
      />
    </Box>
  );
};

export default DashboardComponent;
