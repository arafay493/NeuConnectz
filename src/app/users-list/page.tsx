// Note: UsersList screen...!

"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Group,
  Text,
  Paper,
  Stack,
  Title,
  Button,
  ScrollArea
} from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { IconSearch, IconUserPlus, IconFileTypeCsv, IconEdit } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAllUsers, activateOrDeactivateUser } from '@/redux/actions/user-actions/user-actions';
import { customStyles } from '@/styles/custom-theme';
import { UserType } from '@/types/modules/user-types/user-types';
import { routes } from '@/constants/routes';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '@/components/loader/loader';
import { exportToCSV } from '@/constants/export-to-csv';

const UsersListScreen = () => {

  // Note: Handeling states here...!
  const [loading, setLoading] = useState(false);

  // Note: Handle routing...!
  const router = useRouter();

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: fetching data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
  const { usersList } = useAppSelector(({ userStates }) => userStates);
  console.log('Users: ', usersList);

  // Note: Handle to go to edit user screen...!
  const goToUpdateUserScreen = (uid: string) => {
    console.log("Uid: ", uid);
    uid && router.push(routes.editUser);
  };

  const columns = useMemo<MRT_ColumnDef<UserType>[]>(() => [
    {
      accessorKey: 'userName',
      header: 'Username',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Username </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Email </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'department',
      header: 'Department',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Department </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Phone </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'role',
      header: 'Role',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Role </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      )
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Status </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      ),
      Cell: ({ cell }) => (
        <Text c={cell.getValue() ? 'green' : 'red'} fw={500}>
          {cell.getValue() ? 'Active' : 'Inactive'}
        </Text>
      ),
    },
    {
      accessorKey: 'userId',
      header: 'Edit User',
      Header: ({ column }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}> Edit User </span>
          {column.getCanSort() && (
            <span>{column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}</span>
          )}
        </div>
      ),
      Cell: ({ cell, row }) => (
        <Button
          leftSection={<IconEdit size={20} color="white" />}
          color={customStyles.colors._1B59F8}
          onClick={() => goToUpdateUserScreen(row.original.userId)}
        >
          Update
        </Button>
      ),
    },
  ], []);

  const handleResponse = (response: any): void => {
    setLoading(false);
    if (response?.status === 201) {
      showNotificationToast("Status Updated", "User status changed successfully", customStyles.colors._408CCE);
      dispatch(fetchAllUsers(authenticatedUser?.token || ""));
    }

    else if (response?.status === 403) {
      showNotificationToast("Unauthorized", "You are not authorized to perform this action!", customStyles.colors.red);
    };
  };

  const handleUserStatusChange = (userData: UserType) => {
    setLoading(true);
    dispatch(activateOrDeactivateUser({
      statusData: {
        userId: userData?.userId,
        isActive: !userData?.isActive,
      },
      token: authenticatedUser?.token || "",
      resHandler: handleResponse,
    }));
  };

  // Note: This hook will run when the component mounts...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllUsers(authenticatedUser?.token));
    };
  }, []);

  return (
    <div>
      <Loader loadingState={loading} />

      <Group justify="space-between" align="flex-start" p="md" bg="gray.0">
        <Stack gap={4}>
          <Title order={3}>User List</Title>
          <Text size="sm" c="dimmed">List of Users</Text>
        </Stack>

        <div>
          <Button
            leftSection={<IconUserPlus size={16} color="white" />}
            color={customStyles.colors._1B59F8}
            onClick={() => router.push(routes.addUser)}
            style={{ marginRight: '10px', width: '180px' }}
          >
            Add User
          </Button>

          <Button
            leftSection={<IconFileTypeCsv size={20} color="white" />}
            color={customStyles.colors._1B59F8}
            onClick={() => exportToCSV(usersList, 'users_list.csv')}
            style={{ marginRight: '10px', width: '180px' }}
          >
            Export to CSV
          </Button>
        </div>
      </Group>

      <Paper p="lg" radius="md" shadow="md" withBorder>
        <ScrollArea type="auto">
          <Box style={{ minWidth: "800px" }}>
            <MantineReactTable
              columns={columns}
              data={usersList}
              enableColumnFilters={true}
              enablePagination={true}
              enableSorting={true}
              enableGlobalFilter={true}
              enableRowSelection={false}
              enableColumnActions={false}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              enableHiding={false}
              mantinePaperProps={{
                withBorder: true,
                shadow: "sm",
                radius: "md",
                style: {
                  padding: "10px",
                },
              }}
              mantineTableProps={{
                style: {
                  border: "1px solid #eaeaea",
                },
              }}
              mantineTableBodyRowProps={{
                style: {
                  transition: "background 0.2s",
                  // backgroundColor : "yellow",
                },
              }}
              mantineTableHeadCellProps={{
                style: {
                  backgroundColor: customStyles.colors._F5F7FA,
                  padding: "10px 9px",
                  fontWeight: "600",
                  fontSize: "16px",
                  color: "#2c2e33",
                },
              }}
              mantineTableBodyCellProps={{
                style: {
                  fontSize: "14px",
                  textTransform: 'capitalize',
                  padding: "10px 10px",
                },
              }}
              mantineTopToolbarProps={{
                style: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: "10px 0px",
                  gap: "10px"
                }
              }}
              icons={{
                IconSearch: (props: any) => (
                  <IconSearch {...props} style={{}} />
                ),
              }}
              renderEmptyRowsFallback={() => (
                <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>
                  No records to display
                </div>
              )}
              mantineFilterTextInputProps={{
                styles: {
                  input: {
                    backgroundColor: '#f1f3f5',
                    borderBottomColor: '#ccc',
                    borderBottomWidth: '1px',
                  },
                },
              }}
              mantineBottomToolbarProps={{
                style: {
                  // backgroundColor: 'orange',
                  display: 'flex',
                  justifyContent: 'flex-end',
                },
              }}
            />
          </Box>
        </ScrollArea>
      </Paper>
    </div>
  );
};

export default UsersListScreen;