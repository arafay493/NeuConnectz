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
    IconBuildingWarehouse,
} from "@tabler/icons-react";
import {
    PaginationState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";
import { fetchListAllPlantsCodes } from "@/redux/actions/plants-actions/plants-actions";
import TanStackTable from "../tanStackTable/TanStackTable";
import WarehouseList_Columns from "../columns/WarehouseList_Columns";
import { assignWareHouseToUser, fetchAllWareHouses } from "@/redux/actions/warehouse-actions/warehouse-actions";
import showNotificationToast from "@/lib/notification-toast/notification-toast";

const plantsCount = 50
const warehouseList = [
    {
        "id": "1",
        "whsCode": "W-KHI-KG",
        "whsName": "Main Warehouse - Korangi",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "2",
        "whsCode": "W-KHI-HB",
        "whsName": "Madni Warehouse - Hawke's Bay",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "3",
        "whsCode": "W-KHI-NZ",
        "whsName": "North Zone Warehouse - Karachi",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "4",
        "whsCode": "W-KHI-PECHS",
        "whsName": "Distribution Hub - PECHS",
        "isReceiver": false,
        "binActivat": "tYES"
    },
    {
        "id": "5",
        "whsCode": "W-KHI-PORT",
        "whsName": "Port Terminal Warehouse",
        "isReceiver": true,
        "binActivat": "tNO"
    },
    {
        "id": "6",
        "whsCode": "W-RM-KG",
        "whsName": "Raw Material Warehouse KG",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "7",
        "whsCode": "W-FG-SM",
        "whsName": "Finished Good Warehouse SM",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "8",
        "whsCode": "W-PL-SM",
        "whsName": "Plates Warehouse SM",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "9",
        "whsCode": "W-GW-SM",
        "whsName": "General Warehouse SM",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "10",
        "whsCode": "W-RM-SM",
        "whsName": "Raw Material Warehouse SM",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "11",
        "whsCode": "W-SKR-01",
        "whsName": "Main Warehouse - Sukkur",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "12",
        "whsCode": "W-SKR-FG",
        "whsName": "Finished Goods - Sukkur",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "13",
        "whsCode": "W-LHR-01",
        "whsName": "Main Warehouse - Lahore",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "14",
        "whsCode": "W-LHR-RM",
        "whsName": "Raw Material Warehouse - Lahore",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "15",
        "whsCode": "W-LHR-FG",
        "whsName": "Finished Goods - Lahore",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "16",
        "whsCode": "W-FSD-01",
        "whsName": "Main Warehouse - Faisalabad",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "17",
        "whsCode": "W-FSD-RM",
        "whsName": "Raw Material Warehouse - Faisalabad",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "18",
        "whsCode": "W-FSD-FG",
        "whsName": "Finished Goods - Faisalabad",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "19",
        "whsCode": "W-ISB-01",
        "whsName": "Main Warehouse - Islamabad",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "20",
        "whsCode": "W-ISB-DIST",
        "whsName": "Distribution Warehouse - Islamabad",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "21",
        "whsCode": "W-PSH-01",
        "whsName": "Main Warehouse - Peshawar",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "22",
        "whsCode": "W-PSH-RM",
        "whsName": "Raw Material Warehouse - Peshawar",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "23",
        "whsCode": "W-PSH-FG",
        "whsName": "Finished Goods - Peshawar",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "24",
        "whsCode": "W-MUL-01",
        "whsName": "Main Warehouse - Multan",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "25",
        "whsCode": "W-MUL-FG",
        "whsName": "Finished Goods - Multan",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "26",
        "whsCode": "W-QTA-01",
        "whsName": "Main Warehouse - Quetta",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "27",
        "whsCode": "W-QTA-FG",
        "whsName": "Finished Goods - Quetta",
        "isReceiver": true,
        "binActivat": "tYES"
    },
    {
        "id": "28",
        "whsCode": "W-ST-01",
        "whsName": "Stock In Transit",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "29",
        "whsCode": "W-PRD-SM",
        "whsName": "Production Floor - Sabzi Mandi",
        "isReceiver": false,
        "binActivat": "tNO"
    },
    {
        "id": "30",
        "whsCode": "W-DIST-KHI",
        "whsName": "Distribution Warehouse - Karachi",
        "isReceiver": true,
        "binActivat": "tYES"
    }
]

const AssignWarehouseComponent = () => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    const isMediumScreen = useMediaQuery("(max-width: 1024px)");
    const isLargeScreen = useMediaQuery("(min-width: 1200px)");

    // Note: State for selected user
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedWarehousesAllow, setSelectedWarehousesAllow] = useState<any>([]);
    const [selectedWarehousesReceive, setSelectedWarehousesReceive] = useState<any>([]);


    // Note: Dispatcher for all Actions
    const dispatch = useAppDispatch();

    // Note: Redux State
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
    const {
        usersList: { users, totalCount },
    } = useAppSelector(({ userStates }) => userStates);
    const {
        wareHousesList: { data: warehouseList, totalCount: warehouseCount }
    } = useAppSelector(({ wareHouseStates }) => wareHouseStates);
    console.log("🚀 ~ AssignWarehouseComponent ~ wareHousesList:", warehouseList)

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
            // const skipRecord = pagination.pageIndex * pagination.pageSize;

            dispatch(
                fetchAllWareHouses({
                    authToken: authenticatedUser?.token as string,
                    lastCount: pagination.pageSize, // Use page size for server-side pagination
                    skipRecords: skipRecord,
                })
            ).finally(() => {
                setIsLoading(false);
            });
        }
    }, [authenticatedUser, dispatch, pagination.pageIndex, pagination.pageSize]);

    const handleSelectAllWarehousesAllow = () => {
        if (selectedWarehousesAllow?.length === warehouseList?.length) {
            setSelectedWarehousesAllow([])
            setSelectedWarehousesReceive([])
        } else {
            setSelectedWarehousesAllow(warehouseList)
        }
    }

    const handleSelectSpecificWarehouseAllow = (warehouse: any) => {
        if (selectedWarehousesAllow.some((p: any) => p.id === warehouse.id)) {
            setSelectedWarehousesAllow(selectedWarehousesAllow.filter((p: any) => p.id !== warehouse.id));
        } else {
            setSelectedWarehousesAllow([...selectedWarehousesAllow, warehouse]);
        }
        if (selectedWarehousesAllow.includes(warehouse)) {
            setSelectedWarehousesReceive(selectedWarehousesReceive.filter((p: any) => p.id !== warehouse.id));
        }
    };

    const handleSelectAllWarehousesReciever = () => {
        if (selectedWarehousesReceive?.length === warehouseList?.length) {
            setSelectedWarehousesReceive([])
        } else {
            setSelectedWarehousesReceive(warehouseList)
        }
    }

    const handleSelectSpecificWarehouseReciever = (warehouse: any) => {
        if (selectedWarehousesReceive.some((p: any) => p.id === warehouse.id)) {
            setSelectedWarehousesReceive(selectedWarehousesReceive.filter((p: any) => p.id !== warehouse.id));
        } else {
            setSelectedWarehousesReceive([...selectedWarehousesReceive, warehouse]);
        }
    };


    const columns = WarehouseList_Columns({
        pagination,
        selectedUser,
        handleSelectAllWarehousesAllow,
        handleSelectSpecificWarehouseAllow,
        handleSelectAllWarehousesReciever,
        handleSelectSpecificWarehouseReciever,
        selectedWarehousesAllow,
        selectedWarehousesReceive,
        warehouseList,
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

    const handleResponse = (data: any) => {
        showNotificationToast("Warehouses Assigned", data.message, customStyles.colors._408CCE);
        dispatch(
            fetchAllWareHouses({
                authToken: authenticatedUser?.token as string,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecord,
            })
        ).finally(() => {
            setSelectedWarehousesAllow([])
            setSelectedWarehousesReceive([])
            setSelectedUser(null)
            setIsLoading(false);
        });
    }

    const handleAssignWarehouses = () => {
        const payload: any = {
            userId: selectedUser,
            normalWarehouseIds: selectedWarehousesAllow.map((item: any) => item?.id),
            receiverWarehouseIds: selectedWarehousesReceive.map((item: any) => item?.id)
        }
        dispatch(
            assignWareHouseToUser({
                token: authenticatedUser?.token as string,
                payload: payload,
                resHandler: handleResponse,
            })
        );
    };

    return (
        <Box>
            <Title
                mb={8}
                order={isSmallScreen ? 3 : 2}
                c={customStyles.colors._4D4D4D}
                // size={isSmallScreen ? "h3" : "h2"}
                style={{ fontWeight: 700, fontSize: 24 }}
            >
                Assign Warehouse
            </Title>
            <Text
                mb={isSmallScreen ? 16 : 24}
                c={customStyles.colors._909090}
                // size={isSmallScreen ? "sm" : "md"}
                style={{ fontWeight: 500, fontSize: 16 }}
            >
                Select user & assign single and multiple warehouse to user
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
                        className={!selectedUser ? "filledDisabledButton" : "filledButton"}
                        radius={8}
                        size={isSmallScreen ? "sm" : "md"}
                        leftSection={<IconBuildingWarehouse size={isSmallScreen ? 20 : 24} />}
                        onClick={handleAssignWarehouses}
                        disabled={!selectedUser && selectedWarehousesAllow?.length > 0}
                        w={isSmallScreen ? "100%" : "auto"}
                        mt={isSmallScreen ? 16 : 0}
                    >
                        {isSmallScreen ? "Assign" : "Assign Warehouse"}
                    </Button>
                </Group>
            </Group>

            {/* Table */}
            <TanStackTable
                data={Array.isArray(warehouseList) ? warehouseList : []}
                dataCount={warehouseCount}
                columns={columns}
                isLoading={isLoading}
                // isLoading={false}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Warehouse List"}
                subTitle={"Select user to assign warehouse"}
                skipRecord={skipRecord}
            />
        </Box>
    );
};

export default AssignWarehouseComponent;
