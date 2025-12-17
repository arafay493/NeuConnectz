"use client";

import { routes } from "@/constants/routes";
import { fetchAllUsers } from "@/redux/actions/user-actions/user-actions";
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

interface UserListComponentProps {
  // data: Array<UserListProps>;
}

const UserListComponent: FC<UserListComponentProps> = () => {
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
    usersList: { users: data, totalCount },
  } = useAppSelector(({ userStates }) => userStates);

  const [isLoading, setIsLoading] = useState(false);

  // Note: Function to Edit any User
  const handleEditUser = (userId: string) => {
    route.push(routes.editUser(userId));
  };

  // Note: Column definitions for the table
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
        accessorKey: "userName",
        header: "Username",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        accessorKey: "department",
        header: "Department",
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
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() as string}
          </Text>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => {
          const isActive = (getValue() as boolean) === true;

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
        accessorKey: "userId",
        header: "Action",
        cell: ({ getValue }) => {
          const userId = getValue() as string;
          return (
            <ActionIcon
              variant="light"
              size="lg"
              c={customStyles.colors._1B59F8}
              style={{
                cursor: "pointer",
              }}
              onClick={() => handleEditUser(userId)}
            >
              <IconEdit />
            </ActionIcon>
          );
        },
      },
    ],
    [data]
  );

  useEffect(() => {
    if (authenticatedUser && apiFilter === "") {
      setIsLoading(true);
      dispatch(
        fetchAllUsers({
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
          fetchAllUsers({
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
  //         fetchAllUsers({
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
            User List
          </Title>
          <Text c={customStyles.colors._909090} style={{ fontWeight: 500, fontSize: 16 }}>List of user, Create user.</Text>
        </Stack>
        <Button
          leftSection={<IconUserPlus size={24} />}
          className="filledButton"
          variant="transparent"
          size="md"
          radius={8}
          onClick={() => route.push("/add-user")}
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
      // skipRecord={0}
      />
    </Box>
  );
};

export default UserListComponent;
