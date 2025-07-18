// Note: UsersList screen...!

"use client";

import React, { useState, useEffect, useMemo } from 'react';
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

  // Note: Handeling states here...!
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Derived values for backend
  const skipRecord = pagination.pageIndex * pagination.pageSize;
  const lastCount = pagination.pageSize;

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
          leftSection={<IconEdit size={20} />}
          color={customStyles.colors._1B59F8}
          onClick={() => goToUpdateUserScreen(row.original.userId)}
        >
          Update
        </Button>
      ),
    },
  ], []);

  // Note: This hook will run when lastCount and skipRecord state will update...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllUsers({
        authToken: authenticatedUser?.token,
        LastCount: lastCount,
        skipRecord: skipRecord
      }));
    };
  }, [lastCount, skipRecord]);

  return (
    <div>
      <Group justify="space-between" align="flex-start" p="md" bg="gray.0">
        <Stack gap={0}>
          <Title
            order={3}
            style={{
              color: customStyles.colors._4D4D4D,
              fontSize: "24px",
              fontWeight: 700
            }}
          >
            User List
          </Title>

          <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
            List of Users
          </Text>
        </Stack>

        <Group>
          <Button
            variant='transparent'
            className='filledButton'
            radius={8}
            size='md'
            leftSection={<IconUserPlus size={24} />}
            onClick={() => router.push(routes.addUser)}
          >
            Add User
          </Button>

          <Button
            variant='transparent'
            className='filledButton'
            radius={8}
            size='md'
            leftSection={<IconFileTypeCsv size={24} />}
            onClick={() => {
              const rightNow = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
              exportToCSV(usersList.users, `${rightNow} - Users_List.csv`)
            }}
          >
            Export to CSV
          </Button>
        </Group>
      </Group>

      <Paper p="lg" radius="md" shadow="md" withBorder>
        <ScrollArea type="auto">
          <Box style={{ minWidth: "800px" }}>
            <MantineReactTable
              columns={columns}
              data={usersList.users}
              rowCount={usersList.totalCount}
              manualPagination
              state={{ pagination }}
              onPaginationChange={(updater) => {
                const next =
                  typeof updater === 'function'
                    ? updater(pagination)
                    : updater;

                setPagination(next);
              }}
              enableColumnFilters
              enablePagination
              enableSorting
              enableGlobalFilter
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
                  <IconSearch {...props} />
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