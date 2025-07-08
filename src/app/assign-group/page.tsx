// Note: AssignGroup screen...!

"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  ScrollArea,
  Select,
  Group,
  Text,
  Paper,
  Stack,
  Title,
  Button,
  Checkbox,
  Flex,
  TextInput,
  rem,
} from "@mantine/core";
import { IconBuildingWarehouse, IconSearch } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import PaginationComponent from '@/components/pagination/pagination';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import {
  fetchListAllGroupCodes,
  fetchGroupCodesListByUserId,
  assignGroupToUser
}
  from '@/redux/actions/group-actions/group-actions';
import { fetchAllUsers } from '@/redux/actions/user-actions/user-actions';
import { UserType } from '@/types/modules/user-types/user-types';
import { GroupCodeDataType, AssignGrouptoUserDataType } from '@/types/modules/group-types/group-types';
import { customStyles } from '@/styles/custom-theme';
import DataNotFound from '@/components/data-not-found/data-not-found';

const AssignGroup = () => {

  // Note: Handeling states here...!
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [usersData, setUsersData] = useState<{ label: string; value: string }[]>([]);
  const [checkedGroups, setCheckedGroups] = useState<(string | number)[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetching data from redux here...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
  const { usersList } = useAppSelector(({ userStates }) => userStates);
  const { ListAllGroupCodes, listGroupCodesByUserId, GroupErrorState } = useAppSelector(({ groupStates }) => groupStates);
  // console.log('List all group codes:', ListAllGroupCodes);
  // console.log('List group codes by user id:', listGroupCodesByUserId);

  const filtered = [...ListAllGroupCodes]?.filter((user: GroupCodeDataType) =>
    user?.groupName?.toLowerCase().includes(search?.toLowerCase())
  );

  // Note: Required variables...!
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Note: Handle clear all states here...!
  const clearAllStates = () => {
    setLoading(false);
    setPage(1);
    setSelectedUser(null);
    setCheckedGroups([]);
  };

  // Note: Handle dropdown onchange...!
  const handleChange = (value: string | null) => {
    setSelectedUser(value);
    setCheckedGroups([]);

    if (value === null) {
      setSearch("");
      setPage(1);
    };
  };

  // Note: Handle checkbox onchange...!
  const toggleCheckbox = (groupCode: string | number) => {
    if (!selectedUser) return;

    setCheckedGroups(prev =>
      prev.includes(groupCode)
        ? prev.filter(code => code !== groupCode)
        : [...prev, groupCode]
    );
  };

  // Note: Required variables...!
  const currentPageGroupCodes = [...ListAllGroupCodes].map(group => group.groupCode);
  const isAllSelected = currentPageGroupCodes.every(code => checkedGroups.includes(code));
  const isIndeterminate = currentPageGroupCodes.some(code => checkedGroups.includes(code)) && !isAllSelected;

  // Note: Handle select all checkboxes...!
  const handleSelectAll = () => {
    if (!selectedUser) return;

    if (isAllSelected) {
      setCheckedGroups(prev => prev.filter(code => !currentPageGroupCodes.includes(code)));
    }

    else {
      setCheckedGroups(prev => [...new Set([...prev, ...currentPageGroupCodes])]);
    };
  };

  // Note: Handle api response...!
  const handleResponse = (response: any): void => {
    if (response?.status === 201) {
      setLoading(false);
      showNotificationToast("Assigned Successfully", "Requested groups have been assigned to the user", customStyles.colors._408CCE);
      dispatch(fetchListAllGroupCodes(authenticatedUser?.token as string));
      clearAllStates();
    }

    else {
      setLoading(false);
    };
  };

  // Note: Handle assign group...!
  const handleAssignGroup = () => {
    if (!selectedUser) {
      showNotificationToast("Validation Error", 'Please select a user first', customStyles.colors.red);
      return;
    };

    const obj: AssignGrouptoUserDataType = {
      userId: selectedUser,
      groupCodes: checkedGroups
    };

    setLoading(true);
    dispatch(assignGroupToUser({
      addGroupToUserData: obj,
      token: authenticatedUser?.token as string,
      resHandler: handleResponse
    }));
  };

  // Note: This hook will run when authenticatedUser changes...!
  useEffect(() => {
    if (authenticatedUser?.token) {
      dispatch(fetchListAllGroupCodes(authenticatedUser.token));

      if (usersList.length < 1) dispatch(fetchAllUsers(authenticatedUser?.token));
    };
  }, [authenticatedUser]);

  // Note: This hook will run when usersList changes...!
  useEffect(() => {
    if (usersList?.length > 0) {
      const targetData = usersList.map((user: UserType) => ({
        label: user.userName,
        value: user.userId
      }));
      setUsersData(targetData);
    };
  }, [usersList]);

  // Note: This hook will run when selectedUser changes...!
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchGroupCodesListByUserId({
        authToken: authenticatedUser?.token as string,
        userId: selectedUser,
      }));
    };
  }, [selectedUser]);

  // Note: This hook will run when selectedUser or listGroupCodesByUserId changes, update checkedGroups...!
  useEffect(() => {
    if (selectedUser && listGroupCodesByUserId.length > 0) {
      const assignedGroupCodes = listGroupCodesByUserId.map(group => group.groupCode);
      setCheckedGroups(assignedGroupCodes);
    }

    else {
      setCheckedGroups([]);
    };
  }, [selectedUser, listGroupCodesByUserId]);


  return (
    <div>
      <Loader loadingState={loading} />

      <Group justify={customStyles.alignment.spaceBetween} align="flex-start" p="md" bg="gray.0">
        <Stack gap={0}>
          <Title
            order={3}
            style={{
              color: customStyles.colors._4D4D4D,
              fontSize: "24px",
              fontWeight: 700
            }}
          >
            Items Group
          </Title>

          <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
            Select group to assign
          </Text>
        </Stack>
      </Group>

      <Group
        justify={customStyles.alignment.spaceBetween}
        align={customStyles.alignment.center}
        p="md"
        bg={customStyles.colors.white}
        style={{ borderRadius: customStyles.size.size_5 }}
        wrap="wrap"
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap="sm"
          wrap="wrap"
          style={{ flex: 1, minWidth: rem(300) }}
        >
          <Stack gap={4} w={{ base: "100%", sm: 300 }}>
            Select User:
            <Select
              data={usersData}
              placeholder="Select User"
              value={selectedUser}
              onChange={handleChange}
              clearable
              w={300}
              searchable
            />
          </Stack>

          {/* Note: Search by group name secion */}
          <Stack gap={4} w={{ base: "100%", sm: 300 }}>
            Search Group Name:
            <TextInput
              placeholder="Search by group name"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setPage(1);
              }}
              w={300}
            />
          </Stack>
        </Flex>

        <Button
          mt={{ base: "md", sm: 0 }}
          leftSection={<IconBuildingWarehouse size={14} color={customStyles.colors.white} />}
          color={customStyles.colors._1B59F8}
          onClick={handleAssignGroup}
          disabled={paginated.length === 0}
        >
          Assign Group
        </Button>
      </Group>

      <Paper p="lg" radius="md" shadow="md" withBorder>
        <ScrollArea type="auto" style={{ maxWidth: customStyles.sizeWidthAndHeight.fullWidth }}>
          <Box style={{ minWidth: "800px" }}>
            <Table
              withRowBorders
              highlightOnHover
              striped
              style={{
                color: customStyles.colors._909090,
                borderCollapse: "separate",
                borderSpacing: "0 10px"
              }}
            >
              <thead style={{ color: customStyles.colors._4D4D4D, textAlign: customStyles.alignment.left }}>
                <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f8f9fa" }}>
                  <th>Group Code</th>
                  <th>Group Name</th>
                  <th>
                    <Checkbox
                      disabled={!selectedUser}
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      label="Select All"
                    />
                  </th>
                </tr>
              </thead>

              <tbody style={{ textAlign: customStyles.alignment.left }}>
                {
                  paginated.length > 0 ? (
                    paginated.map((item: GroupCodeDataType) => (
                      <tr key={item.id} style={{ textTransform: customStyles.textTransformation.capitalize }}>
                        <td>{item.groupCode}</td>
                        <td>{item.groupName}</td>
                        <td>
                          <Checkbox
                            disabled={!selectedUser}
                            label="Allow access"
                            checked={checkedGroups.includes(item.groupCode)}
                            onChange={() => toggleCheckbox(item.groupCode)}
                          />
                        </td>
                      </tr>
                    ))
                  )
                    :
                    (<DataNotFound notFoundContent={GroupErrorState || "No item group found."} colSpanValue={3} />)
                }
              </tbody>
            </Table>
          </Box>
        </ScrollArea>

        <Flex
          justify={customStyles.alignment.spaceBetween}
          align={customStyles.alignment.center}
          mb="md"
          wrap="wrap"
          gap="sm"
        >
          {/* Note: Pagination section */}
          <PaginationComponent
            totalPages={totalPages}
            pageNum={page}
            handleNewPage={setPage}
          />

          {/* Note: Rows per page section */}
          <Select
            data={["5", "10", "20", "50"]}
            label="Rows per page"
            value={itemsPerPage.toString()}
            onChange={(value) => {
              setItemsPerPage(Number(value));
              setPage(1);
            }}
            w={120}
          />
        </Flex>
      </Paper>
    </div>
  );
};

export default AssignGroup;