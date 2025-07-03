// Note: UsersList screen...!

"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Group,
  Text,
  Paper,
  Stack,
  Title,
  Button,
  ScrollArea,
  TextInput
} from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { IconSearch, IconUserPlus, IconFileTypeCsv, IconEdit, IconFilter } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAllUsers } from '@/redux/actions/user-actions/user-actions';
import { customStyles } from '@/styles/custom-theme';
import { UserType } from '@/types/modules/user-types/user-types';
import { routes } from '@/constants/routes';
import { exportToCSV } from '@/constants/export-to-csv';

const UsersListScreen = () => {

  // Note: Handle routing...!
  const router = useRouter();

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: fetching data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
  const { usersList } = useAppSelector(({ userStates }) => userStates);
  // console.log('Users: ', usersList);

  // Note: Handle to go to edit user screen...!
  const goToUpdateUserScreen = (uid: string) => {
    // console.log("Uid: ", uid);
    uid && router.push(routes.editUser(uid as string));
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
      ),
      Cell: ({ cell }) => (
        <Text style={{ textTransform: "lowercase" }}>{String(cell.getValue())}</Text>
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

  // Note: This hook will run when the component mounts...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllUsers(authenticatedUser?.token));
    };
  }, []);

  return (
    <div>
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
            onClick={() => {
              const rightNow = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
              exportToCSV(usersList, `${rightNow} - Users_List.csv`)
            }}
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
              // globalFilterFn="includesString"
              // renderTopToolbarCustomActions={
              //   ({ table }) => (
              //     <>
              //       <Group gap="lg" pr="md">
              //         <TextInput
              //           placeholder="Search..."
              //           leftSection={<IconSearch size={16} />}
              //           value={table.getState().globalFilter as string ?? ''}
              //           onChange={(e) => table.setGlobalFilter(e.currentTarget.value)}
              //           size="xs"
              //         />
              //         <Group gap={6} align="center">
              //           <IconFilter size={16} />
              //           <Text size="sm" c="dimmed">Use filters above the columns</Text>
              //         </Group>
              //       </Group>
              //     </>
              //   )
              // }

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
            />
          </Box>
        </ScrollArea>
      </Paper>
    </div >
  );
};

export default UsersListScreen;