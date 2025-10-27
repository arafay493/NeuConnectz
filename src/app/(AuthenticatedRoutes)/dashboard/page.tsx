// Note: Dashboard screen...!
"use client"
import React, { useCallback, useEffect, useState } from "react";
import { DashboardComponent } from "@/components/dashboard";
import ITR_DashboardComponent from "@/components/dashboard/ITR_DashboardComponent";
import { fetchAllUsers } from "@/redux/actions/user-actions/user-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { PaginationState } from "@tanstack/react-table";
import { fetchDashboardAnalytics } from "@/redux/actions/dashboard-actions/dashboard-actions";
import SelectUserModal from "@/components/modals/select-user-modal/SelectUserModal";
import DeleteModal from "@/components/modals/delete-modal/DeleteModal";
import { Box, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import { customStyles } from "@/styles/custom-theme";
import { useMediaQuery } from "@mantine/hooks";
import DashboardTitleBar from "@/components/dashboard/DashboardTitleBar";
import TR_DashboardComponent from "@/components/dashboard/TR_DashboardComponent";

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

const DashboardScreen = () => {
  const [dashboard, setDashboard] = useState("Transfer Request")
  const [selectedUser, setSelectedUser] = useState<SelectedUserProps | null>(null);
  const [opened, setOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [tab, setTab] = useState<'Select User' | 'Select Dashboard'>('Select User');
  const [isLoading, setIsLoading] = useState(false)
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  // Note: State for pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();
  const { authenticatedUser } = useAppSelector(({ authStates }) => {
    return authStates;
  });
  const { usersList } = useAppSelector(({ userStates }) => userStates);

  useEffect(() => {
    if (!authenticatedUser) return;

    dispatch(
      fetchDashboardAnalytics({
        authToken: authenticatedUser.token,
        userId: selectedUser?.userId,
      })
    ).finally(() => {
      setOpened(false)
    });
  }, [authenticatedUser, selectedUser?.userId, dispatch]);


  const handleShowDashboard = (val: string) => {
    setDashboard(val)
    setOpened(false)
    setTab("Select User")
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
    setDashboard("Home")
  };

  const handleOpenModal = useCallback(() => {
    if (authenticatedUser) {
      setOpened(true);
      setIsLoading(true);
      //     const skipRecord = pagination.pageIndex * pagination.pageSize;

      dispatch(fetchAllUsers({
        authToken: authenticatedUser?.token,
        //         // LastCount: pagination.pageSize,
        //         // skipRecord: skipRecord,
      })).finally(() => setIsLoading(false));
    }
  }, [authenticatedUser, dispatch]);

  const handleModalClose = () => {
    setOpened(false)
    setTab("Select User")
  }

  const handleNext = () => {

  }

  const handlePrevious = () => {

  }

  const options = [
    "Home",
    "Inventory Transfer Request",
    "Transfer Request",
  ];


  return (
    <>
      {dashboard === "Home" && <DashboardComponent selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} dashboard={dashboard} />}
      {dashboard === "Inventory Transfer Request" && <ITR_DashboardComponent selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} dashboard={dashboard} />}
      {dashboard === "Transfer Request" && <TR_DashboardComponent selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} dashboard={dashboard} />}

      {/* For Empty Dashboard Screen */}
      {!options.includes(dashboard) && (
          <Box>
            <DashboardTitleBar dashboard={dashboard} selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} />
            <Box style={{ textAlign: "center", padding: "60px", color: "#909090" }}>
              <Text>{dashboard || "Unknown"} Dashboard Coming Soon</Text>
            </Box>
          </Box>
        )}

      {/* Modals */}
      <SelectUserModal
        opened={opened}
        handleModalClose={handleModalClose}
        users={usersList?.users || []}
        selectedUser={selectedUser}
        handleSelectUser={handleSelectUser}
        handleShowDashboard={handleShowDashboard}
        dashboard={dashboard}
        tab={tab}
        setTab={setTab}
      />
      <DeleteModal
        opened={deleteModalOpened}
        handleModalClose={() => setDeleteModalOpened(false)}
        handleConfirm={() => {
          setDeleteModalOpened(false)
          setSelectedUser(null)
        }}
        handleCancel={() => setDeleteModalOpened(false)}
        description={"Exiting the selected user will take you back to the general dashboard. Do you want to continue?"}
      />
    </>
  );
};

export default DashboardScreen;
