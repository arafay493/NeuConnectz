// Note: AssignWareHouse screen...!

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
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import {
  fetchAllWareHouses,
  fetchWarehousesListByUserId,
  assignWareHouseToUser
}
  from '@/redux/actions/warehouse-actions/warehouse-actions';
import { fetchAllUsers } from '@/redux/actions/user-actions/user-actions';
import { UserType } from '@/types/modules/user-types/user-types';
import {
  WareHouseDataType,
  AccessWareHouseDataType,
  WareHouseDataObj
}
  from '@/types/modules/warehouse-types/warehouse-types';
import DataNotFound from '@/components/data-not-found/data-not-found';
import Loader from '@/components/loader/loader';
import PaginationComponent from '@/components/pagination/pagination';
import { customStyles } from '@/styles/custom-theme';

const AssignWareHouse = () => {

  // Note: Handeling states here...!
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [usersData, setUsersData] = useState([]);
  const [access, setAccess] = useState<Record<string, AccessWareHouseDataType[]>>({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const lastCount = itemsPerPage;
  const skipRecords = (page - 1) * itemsPerPage;

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetch user data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const { usersList } = useAppSelector(({ userStates }) => { return userStates });
  const { wareHousesList, warehousesListByUserId, warehouseErrorState } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });

  const wareHousesListData = useAppSelector(({ wareHouseStates }) => { return wareHousesList.data })
    ?.filter((whData: WareHouseDataType) =>
      whData?.whsName?.toLowerCase().includes(search?.toLowerCase())
    );


  // const filtered = [...wareHousesList]?.filter((whData: WareHouseDataType) =>
  //   whData?.whsName?.toLowerCase().includes(search?.toLowerCase())
  // );

  // Note: Required variables...!
  const totalPages = Math.ceil(wareHousesList.totalCount / itemsPerPage);
  // const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const isAllSelected = access[selectedUser!]?.every((a: AccessWareHouseDataType) => a.allow) || false;
  const isIndeterminate = access[selectedUser!]?.some((a: AccessWareHouseDataType) => a.allow) && !isAllSelected;

  const handleNewPage = (newPage: number) => {
    setPage(newPage);
  };

  // Note: Function to clear all states...!
  const clearAllStates = () => {
    setPage(1);
    setSelectedUser(null);
    setAccess({});
    setLoading(false);
  };

  // Note: Handle allow all checkboxes...!
  const handleSelectAll = () => {
    if (!selectedUser) return;

    if (isAllSelected) {
      setAccess((prev) => ({
        ...prev,
        [selectedUser]: prev[selectedUser].map((item: AccessWareHouseDataType) => ({
          ...item,
          allow: false,
          receiver: false
        }))
      }));
    }

    else {
      setAccess((prev) => {
        const updatedAccess = prev[selectedUser].map((item: AccessWareHouseDataType) => ({
          ...item,
          allow: true,
          // receiver: false // Reset receiver to false when allowing access
        }));
        return {
          ...prev,
          [selectedUser]: updatedAccess
        };
      });
    };
  };

  // Note: Handle dropdown...!
  const handleChange = (value: string | null) => {
    setSelectedUser(value);

    if (value === null) {
      setSearch("");
      setPage(1);
      setAccess({});
      return;
    };

    // Initialize access state for selected user if not already present
    // Use wareHousesList.data directly to avoid dependency issues
    const allWarehouses = wareHousesList.data || [];
    setAccess((prev) => ({
      ...prev,
      [value]: allWarehouses.map((wh: WareHouseDataType) => ({
        whsCode: wh.whsCode,
        allow: false,
        receiver: false
      }))
    }));

    // setAccess((prev) => {
    //   if (prev[value]) return prev; // already exists, do nothing

    //   const initialAccess = wareHousesList.map((wh: WareHouseDataType) => ({
    //     whsCode: wh.whsCode,
    //     allow: false,
    //     receiver: false
    //   }));

    //   return {
    //     ...prev,
    //     [value]: initialAccess
    //   };
    // });
  };

  // Note: Handle checkbox...!
  const toggleCheckbox = (whsCode: string, field: 'allow' | 'receiver') => {
    if (!selectedUser) return;

    setAccess((prev) => {
      const userAccess = prev[selectedUser] || [];

      const updatedUserAccess = userAccess.map((entry) =>
        entry.whsCode === whsCode
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

  // Note: Assign warehouse to user api response handler...!
  const handleResponse = (response: any): void => {

    if (response && response.status == 201) {
      // Note: Stop loading...!
      setLoading(false);
      showNotificationToast("Assigned Successfully", "Requested warehouses has been assigned to the requested user", customStyles.colors._408CCE);
      dispatch(fetchAllWareHouses({
        authToken: authenticatedUser?.token as string,
        lastCount: lastCount,
        skipRecords: skipRecords
      }));
      clearAllStates();
      return;
    };

    if (response && response.status != 201) {
      setLoading(false); // Note: Stop loading...!
      return;
    };
  };

  // Note: Function to assign warehouse...!
  const handleAssignWareHouse = () => {

    if (!selectedUser) {
      showNotificationToast("Validation Error", 'Please select user first', customStyles.colors.red);
      return;
    };

    // Note: For normal warehouses...!
    const normalWareHouse = access[selectedUser]
      .filter((item: AccessWareHouseDataType) => {
        return item.allow && !item.receiver;
      })
      .map((eachItem: AccessWareHouseDataType) => {
        return eachItem.whsCode;
      });

    const receiverWareHouse = access[selectedUser]
      .filter((item: AccessWareHouseDataType) => {
        return item.allow && item.receiver;
      })
      .map((eachItem: AccessWareHouseDataType) => {
        return eachItem.whsCode;
      });

    const wareHouseDataObj: WareHouseDataObj = {
      userId: selectedUser as string,
      normalWarehouseCodes: normalWareHouse,
      receiverWarehouseCodes: receiverWareHouse
    };

    // Note: Enable loading...!
    setLoading(true);

    dispatch(assignWareHouseToUser({
      wareHouseData: wareHouseDataObj,
      token: authenticatedUser?.token as string,
      resHandler: handleResponse
    }));
  };

  // Note: This hook will run once when this component mounts...!
  useEffect(() => {
    if (authenticatedUser) {
      dispatch(fetchAllWareHouses({
        authToken: authenticatedUser.token,
        lastCount: lastCount,
        skipRecords: skipRecords
      }));
    };
  }, [authenticatedUser, skipRecords, lastCount]);

  useEffect(() => {
    if (authenticatedUser) {
      if (usersList.users.length < 1) {
        dispatch(fetchAllUsers({
          authToken: authenticatedUser?.token,
        }));
      }
    };
  }, [authenticatedUser]);

  // Note: This hook will run when usersList state update...!
  useEffect(() => {
    if (usersList.users) {
      const targetData = [...usersList.users].map((user: UserType) => ({
        label: user.userName,
        value: user.userId
      }));
      targetData && setUsersData(targetData as any);
    };
  }, [usersList.users]);

  // Note: This hook will run when selectedUser changes...!
  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchWarehousesListByUserId({
        authToken: authenticatedUser?.token as string,
        userId: selectedUser,
      }));
    };
  }, [selectedUser]);

  // Note: This hook will run when selectedUser, warehousesListByUserId, wareHousesList changes...!
  useEffect(() => {
    if (!selectedUser) return;

    // Get the warehouse data directly from redux to avoid dependency issues
    const allWarehouses = wareHousesList.data || [];

    if (warehousesListByUserId.length > 0) {
      const updatedAccess = allWarehouses.map((wh: WareHouseDataType) => {
        const existing = warehousesListByUserId.find(
          (item) => item.whsCode === wh.whsCode
        );
        return {
          whsCode: wh.whsCode,
          allow: !!existing,
          receiver: existing?.isReceiver || false,
        };
      });

      setAccess((prev) => ({
        ...prev,
        [selectedUser]: updatedAccess,
      }));
    } else {
      // 💡 Clear access for selected user when no data is returned
      const resetAccess = allWarehouses.map((wh: WareHouseDataType) => ({
        whsCode: wh.whsCode,
        allow: false,
        receiver: false,
      }));

      setAccess((prev) => ({
        ...prev,
        [selectedUser]: resetAccess,
      }));
    }
  }, [selectedUser, warehousesListByUserId, wareHousesList.data]);

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
        <Stack gap={0}>
          <Title
            order={3}
            style={{
              color: customStyles.colors._4D4D4D,
              fontSize: "24px",
              fontWeight: 700
            }}
          >
            Assign WareHouse
          </Title>

          <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
            Select user & assign single or multiple warehouse to user
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

          {/* Note: Search by warehouse name secion */}
          <Stack gap={4} w={{ base: "100%", sm: 300 }}>
            Search Warehouse Name:
            <TextInput
              placeholder="Search by warehouse name"
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
          variant='transparent'
          className='filledButton'
          radius={8}
          size='md'
          leftSection={<IconBuildingWarehouse size={24} />}
          onClick={handleAssignWareHouse}
          disabled={wareHousesListData?.length == 0}
        >
          Assign Warehouse
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
                  <th>
                    <Checkbox
                      disabled={!selectedUser}
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      label="Allow All"
                    />
                  </th>
                  <th>
                    <Checkbox
                      disabled={!selectedUser}
                      checked={access[selectedUser!]?.every((a: AccessWareHouseDataType) => a.receiver) || false}
                      indeterminate={access[selectedUser!]?.some((a: AccessWareHouseDataType) => a.receiver) && !access[selectedUser!]?.every((a: AccessWareHouseDataType) => a.receiver)}
                      onChange={() => {
                        if (!selectedUser) return;

                        setAccess((prev) => {
                          const current = prev[selectedUser];

                          const allReceiversChecked = current
                            .filter((item) => item.allow)
                            .every((item) => item.receiver);

                          // If all allowed ones are already receiver, we uncheck them; otherwise, check them
                          return {
                            ...prev,
                            [selectedUser]: current.map((item) => ({
                              ...item,
                              receiver: item.allow ? !allReceiversChecked : item.receiver, // Only toggle if `allow` is true
                            })),
                          };
                        });
                      }}
                      label="Receive All"
                    />
                  </th>
                </tr>
              </thead>

              <tbody style={{ textAlign: customStyles.alignment.left }}>
                {
                  wareHousesListData?.map((item: WareHouseDataType) => (
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
                          checked={access[selectedUser!]?.find((a: AccessWareHouseDataType) => a.whsCode === item.whsCode)?.allow || false}
                          onChange={() => toggleCheckbox(item.whsCode, 'allow')}
                        />
                      </td>
                      <td>
                        <Checkbox
                          label="Receiver"
                          checked={access[selectedUser!]?.find((a: AccessWareHouseDataType) => a.whsCode === item.whsCode)?.receiver || false}
                          onChange={() => toggleCheckbox(item.whsCode, 'receiver')}
                          disabled={
                            !access[selectedUser!]?.find((a: AccessWareHouseDataType) => a.whsCode === item.whsCode)?.allow || !selectedUser
                          }
                        />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>

            {/* Note: If no data found */}
            {wareHousesListData?.length < 1 && (<DataNotFound notFoundContent={warehouseErrorState || "No warehouse found."} />)}
          </Box>
        </ScrollArea>

        {
          wareHousesListData?.length > 0 &&
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
              handleNewPage={handleNewPage}
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
        }
      </Paper>
    </div>
  );
};

export default AssignWareHouse;