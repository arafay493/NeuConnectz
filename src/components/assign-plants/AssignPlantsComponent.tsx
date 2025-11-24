"use client";
import { fetchAllUsers } from "@/redux/actions/user-actions/user-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconPlant,
  IconSeedling,
} from "@tabler/icons-react";
import {
  PaginationState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { assignPlantsToUser, fetchListAllPlantsCodes, fetchListAllUserPlantsCodes } from "@/redux/actions/plants-actions/plants-actions";
import TanStackTable from "../tanStackTable/TanStackTable";
import PlantsList_Columns from "../columns/PlantsList_Columns";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { CLEAR_ALL_PLANTS_STATES_BY_USER } from "@/redux/reducers/plants-reducer/plants-reducer";
import UserPlantsList_Columns from "../columns/UserPlantsList_Columns";
import Loader from "../loader/loader";

const AssignPlantsComponent = () => {
  // Note: Media query to determine if the screen is small
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");

  // Note: State for selected user
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedPlants, setSelectedPlants] = useState<any>([]);
  const [transformedPlantsList, setTransformedPlantsList] = useState([])


  // Note: Dispatcher for all Actions
  const dispatch = useAppDispatch();

  // Note: Redux State
  const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
  const {
    usersList: { users, totalCount },
  } = useAppSelector(({ userStates }) => userStates);
  const {
    ListAllPlantsCodes: { data: plantsList, totalCount: plantsCount }
  } = useAppSelector(({ plantStates }) => plantStates);
  const {
    ListAllPlantsCodesByUser: { data: assignedPlantsList, totalCount: assigndPlantsCount }
  } = useAppSelector(({ plantStates }) => plantStates);
  // console.log("🚀 ~ AssignPlantsComponent ~ transformedPlantsList:", transformedPlantsList, selectedPlants, assignedPlantsList)

  // Transform users data for Select component
  const activeUsersData =
    users
      ?.filter((user) => user.isActive)
      ?.map((user) => ({
        value: user.userId,
        label: user.userName,
      })) || [];

  // Note: State for pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjusted to a more reasonable default
  });
  const [userListPagination, setUserListPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjusted to a more reasonable default
  });
  const [userAssignedPlantsPagination, setUserAssignedPlantsPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10, // Adjusted to a more reasonable default
  });

  // Pagination values for Api call
  const skipRecord = pagination.pageIndex * pagination.pageSize;
  const skipRecordUserList = userListPagination.pageIndex * userListPagination.pageSize;
  const skipAssignedPlantsUserList = userAssignedPlantsPagination.pageIndex * userAssignedPlantsPagination.pageSize;

  // Loadings States
  const [isLoading, setIsLoading] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(false);
  const [scrollItemUserListLoading, setScrollItemUserListLoading] = useState(false);

  useEffect(() => {
    if (selectedUser === null) {
      handleUserRemoved()
    }
  }, [])

  useEffect(() => {
    const assignedIds = assignedPlantsList.map((p: any) => p.id);
    const transformedAssignedList = assignedPlantsList.map((p: any) => p);
    setSelectedPlants(transformedAssignedList)

    const updatedList: any = plantsList.map((item: any) => ({
      ...item,
      allowed: assignedIds.includes(item.id),
    }));

    setTransformedPlantsList(updatedList);
  }, [assignedPlantsList]);

  useEffect(() => {
    if (authenticatedUser?.token) {
      dispatch(fetchAllUsers({
        authToken: authenticatedUser?.token as string,
        LastCount: userListPagination.pageSize,
        skipRecord: skipRecordUserList,
      })).finally(() => {
        setIsLoading(false);
      });
    }
  }, [authenticatedUser?.token, dispatch]);


  useEffect(() => {
    if (authenticatedUser?.token) {
      setIsLoading(true);
      // const skipRecord = pagination.pageIndex * pagination.pageSize;

      if (selectedUser) {
        Promise.all([
          dispatch(
            fetchListAllPlantsCodes({
              authToken: authenticatedUser?.token as string,
              lastCount: pagination.pageSize, // Use page size for server-side pagination
              skipRecords: skipRecord,
            })
          ),
          dispatch(
            fetchListAllUserPlantsCodes({
              authToken: authenticatedUser?.token as string,
              userId: selectedUser ?? null,
              // lastCount: pagination.pageSize,
              // skipRecords: skipRecord,
            })
          )
        ]).finally(() => {
          setIsLoading(false);
        });
      } else {
        dispatch(
          fetchListAllPlantsCodes({
            authToken: authenticatedUser?.token as string,
            lastCount: pagination.pageSize, // Use page size for server-side pagination
            skipRecords: skipRecord,
          })
        ).finally(() => {
          setIsLoading(false);
        });
      }

    }
  }, [authenticatedUser, dispatch, pagination.pageIndex, pagination.pageSize, selectedUser]);


  useEffect(() => {
    const assignedIds = assignedPlantsList.map((p: any) => p.id);

    const updatedList: any = plantsList.map((item: any) => ({
      ...item,
      allowed: assignedIds.includes(item.id),
    }));
    setTransformedPlantsList(updatedList);
  }, [plantsList]);

  // useEffect(() => {
  //   if (authenticatedUser?.token && selectedUser) {
  //     setIsLoading(true);
  //     // const skipRecord = userAssignedPlantsPagination.pageIndex * userAssignedPlantsPagination.pageSize;

  //     dispatch(
  //       fetchListAllUserPlantsCodes({
  //         authToken: authenticatedUser?.token as string,
  //         userId: selectedUser ?? null,
  //         lastCount: userAssignedPlantsPagination.pageSize, // Use page size for server-side pagination
  //         skipRecords: skipAssignedPlantsUserList,
  //       })
  //     ).finally(() => {
  //       setIsLoading(false);
  //     });
  //   }
  // }, [authenticatedUser, dispatch, userAssignedPlantsPagination.pageIndex, userAssignedPlantsPagination.pageSize, selectedUser]);

  // const handleSelectAllPlants = () => {
  //   const selectedPlantsId = selectedPlants.map((p: any) => p.id);
  //   const updatedList: any = transformedPlantsList.map((item: any) => ({
  //     ...item,
  //     allowed: !selectedPlantsId.includes(item.id) ? !item.allowed : item.allowed,
  //   }));
  //   console.log("🚀 ~ handleSelectAllPlants ~ transformedPlantsList:", transformedPlantsList)

  //   if (selectedPlants?.length === updatedList?.length) {
  //     setSelectedPlants([])
  //     // setTransformedPlantsList([]);
  //   } else {
  //     setSelectedPlants(updatedList)
  //     setTransformedPlantsList(updatedList);
  //   }
  // }

  const handleSelectAllPlants = () => {
    const allSelected = selectedPlants.length === transformedPlantsList.length;

    if (allSelected) {
      // Unselect all
      const unselectedList: any = transformedPlantsList.map((item: any) => ({
        ...item,
        allowed: false,
      }));
      setSelectedPlants([]);
      setTransformedPlantsList(unselectedList);
    } else {
      // Select all
      const selectedList: any = transformedPlantsList.map((item: any) => ({
        ...item,
        allowed: true,
      }));
      setSelectedPlants(selectedList);
      setTransformedPlantsList(selectedList);
    }
  };

  const handleSelectSpecificPlant = (plant: any) => {
    const updatedList: any = transformedPlantsList.map((item: any) => ({
      ...item,
      allowed: item.id === plant.id ? !item.allowed : item.allowed,
    }));

    setTransformedPlantsList(updatedList);

    if (selectedPlants.some((p: any) => p.id === plant.id)) {
      setSelectedPlants(selectedPlants.filter((p: any) => p.id !== plant.id));
    } else {
      setSelectedPlants([...selectedPlants, plant]);
    }
  };


  const columns = PlantsList_Columns({
    pagination,
    selectedUser,
    handleSelectAllPlants,
    handleSelectSpecificPlant,
    selectedPlants,
    transformedPlantsList,
  })


  const userPlantListColumns = UserPlantsList_Columns({
    pagination,
    selectedUser,
    handleSelectAllPlants,
    handleSelectSpecificPlant,
    selectedPlants,
    plantsList,
  })

  const OnScrollEndPaginateUserList = (e: any) => {
    const target = e.currentTarget;
    const hasMore = users?.length < totalCount;
    const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
    if (hasMore && reachedBottom) {
      // const newSkip = (pagination.pageIndex + 1) * pagination.pageSize;
      setScrollItemUserListLoading(true)
      const newSkip = 0;
      setUserListPagination((prev) => ({
        pageSize: prev.pageSize + 5,
        pageIndex: prev.pageIndex + 1,
      }));
      dispatch(fetchAllUsers({
        authToken: authenticatedUser?.token as string,
        LastCount: userListPagination.pageSize,
        skipRecord: skipRecordUserList,
      })).finally(() => {
        setScrollItemUserListLoading(false)
      });
    }
  }

  const handleSelectUser = (value: string) => {
    // console.log("🚀 ~ handleSelectUser ~ value:", value, transformedPlantsList, assignedPlantsList)
    setSelectedUser(value ?? "")
    // dispatch(CLEAR_ALL_PLANTS_STATES_BY_USER())
  }

  const handleUserRemoved = () => {
    dispatch(CLEAR_ALL_PLANTS_STATES_BY_USER())
    setSelectedPlants([])
    setSelectedUser(null)
  }

  const handleResponse = (data: any) => {
    showNotificationToast("Plant Assigned", data.message, customStyles.colors._408CCE);
    dispatch(
      fetchListAllPlantsCodes({
        authToken: authenticatedUser?.token as string,
        lastCount: pagination.pageSize, // Use page size for server-side pagination
        skipRecords: skipRecord,
      })
    )
    dispatch(
      fetchListAllUserPlantsCodes({
        authToken: authenticatedUser?.token as string,
        userId: selectedUser ?? null,
        // lastCount: userAssignedPlantsPagination.pageSize, // Use page size for server-side pagination
        // skipRecords: skipRecord,
      })
    ).finally(() => {
      setIsLoading(false);
    });
  }

  const handleAssignPlants = () => {
    setIsMainLoading(true)
    const payload = {
      userId: selectedUser ?? null,
      plantIds: selectedPlants.map((plant: any) => plant.id)
    }
    dispatch(
      assignPlantsToUser({
        token: authenticatedUser?.token as string,
        payload,
        resHandler: handleResponse,
      })
    ).finally(() => {
      setIsMainLoading(false)
    })
  };

  const handleAssignAllPlants = () => {
    setIsMainLoading(true)
    const payload = {
      userId: selectedUser ?? null,
      plantIds: plantsList.map((plant: any) => plant.id)
    }
    dispatch(
      assignPlantsToUser({
        token: authenticatedUser?.token as string,
        payload,
        resHandler: handleResponse,
      })
    ).finally(() => {
      setIsMainLoading(false)
    })
  };

  if (isMainLoading) {
    return <Loader loadingState={isMainLoading} />
  }

  return (
    <Box>
      <Title
        mb={8}
        order={isSmallScreen ? 3 : 2}
        c={customStyles.colors._4D4D4D}
        // size={isSmallScreen ? "h3" : "h2"}
        style={{ fontWeight: 700, fontSize: 24 }}
      >
        Assign Plants
      </Title>
      <Text
        mb={isSmallScreen ? 16 : 24}
        c={customStyles.colors._909090}
        // size={isSmallScreen ? "sm" : "md"}
        style={{ fontWeight: 500, fontSize: 16 }}
      >
        Select user to assign plants
      </Text>

      {/* Search Bar */}
      <Group
        p={isSmallScreen ? 16 : 24}
        justify={
          isSmallScreen ? "flex-start" : customStyles.alignment.spaceBetween
        }
        align={isSmallScreen ? "stretch" : "flex-end"}
        bg={customStyles.colors.white}
        style={{ borderRadius: "16px" }}
        wrap="wrap"
        gap={isSmallScreen ? 16 : 24}
      >
        <Group
          w={isSmallScreen ? "100%" : "auto"}
          justify={isSmallScreen ? "center" : "flex-start"}
          wrap="wrap"
          gap={isSmallScreen ? 12 : 16}
        >
          <Stack
            gap={4}
            w={
              isSmallScreen
                ? "100%"
                : isMediumScreen
                  ? "48%"
                  : isLargeScreen
                    ? 300
                    : 250
            }
            maw={isSmallScreen ? "100%" : 350}
          >
            <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>
              Select User
            </Text>
            <Select
              placeholder="Select User"
              data={activeUsersData}
              value={selectedUser}
              // onChange={(value: any) => handleSelectUser(value)}
              onChange={(value: any) => {
                if (value === null) {
                  handleUserRemoved();
                } else {
                  handleSelectUser(value);
                }
              }}
              clearable
              w="100%"
              radius={8}
              size={isSmallScreen ? "sm" : "md"}
              rightSection={scrollItemUserListLoading ? <FadeLoader
                height={15}
                width={3}
                margin={1}
                radius={1}
                color="#1b59f8" /> : null}
              scrollAreaProps={{
                onScrollEndCapture: (e) => OnScrollEndPaginateUserList(e),
              }}
            />
          </Stack>
        </Group>
        <Group>
          <Button
            variant="transparent"
            // className={!selectedUser ? "filledDisabledButton" : "filledButton"}
            className={"outlineButton"}
            radius={8}
            size={isSmallScreen ? "sm" : "md"}
            leftSection={<IconPlant size={isSmallScreen ? 20 : 24} />}
            onClick={handleAssignAllPlants}
            disabled={!selectedUser}
            w={isSmallScreen ? "100%" : "auto"}
            mt={isSmallScreen ? 16 : 0}
          >
            {isSmallScreen ? "Assign All" : "Assign All Plants"}
          </Button>
          <Button
            variant="transparent"
            className={!selectedUser ? "filledDisabledButton" : "filledButton"}
            radius={8}
            size={isSmallScreen ? "sm" : "md"}
            leftSection={<IconSeedling size={isSmallScreen ? 20 : 24} />}
            onClick={handleAssignPlants}
            disabled={!selectedUser && selectedPlants?.length > 0}
            w={isSmallScreen ? "100%" : "auto"}
            mt={isSmallScreen ? 16 : 0}
          >
            {isSmallScreen ? "Assign" : "Assign Plants"}
          </Button>
        </Group>
      </Group>

      {/* Table */}
      {/* {assignedPlantsList?.length === 0 ? <TanStackTable
        data={Array.isArray(plantsList) ? plantsList : []}
        dataCount={plantsList?.length}
        columns={columns}
        isLoading={isLoading}
        isInsideModalTable={true}
        pagination={pagination}
        setPagination={setPagination}
        title={"Assign Plants"}
        subTitle={"Select user to assign plants"}
        skipRecord={skipRecord}
      /> : < TanStackTable
        data={Array.isArray(assignedPlantsList) ? assignedPlantsList : []}
        dataCount={assignedPlantsList?.length}
        columns={userPlantListColumns}
        isLoading={isLoading}
        isInsideModalTable={true}
        pagination={userAssignedPlantsPagination}
        setPagination={setUserAssignedPlantsPagination}
        title={"Assign Plants"}
        subTitle={"Select user to assign plants"}
        skipRecord={skipAssignedPlantsUserList}
      />} */}

      {/* Table */}
      <TanStackTable
        data={Array.isArray(transformedPlantsList) ? transformedPlantsList : []}
        dataCount={plantsCount}
        columns={columns}
        isLoading={isLoading}
        isInsideModalTable={true}
        pagination={pagination}
        setPagination={setPagination}
        title={"Assign Plants"}
        subTitle={"Select user to assign plants"}
        skipRecord={skipRecord}
      />
    </Box>
  );
};

export default AssignPlantsComponent;
