// Note: Users List screen...!

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Table,
  ScrollArea,
  TextInput,
  Select,
  Flex,
  Group,
  Text,
  Paper,
  Stack,
  Title,
  Button,
  rem
} from "@mantine/core";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import PaginationComponent from '@/components/pagination/pagination';
import { fetchAllUsers } from '@/redux/actions/user-actions/user-actions';
import { customStyles } from '@/styles/custom-theme';
import { UserType } from '@/types/modules/user-types/user-types';
import { routes } from '@/constants/routes';

const UsersListScreen = () => {

  // Note: Handeling states here...!
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  // Note: Handeling navigation here...!
  const router = useRouter();

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetch user data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const { usersList, usersErrorState } = useAppSelector(({ userStates }) => { return userStates });
  // console.log("User: ", authenticatedUser);
  // console.log('Users: ', usersList);

  // Note: Logic to filter data by username only...!
  const filtered = [...usersList]?.filter((user: UserType) =>
    user?.userName?.toLowerCase().includes(search?.toLowerCase())
  )
    .filter((user: UserType) => {
      if (statusFilter === "Active") return user?.isActive;
      if (statusFilter === "Inactive") return !user?.isActive;
      return true; // No filter
    });

  const itemsPerPage: number = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Note: Status dropdown handler...!
  const dropDownHandler = (val: string): void => {
    // console.log("Selected status: ", val);
    setStatusFilter(val || "");
    setPage(1);
  };

  // Note: This hook will run once when this component mounts...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllUsers(authenticatedUser?.token))
    };
  }, []);

  return (
    <div>

      {/* Note: Table Screen Head section */}
      <Group
        justify={customStyles.alignment.spaceBetween}
        align="flex-start"
        p="md"
        bg="gray.0"
      >
        <Stack gap={4}>
          <Title order={3}>
            User List
          </Title>

          <Text size="sm" c="dimmed">
            List of Users
          </Text>
        </Stack>

        <Button
          leftSection={<IconUserPlus size={14} color={customStyles.colors.white} />}
          color={customStyles.colors._1B59F8}
          onClick={() => router.push(routes.addUser)}
        >
          Add User
        </Button>
      </Group>

      {/* Note: Table section */}
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        withBorder
      >
        <Flex
          justify={customStyles.alignment.spaceBetween}
          align={customStyles.alignment.center}
          mb="md"
          wrap="wrap"
          gap="sm"
        >
          {/* Note: Search by user name secion */}
          <TextInput
            placeholder="Search by username"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            w={250}
          />

          {/* Note: Filter by active and in-active */}
          <Select
            data={["Active", "Inactive"]}
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(value) => dropDownHandler(value as string)}
            clearable
            w={200}
          />
        </Flex>

        <ScrollArea
          type="auto"
          style={{ maxWidth: customStyles.sizeWidthAndHeight.fullWidth }}
        >
          <Box style={{ minWidth: "800px" }}>
            <Table
              withRowBorders
              highlightOnHover
              striped
              style={{
                color: customStyles.colors._909090,
                borderCollapse: "separate",
                borderSpacing: "0 10px",
              }}
            >
              <thead
                style={{
                  color: customStyles.colors._4D4D4D,
                  textAlign: customStyles.alignment.left
                }}
              >
                <tr
                  style={{
                    borderBottom: "2px solid #ddd",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  <th>Serial No</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody
                style={{
                  // height: '40vh',
                  textAlign: customStyles.alignment.left
                }}
              >
                {
                  paginated?.map((user: UserType, key) => (
                    <tr
                      key={user?.userId}
                      style={{
                        textTransform: customStyles.textTransformation.capitalize
                      }}
                    >
                      <td>{(page - 1) * itemsPerPage + key + 1}</td>
                      <td>{user?.userName}</td>
                      <td>{user?.email}</td>
                      <td>{user?.department}</td>
                      <td>{user?.phone}</td>
                      <td>{user?.role}</td>
                      <td>{user?.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))
                }

                {/* Note: If data not found or data.length == 0 */}
                {
                  paginated?.length === 0 && (
                    <tr>
                      <td colSpan={7}>
                        <Text style={{ textAlign: customStyles.alignment.center }}>
                          {usersErrorState || "No users found."}
                        </Text>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </Box>
        </ScrollArea>

        {/* Pagination section */}
        <PaginationComponent
          totalPages={totalPages}
          pageNum={page}
          handleNewPage={setPage}
        />
      </Paper>
    </div>
  );
};

export default UsersListScreen;