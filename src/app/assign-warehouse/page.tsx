// Note: AssignWareHouse screen...!

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
  rem,
  Checkbox
} from "@mantine/core";
import { IconBuildingWarehouse } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import { customStyles } from '@/styles/custom-theme';
import { UserType } from '@/types/modules/user-types/user-types';

type AccessWareHouseDataType = {
  id: string;
  allow: boolean;
  receiver: boolean;
};

const AssignWareHouse = () => {

  // Note: Handeling states here...!
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [usersData, setUsersData] = useState([]);
  const [access, setAccess] = useState<Record<string, AccessWareHouseDataType[]>>({});

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetch user data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const { usersList } = useAppSelector(({ userStates }) => { return userStates });
  const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
  // console.log("User: ", authenticatedUser);
  // console.log('Users list: ', usersList);
  // console.log('WareHouses list: ', wareHousesList);

  // Note: Required variables...!
  const itemsPerPage: number = 10;
  const totalPages = Math.ceil(wareHousesList?.length / itemsPerPage);
  const paginated = [...wareHousesList].slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Note: Handle dropdown...!
  const handleChange = (value: string | null) => {
    setSelectedUser(value);

    if (!value) return;

    // Initialize access state for selected user if not already present
    setAccess((prev) => {
      if (prev[value]) return prev; // already exists, do nothing

      const initialAccess = wareHousesList.map((wh: any) => ({
        id: wh.id,
        allow: false,
        receiver: false
      }));

      return {
        ...prev,
        [value]: initialAccess
      };
    });
  };

  // Note: Handle checkbox...!
  const toggleCheckbox = (id: string, field: 'allow' | 'receiver') => {
    if (!selectedUser) return;

    setAccess((prev) => {
      const userAccess = prev[selectedUser] || [];

      const updatedUserAccess = userAccess.map((entry) =>
        entry.id === id
          ? {
            ...entry,
            [field]:
              field === "allow"
                ? !entry.allow
                : entry.allow
                  ? !entry.receiver
                  : entry.receiver
          }
          : entry
      );

      return {
        ...prev,
        [selectedUser]: updatedUserAccess,
      };
    });
  };

  // Note: Function to assign warehouse...!
  const handleAssignWareHouse = () => {
    console.log('Access state: ', access);
  };

  // Note: This hook will run once when this component mounts...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllWareHouses(authenticatedUser?.token));
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
            Assign WareHouse
          </Title>

          <Text size="sm" c="dimmed">
            Select user & assign single or multiple warehouse to user
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
          onClick={handleAssignWareHouse}
        >
          Assgn Warehouse
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
                  <th> Warehouse Code </th>
                  <th> Warehouse Name </th>
                  <th> Allow </th>
                  <th> Receiver </th>
                </tr>
              </thead>

              <tbody
                style={{
                  // height: '40vh',
                  textAlign: customStyles.alignment.left
                }}
              >
                {
                  paginated?.map((item: any, index) => (
                    <tr
                      key={item?.id}
                      style={{
                        textTransform: customStyles.textTransformation.capitalize
                      }}
                    >
                      <td>{item?.whsCode}</td>
                      <td>{item?.whsName}</td>
                      <td>
                        <Checkbox
                          disabled={!selectedUser}
                          label="Allow access"
                          checked={access[selectedUser!]?.find((a: any) => a.id === item.id)?.allow || false}
                          onChange={() => toggleCheckbox(item.id, 'allow')}
                        />
                      </td>
                      <td>
                        <Checkbox
                          label="Receiver"
                          checked={access[selectedUser!]?.find((a: any) => a.id === item.id)?.receiver || false}
                          onChange={() => toggleCheckbox(item.id, 'receiver')}
                          disabled={
                            !access[selectedUser!]?.find((a: any) => a.id === item.id)?.allow || !selectedUser
                          }
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
                          No warehouse found.
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

export default AssignWareHouse;

// Note: Sb se pehle any ko remove kro then upoer ko type kr k bnaya hy wo types m define kro