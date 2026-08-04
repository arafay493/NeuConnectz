"use client";

import { routes } from "@/constants/routes";
import { fetchAllQtrackUsers, updateQTrackUser } from "@/redux/actions/user-actions/user-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { UserListProps } from "@/types/redux-types";
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Group,
    Stack,
    Switch,
    Text,
    Title,
} from "@mantine/core";
import {
    IconEdit,
    IconPointFilled,
    IconUserPlus,
} from "@tabler/icons-react";
import {
    ColumnDef,
    PaginationState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import TanStackTable from "../tanStackTable/TanStackTable";
import { notifications } from "@mantine/notifications";
import showNotificationToast from "@/lib/notification-toast/notification-toast";

interface UserListComponentProps {
    // data: Array<UserListProps>;
}

const QTrackUserListComponent: FC<UserListComponentProps> = () => {
    const [apiFilter, setApiFilter] = useState("");
    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const skipRecord = pagination.pageIndex * pagination.pageSize;

    // Note: Router for switch page
    const route = useRouter();

    const dispatch = useAppDispatch();

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Note: State for Users List
    const {
        qtrackUsersList: { users: data, totalCount },
    } = useAppSelector(({ userStates }) => userStates);

    const [isLoading, setIsLoading] = useState(false);

    // Note: Function to Edit any User
    const handleEditUser = (userId: string) => {
        route.push(routes.editUser(userId));
    };

    const userStatusChangeResHandler = (response: any) => {
        if (response.status === 200 || response.status === 201) {
            showNotificationToast("User Update", response.data?.message || "User status updated successfully", customStyles.colors._408CCE);
            dispatch(
                fetchAllQtrackUsers({
                    authToken: authenticatedUser?.token!,
                    LastCount: pagination.pageSize,
                    skipRecord,
                })
            )
        } else {
            showNotificationToast("Error", response.data?.message || response.data?.error || response.error, customStyles.colors.red);
        }
    };

    const handleUserStatusChange = async (
        userId: string,
        isActive: boolean
    ) => {
        dispatch(
            updateQTrackUser({
                authToken: authenticatedUser?.token!,
                userId,
                isActive,
                resHandler: userStatusChangeResHandler,
            })
        );
    };

    const columns = useMemo<ColumnDef<UserListProps>[]>(
        () => [
            {
                header: "S.No",
                cell: ({ row }) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;

                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
            },
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: "phone",
                header: "Phone",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: "userType",
                header: "User Type",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: "createdDate",
                header: "Created Date",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {new Date(getValue() as string).toLocaleDateString()}
                    </Text>
                ),
            },
            {
                accessorKey: "isActive",
                header: "Status",
                cell: ({ getValue }) => {
                    const isActive = getValue() as boolean;

                    return (
                        <Badge
                            leftSection={<IconPointFilled size={18} />}
                            variant="light"
                            size="lg"
                            color={
                                isActive
                                    ? customStyles.colors.green
                                    : customStyles.colors._909090
                            }
                            styles={{
                                root: {
                                    minWidth: "fit-content",
                                    width: "max-content",
                                },
                                label: {
                                    textTransform: "capitalize",
                                    fontWeight: "500",
                                    fontSize: "1rem",
                                    whiteSpace: "nowrap",
                                },
                            }}
                        >
                            {isActive ? "Active" : "Inactive"}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "actions",
                header: "Actions",
                cell: ({ row, getValue }) => {
                    const isActive = row.original.isActive;
                    const userId = row.original.userId;

                    return (
                        <Switch
                            checked={isActive}
                            color="green"
                            size="lg"
                            onLabel="Inactive"
                            offLabel="Active"
                            styles={{
                                track: {
                                    width: 80,
                                },
                                trackLabel: {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    fontSize: 11,
                                    fontWeight: 800,
                                },
                            }}
                            onChange={(event) => {
                                const checked = event.currentTarget.checked;
                                handleUserStatusChange(userId, checked);
                            }}
                        />
                    );
                },
            },
            // {
            //     accessorKey: "userId",
            //     header: "Action",
            //     cell: ({ getValue }) => {
            //         const userId = getValue() as string;

            //         return (
            //             <ActionIcon
            //                 variant="light"
            //                 size="lg"
            //                 c={customStyles.colors._1B59F8}
            //                 style={{ cursor: "pointer" }}
            //                 onClick={() => handleEditUser(userId)}
            //             >
            //                 <IconEdit />
            //             </ActionIcon>
            //         );
            //     },
            // },
        ],
        [pagination]
    );

    useEffect(() => {
        if (authenticatedUser && apiFilter === "") {
            setIsLoading(true);
            dispatch(
                fetchAllQtrackUsers({
                    authToken: authenticatedUser?.token,
                    LastCount: pagination.pageSize,
                    skipRecord: skipRecord,
                })
            ).finally(() => {
                setIsLoading(false);
            });
        } else if (authenticatedUser && apiFilter !== "") {
            const interval = setTimeout(() => {
                setIsLoading(true);
                dispatch(
                    fetchAllQtrackUsers({
                        authToken: authenticatedUser?.token || "",
                        LastCount: pagination.pageSize,
                        skipRecord: skipRecord,
                        keywords: apiFilter,
                    })
                ).finally(() => {
                    setIsLoading(false);
                });
            }, 1500);
            return () => clearInterval(interval)
        }
    }, [authenticatedUser, dispatch, pagination.pageIndex, pagination.pageSize, apiFilter]);

    // Debouncing For the Search User
    // useEffect(() => {
    //   if (apiFilter !== "") {
    //     const interval = setTimeout(() => {
    //       setIsLoading(true);
    //       dispatch(
    //         fetchAllQtrackUsers({
    //           authToken: authenticatedUser?.token || "",
    //           LastCount: pagination.pageSize,
    //           skipRecord: skipRecord,
    //           keywords: apiFilter,
    //         })
    //       ).finally(() => {
    //         setIsLoading(false);
    //       });
    //     }, 1500);
    //     return () => clearInterval(interval)
    //   }
    // }, [apiFilter])

    return (
        <Box p={8}>
            <Group
                justify="space-between"
                align="center"
                style={{ flexShrink: 0, marginBottom: "16px" }}
            >
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D} style={{ fontWeight: 700, fontSize: 24 }}>
                        QTrack User List
                    </Title>
                    <Text c={customStyles.colors._909090} style={{ fontWeight: 500, fontSize: 16 }}>List of qtrack user and create qtrack user.</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className="filledButton"
                    variant="transparent"
                    size="md"
                    radius={8}
                    onClick={() => route.push("/add-qtrack-user")}
                >
                    Add User
                </Button>
            </Group>
            {/* Table */}
            <TanStackTable
                data={Array.isArray(data) ? data : []}
                dataCount={totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Manage Users"}
                subTitle={"View, search, and manage all users by using multiple filters."}
                skipRecord={skipRecord}
                searchable={true}
                apiFilter={apiFilter}
                setApiFilter={setApiFilter}
                headerTextAllowed={true}
            // skipRecord={0}
            />
        </Box>
    );
};

export default QTrackUserListComponent;