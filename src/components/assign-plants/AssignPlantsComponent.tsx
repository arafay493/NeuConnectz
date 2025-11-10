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
import { fetchListAllPlantsCodes } from "@/redux/actions/plants-actions/plants-actions";
import TanStackTable from "../tanStackTable/TanStackTable";
import PlantsList_Columns from "../columns/PlantsList_Columns";

// const plantsCount = 50
// const plantsList = [
//   { "id": "1", "plantCode": "1100", "plantName": "Head Office", "companyCode": "1100" },
//   { "id": "2", "plantCode": "1200", "plantName": "Gadoon", "companyCode": "1100" },
//   { "id": "3", "plantCode": "1300", "plantName": "Hub", "companyCode": "1100" },
//   { "id": "4", "plantCode": "1400", "plantName": "Virtual Plant", "companyCode": "1100" },
//   { "id": "5", "plantCode": "1500", "plantName": "Testing Plant", "companyCode": "1222" },
//   { "id": "6", "plantCode": "1600", "plantName": "Karachi Port", "companyCode": "1200" },
//   { "id": "7", "plantCode": "1700", "plantName": "Lahore Plant", "companyCode": "1300" },
//   { "id": "8", "plantCode": "1800", "plantName": "Faisalabad Unit", "companyCode": "1300" },
//   { "id": "9", "plantCode": "1900", "plantName": "Rawalpindi Depot", "companyCode": "1400" },
//   { "id": "10", "plantCode": "2000", "plantName": "Multan Plant", "companyCode": "1400" },
//   { "id": "11", "plantCode": "2100", "plantName": "Hyderabad Plant", "companyCode": "1500" },
//   { "id": "12", "plantCode": "2200", "plantName": "Peshawar Depot", "companyCode": "1500" },
//   { "id": "13", "plantCode": "2300", "plantName": "Quetta Branch", "companyCode": "1600" },
//   { "id": "14", "plantCode": "2400", "plantName": "Sukkur Plant", "companyCode": "1600" },
//   { "id": "15", "plantCode": "2500", "plantName": "Nawabshah Unit", "companyCode": "1700" },
//   { "id": "16", "plantCode": "2600", "plantName": "Mirpurkhas Plant", "companyCode": "1700" },
//   { "id": "17", "plantCode": "2700", "plantName": "Sialkot Plant", "companyCode": "1800" },
//   { "id": "18", "plantCode": "2800", "plantName": "Gujranwala Plant", "companyCode": "1800" },
//   { "id": "19", "plantCode": "2900", "plantName": "Kasur Unit", "companyCode": "1900" },
//   { "id": "20", "plantCode": "3000", "plantName": "Sheikhupura Plant", "companyCode": "1900" },
//   { "id": "21", "plantCode": "3100", "plantName": "Sahiwal Depot", "companyCode": "2000" },
//   { "id": "22", "plantCode": "3200", "plantName": "Okara Plant", "companyCode": "2000" },
//   { "id": "23", "plantCode": "3300", "plantName": "Muridke Plant", "companyCode": "2100" },
//   { "id": "24", "plantCode": "3400", "plantName": "Mardan Plant", "companyCode": "2100" },
//   { "id": "25", "plantCode": "3500", "plantName": "Swabi Depot", "companyCode": "2200" },
//   { "id": "26", "plantCode": "3600", "plantName": "Attock Plant", "companyCode": "2200" },
//   { "id": "27", "plantCode": "3700", "plantName": "Gwadar Unit", "companyCode": "2300" },
//   { "id": "28", "plantCode": "3800", "plantName": "Thar Plant", "companyCode": "2300" },
//   { "id": "29", "plantCode": "3900", "plantName": "Jacobabad Plant", "companyCode": "2400" },
//   { "id": "30", "plantCode": "4000", "plantName": "Turbat Plant", "companyCode": "2400" }
// ]

