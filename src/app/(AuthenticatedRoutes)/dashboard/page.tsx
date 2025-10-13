// Note: Dashboard screen...!
"use client"
import React, { useEffect, useState } from "react";
import { DashboardComponent } from "@/components/dashboard";
import ITR_DashboardComponent from "@/components/dashboard/ITR_DashboardComponent";
import { fetchAllUsers } from "@/redux/actions/user-actions/user-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { PaginationState } from "@tanstack/react-table";
import { fetchDashboardAnalytics } from "@/redux/actions/dashboard-actions/dashboard-actions";
import SelectUserModal from "@/components/modals/select-user-modal/SelectUserModal";
import DeleteModal from "@/components/modals/delete-modal/DeleteModal";

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
  const [dashboard, setDashboard] = useState("dashboard")
  const [selectedUser, setSelectedUser] = useState<SelectedUserProps | null>(null);
  const [opened, setOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
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


  return (
    <>
      {dashboard === "dashboard" && <DashboardComponent selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} />}
      {dashboard === "ITR_Dashboard" && <ITR_DashboardComponent selectedUser={selectedUser} setDeleteModalOpened={setDeleteModalOpened} handleOpenModal={handleOpenModal} />}

      {/* Modals */}
      <SelectUserModal
        opened={opened}
        handleModalClose={() => setOpened(false)}
        users={usersList?.users || []}
        selectedUser={selectedUser}
        handleSelectUser={handleSelectUser}
        handleShowDashboard={handleShowDashboard}
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
    // <Box>
    //   {/* Note: Dashboard cards component */}
    //   <DashboardsCards />

    //   {/* Note: Progress bar component */}
    //   <Box style={{ padding: "15px 0px" }}>
    //     <SimpleGrid
    //       cols={{ base: 1, sm: 2, md: 2 }}
    //       spacing={customStyles.deviceSize.lg}
    //       verticalSpacing={customStyles.deviceSize.lg}
    //     >
    //       {/* App Usage Card */}
    //       <ProgressBarCard
    //         title="App Usage"
    //         completedRatio="60%"
    //         remainingRatio="12%"
    //         color={customStyles.colors.green}
    //       />

    //       {/* Active Warehouse Staff Card */}
    //       <ProgressBarCard
    //         title="Active Warehouse Staff"
    //         completedRatio="80"
    //         color={customStyles.colors._1B59F8}
    //       />
    //     </SimpleGrid>
    //   </Box>

    //   {/* Note: Bar chart component */}
    //   <BarChart />

    //   {/* Note: Footer charts */}
    //   <Box style={{ padding: "15px 0px" }}>
    //     <SimpleGrid
    //       cols={{ base: 1, sm: 2, md: 2 }}
    //       spacing={customStyles.deviceSize.lg}
    //       verticalSpacing={customStyles.deviceSize.lg}
    //       style={{ justifyContent: "space-between" }}
    //     >
    //       {/* Product Stacked Bar Chart */}
    //       <ProductStackedBarChart />

    //       {/* Donut Chart */}
    //       <DonutChart />
    //     </SimpleGrid>
    //   </Box>
    // </Box>
  );
};

export default DashboardScreen;
