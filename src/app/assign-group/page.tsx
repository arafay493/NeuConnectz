// Note: AssignGroup screen...!

"use client";

import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  ScrollArea,
  Select,
  Pagination,
  Group,
  Text,
  Paper,
  Stack,
  Title,
  Button,
  Checkbox
} from "@mantine/core";
import { IconBuildingWarehouse } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { fetchListAllGroupCodes , assignGroupToUser } from '@/redux/actions/group-actions/group-actions';
import { UserType } from '@/types/modules/user-types/user-types';
import { GroupCodeDataType, AssignGrouptoUserDataType } from '@/types/modules/group-types/group-types';
import { customStyles } from '@/styles/custom-theme';

const AssignGroup = () => {

  // Note: Handeling states here...!
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [usersData, setUsersData] = useState([]);
  const [checkedGroups, setCheckedGroups] = useState<string[]>([]);

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetch user data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const { usersList } = useAppSelector(({ userStates }) => { return userStates });
  const { ListAllGroupCodes } = useAppSelector(({ groupStates }) => { return groupStates });
  // console.log("User: ", authenticatedUser);
  // console.log('Users list: ', usersList);
  // console.log('Group codes list: ', ListAllGroupCodes);

  // Note: Required variables...!
  const itemsPerPage: number = 10;
  const totalPages = Math.ceil(ListAllGroupCodes?.length / itemsPerPage);
  const paginated = [...ListAllGroupCodes].slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Note: Function to clear all states...!
  const clearAllStates = () => {
    setLoading(false);
    setPage(1);
    setSelectedUser(null);
    setCheckedGroups([]);
  };

  // Note: Handle dropdown...!
  const handleChange = (value: string | null) => {
    setSelectedUser(value);
    setCheckedGroups([]);
  };

  // Note: Handle checkbox...!
  const toggleCheckbox = (groupId: string) => {
    if (!selectedUser) return;

    setCheckedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Note: Handle to select all check boxes...!
  const currentPageIds = [...ListAllGroupCodes].map(group => group.id);
  const isAllSelected = currentPageIds.every(id => checkedGroups.includes(id));
  const isIndeterminate = currentPageIds.some(id => checkedGroups.includes(id)) && !isAllSelected;

  const handleSelectAll = () => {
    if (!selectedUser) return;

    if (isAllSelected) {
      setCheckedGroups(prev => prev.filter(id => !currentPageIds.includes(id)));
    }

    else {
      setCheckedGroups(prev => [...new Set([...prev, ...currentPageIds])]);
    };
  };

  // Note: Assign warehouse to user api response handler...!
  const handleResponse = (response: any): void => {
    // console.log("Assign group to user api response: ", response);

    if (response && response.status == 201) {
      // Note: Stop loading...!
      setLoading(false);
      showNotificationToast("Assigned Successfully", "Requested groups has been assigned oo the requested user", customStyles.colors._408CCE);
      dispatch(fetchListAllGroupCodes(authenticatedUser?.token as string));
      clearAllStates();
      return;
    };

    if (response && response.status != 201) {
      setLoading(false); // Note: Stop loading...!
      return;
    };
  };

  // Note: Function to assign group...!
  const handleAssignGroup = () => {

    if (!selectedUser) {
      showNotificationToast("Validation Error", 'Please select user first', customStyles.colors.red);
      return;
    };

    const obj: AssignGrouptoUserDataType = {
      userId: selectedUser,
      groupcodeIds: checkedGroups
    };

    // Note: Enable loading...!
    setLoading(true);

    dispatch(assignGroupToUser({
      addGroupToUserData: obj,
      token: authenticatedUser?.token as string,
      resHandler: handleResponse
    }));
  };

  // Note: This hook will run once when this component mounts...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchListAllGroupCodes(authenticatedUser?.token));
    };
  }, []);

  // Note: This hook will run when usersList state update...!
  useEffect(() => {
    if (usersList) {
      const targetData = [...usersList].map((user: UserType) => ({
        label: user.userName,
        value: user.userId
      }));
      targetData && setUsersData(targetData as any);
      // console.log('Target user data: ', targetData);
    };
  }, [usersList]);

  return (
    <div>

      {/* Note: Loading Component */}
      <Loader loadingState={loading} />

      {/* Note: Table Screen Head section */}
      <Group
        justify={customStyles.alignment.spaceBetween}
        align="flex-start"
        p="md"
        bg="gray.0"
      >
        <Stack gap={4}>
          <Title
            order={3}
            style={{ color: customStyles.colors._4D4D4D }}
          >
            Items Group
          </Title>

          <Text size="sm" c="dimmed">
            Select group to unassign
          </Text>
        </Stack>
      </Group>

      <Group
        justify={customStyles.alignment.spaceBetween}
        align="center"
        p="md"
        bg={customStyles.colors.white}
        style={{ borderRadius: customStyles.size.size_5 }}
      >
        <Stack gap={4}>

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

        <Button
          leftSection={<IconBuildingWarehouse size={14} color={customStyles.colors.white} />}
          color={customStyles.colors._1B59F8}
          onClick={handleAssignGroup}
        >
          Assign Group
        </Button>
      </Group>

      {/* Note: Table section */}
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        withBorder
      >
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
                  <th> Group Code </th>
                  <th> Group Name </th>
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

              <tbody
                style={{
                  textAlign: customStyles.alignment.left
                }}
              >
                {
                  paginated?.map((item: GroupCodeDataType) => (
                    <tr
                      key={item?.id}
                      style={{
                        textTransform: customStyles.textTransformation.capitalize
                      }}
                    >
                      <td>{item?.groupCode}</td>
                      <td>{item?.groupName}</td>
                      <td>
                        <Checkbox
                          disabled={!selectedUser}
                          label="Allow access"
                          checked={checkedGroups.includes(item.id)}
                          onChange={() => toggleCheckbox(item.id)}
                        />
                      </td>
                    </tr>
                  ))
                }

                {/* Note: If no data found */}
                {
                  paginated?.length === 0 &&
                  (
                    <tr>
                      <td colSpan={7}>
                        <Text style={{ textAlign: customStyles.alignment.center }}>
                          No item group found.
                        </Text>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </Box>
        </ScrollArea>

        {/* Note: Pagination section */}
        <Group
          justify={customStyles.alignment.left}
          mt="md"
        >
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
          />
        </Group>
      </Paper>
    </div>
  );
};

export default AssignGroup;