// const totalCount = 500
// const users = [
//   {
//     "userId": "MMlFCWxP8T",
//     "userName": "user_327590",
//     "email": "user327590@testmail.com",
//     "phone": "+929893550003",
//     "department": "Production",
//     "role": "ProductionManager",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-10-27T12:58:47.458968Z",
//     "updatedDate": "2025-10-27T12:58:47.458968Z",
//     "isActive": true
//   },
//   {
//     "userId": "ABx7PQwL9R",
//     "userName": "user_412365",
//     "email": "user412365@testmail.com",
//     "phone": "+929893550004",
//     "department": "Finance",
//     "role": "Accountant",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-10-28T09:20:15.125478Z",
//     "updatedDate": "2025-10-28T09:20:15.125478Z",
//     "isActive": true
//   },
//   {
//     "userId": "YZr8LKtF6M",
//     "userName": "user_583920",
//     "email": "user583920@testmail.com",
//     "phone": "+929893550005",
//     "department": "HR",
//     "role": "HRExecutive",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-10-28T11:10:47.987654Z",
//     "updatedDate": "2025-10-28T11:10:47.987654Z",
//     "isActive": false
//   },
//   {
//     "userId": "PLm9VXeR4S",
//     "userName": "user_294710",
//     "email": "user294710@testmail.com",
//     "phone": "+929893550006",
//     "department": "Maintenance",
//     "role": "Technician",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-10-29T08:15:11.998741Z",
//     "updatedDate": "2025-10-29T08:15:11.998741Z",
//     "isActive": true
//   },
//   {
//     "userId": "TRq2BNyU7J",
//     "userName": "user_173820",
//     "email": "user173820@testmail.com",
//     "phone": "+929893550007",
//     "department": "IT",
//     "role": "SoftwareEngineer",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-10-30T10:22:01.123654Z",
//     "updatedDate": "2025-10-30T10:22:01.123654Z",
//     "isActive": true
//   },
//   {
//     "userId": "GHk5SWoE3L",
//     "userName": "user_918253",
//     "email": "user918253@testmail.com",
//     "phone": "+929893550008",
//     "department": "Sales",
//     "role": "SalesManager",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-10-31T14:45:29.441123Z",
//     "updatedDate": "2025-10-31T14:45:29.441123Z",
//     "isActive": false
//   },
//   {
//     "userId": "JKl3ERuN2P",
//     "userName": "user_839201",
//     "email": "user839201@testmail.com",
//     "phone": "+929893550009",
//     "department": "Logistics",
//     "role": "DispatchOfficer",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-11-01T09:35:59.785432Z",
//     "updatedDate": "2025-11-01T09:35:59.785432Z",
//     "isActive": true
//   },
//   {
//     "userId": "VWx1HQpZ6T",
//     "userName": "user_729384",
//     "email": "user729384@testmail.com",
//     "phone": "+929893550010",
//     "department": "Procurement",
//     "role": "ProcurementOfficer",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-11-02T07:22:10.547321Z",
//     "updatedDate": "2025-11-02T07:22:10.547321Z",
//     "isActive": true
//   },
//   {
//     "userId": "BNm8TYrQ9C",
//     "userName": "user_581739",
//     "email": "user581739@testmail.com",
//     "phone": "+929893550011",
//     "department": "Research",
//     "role": "LabTechnician",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-11-03T10:18:21.894512Z",
//     "updatedDate": "2025-11-03T10:18:21.894512Z",
//     "isActive": false
//   },
//   {
//     "userId": "CXs4LOmK5D",
//     "userName": "user_987654",
//     "email": "user987654@testmail.com",
//     "phone": "+929893550012",
//     "department": "Quality Control",
//     "role": "QCInspector",
//     "createdBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "updatedBy": "83991774-3fde-5d21-c442-de2d76f588f1",
//     "createdDate": "2025-11-04T13:59:10.445123Z",
//     "updatedDate": "2025-11-04T13:59:10.445123Z",
//     "isActive": true
//   }
// ]



const AssignPlantsComponent = () => {
  // Note: Media query to determine if the screen is small
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");

  // Note: State for selected user
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedPlants, setSelectedPlants] = useState<any>([]);


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

  // Pagination values for Api call
  const skipRecord = pagination.pageIndex * pagination.pageSize;
  const skipRecordUserList = userListPagination.pageIndex * userListPagination.pageSize;

  // Loadings States
  const [isLoading, setIsLoading] = useState(false);
  const [scrollItemUserListLoading, setScrollItemUserListLoading] = useState(false);

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
      const skipRecord = pagination.pageIndex * pagination.pageSize;

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
  }, [authenticatedUser, dispatch, pagination.pageIndex, pagination.pageSize]);

  const handleSelectAllPlants = () => {
    if (selectedPlants?.length === plantsList?.length) {
      setSelectedPlants([])
    } else {
      setSelectedPlants(plantsList)
    }
  }

  const handleSelectSpecificPlant = (plant: any) => {
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

  // const handleAssignGroups = () => {
  //   dispatch(
  //     assignGroupToUser({
  //       token: authenticatedUser?.token as string,
  //       addGroupToUserData: groupPermission!,
  //       resHandler: handleResponse,
  //     })
  //   );
  // };

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
              onChange={(value) => setSelectedUser(value ?? "")}
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
            // onClick={handleAssignGroups}
            // disabled={!selectedUser}
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
            // onClick={handleAssignGroups}
            disabled={!selectedUser && selectedPlants?.length > 0}
            w={isSmallScreen ? "100%" : "auto"}
            mt={isSmallScreen ? 16 : 0}
          >
            {isSmallScreen ? "Assign" : "Assign Plants"}
          </Button>
        </Group>
      </Group>

      {/* Table */}
      <TanStackTable
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
      />
    </Box>
  );
};

export default AssignPlantsComponent;
