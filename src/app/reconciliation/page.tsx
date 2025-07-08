// Note: Reconciliation screen...!

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconSearch, IconTable } from '@tabler/icons-react';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import { getITAndTRData } from '@/redux/actions/reconciliation-actions/reconciliation-actions';
import Loader from '@/components/loader/loader';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';

const dummyData = Array(6).fill({
  itemCode: 'ITM-0001',
  itemName: 'PF Marie Biscuit',
  quantity: '10,000',
});

const quantityDiffData = Array(6).fill({
  itemCode: 'ITM-0001',
  itemName: 'PF Marie Biscuit',
  itQuantity: '10,000',
  trQuantity: '0',
  difference: '10,000',
});

const ReconciliationScreen = () => {

  // Note: Handeling states here...!
  const [fromWarehouse, setFromWarehouse] = useState<string | null>(null);
  const [toWarehouse, setToWarehouse] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [warehousesOptions, setWarehousesOptions] = useState([]);
  const [loadingState, setLoadingState] = useState(false);

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetching data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
  const { inventoryTransferItems, transferReceiptItems } = useAppSelector(({ reconciliationStates }) => { return reconciliationStates });
  // console.log("Warehouses list: ", wareHousesList);
  // console.log("Inventory transfer items: ", inventoryTransferItems);
  // console.log("Transfer receipt items: ", transferReceiptItems);

  // Note: Function to clear form states...!
  const clearFormStates = () => {
    setFromWarehouse(null);
    setToWarehouse(null);
    setSelectedDate(null);
  };

  // Note: Get IT and TR reconciliation data handler...!
  const getItAndTrReconcileData = () => {
    try {
      if (!fromWarehouse) throw ('From warehouse is required');
      if (!toWarehouse) throw ('To warehouse is required');
      if (!selectedDate) throw ('Please select date');
      if (fromWarehouse == toWarehouse) throw ('From warehouse and To warehouse cannot be same');

      else {
        setLoadingState(true);
        dispatch(getITAndTRData({
          token: authenticatedUser?.token || "",
          fromWhCode: fromWarehouse,
          toWhCode: toWarehouse,
          dateAndTime: selectedDate,
          loadingHandler: () => setLoadingState(false)
        }));
        // clearFormStates();
      };
    }

    catch (error) {
      console.log("Error: ", error);
      if (error) showNotificationToast("Validation Error", error as string, customStyles.colors.red);
    };
  };

  // Note: This hook will run when wareHousesList state wil update...!
  useEffect(() => {
    if (wareHousesList && wareHousesList.length > 0) {
      const selectWarehouseOptions: any = wareHousesList?.map((wh) => ({
        value: wh.whsCode,
        label: wh.whsName,
      }));
      console.log("Warehouses options: ", selectWarehouseOptions);
      selectWarehouseOptions && setWarehousesOptions(selectWarehouseOptions);
    };
  }, [wareHousesList]);

  // Note: Mounted hook...!
  useEffect(() => {
    authenticatedUser && dispatch(fetchAllWareHouses(authenticatedUser?.token as string));
  }, []);

  return (
    <Stack p="md" gap="lg">

      {/* Note: Loader component */}
      <Loader loadingState={loadingState} />

      <Group justify="space-between" align="flex-start" bg="gray.0">
        <Stack gap={0}>
          <Title
            order={3}
            style={{
              color: customStyles.colors._4D4D4D,
              fontSize: "24px",
              fontWeight: 700
            }}
          >
            Reconciliation
          </Title>

          <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
            Match Inventory Transfers with their Receipts to keep your stock records accurate and up-to-date
          </Text>
        </Stack>
      </Group>

      {/* Note: Filters */}
      <Group grow align="flex-end" mt={5}>

        {/* Note: From warehouse */}
        <Select
          label="From Warehouse"
          placeholder="Select Warehouse"
          data={warehousesOptions}
          value={fromWarehouse}
          onChange={setFromWarehouse}
          searchable
        />

        {/* Note: To warehouse */}
        <Select
          label="To Warehouse"
          placeholder="Select Warehouse"
          data={warehousesOptions}
          value={toWarehouse}
          onChange={setToWarehouse}
          searchable
        />

        {/* Note: Date filter */}
        <DateInput
          label="Date"
          placeholder="DD/MM/YY"
          value={selectedDate}
          onChange={setSelectedDate}
          clearable
          size="sm"
          popoverProps={{
            withinPortal: true,
            styles: {
              dropdown: {
                padding: 8,
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: 320,
              },
            },
          }}
          styles={{
            input: { fontSize: 14 },
            calendarHeaderControl: { fontSize: 14, padding: 4, width: 30, height: 30 },
            calendarHeaderLevel: { fontSize: 16 },
            day: { fontSize: 13, width: 34, height: 34 },
          }}
        />

        <Button
          mt="xs"
          onClick={getItAndTrReconcileData}
        >
          Get Data
        </Button>
      </Group>

      {/* Note: If no data this component will render */}
      {
        (inventoryTransferItems.length < 1 && transferReceiptItems.length < 1) ?
          <h3
            style={{
              textAlign: "center",
              color: customStyles.colors._4D4D4D,
              fontWeight: "normal",
              marginTop: "10%"
            }}
          >
            There are no Inventory Transfers or Transfer Receipts to show right now. <br /> Try adjusting your filters or date range to view records.
          </h3>
          : null
      }

      {/* Inventory Transfer & Receipt */}
      <Grid style={{ display: (inventoryTransferItems.length > 0 && transferReceiptItems.length > 0) ? ('block') : ('none') }}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="sm">
              <Title order={5}>Inventory Transfer</Title>
              {/* <Group gap="xs">
                <IconSearch size={18} />
                <IconTable size={18} />
              </Group> */}
            </Group>

            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Item Code</Table.Th>
                  <Table.Th>Item Name</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {inventoryTransferItems?.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{item.itemCode}</Table.Td>
                    <Table.Td>{item.itemName}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between" mb="sm">
              <Title order={5}>Transfer Receipt</Title>
              {/* <Group gap="xs">
                <IconSearch size={18} />
                <IconTable size={18} />
              </Group> */}
            </Group>

            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Item Code</Table.Th>
                  <Table.Th>Item Name</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {transferReceiptItems?.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>{item.itemCode}</Table.Td>
                    <Table.Td>{item.itemName}</Table.Td>
                    <Table.Td>{item.quantity}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Reconciliation Actions */}
      <Box style={{ display: "none" }}>
        <Text size="sm" mb="xs" c="dimmed">
          Auto mode shows mismatches, manual mode lets you match entries.
        </Text>
        <Group>
          <Button variant="outline">Reconcile</Button>
          <Button>Auto Reconcile</Button>
        </Group>
      </Box>

      {/* Quantity Difference Table */}
      <Paper withBorder p="md" radius="md" style={{ display: "none" }}>
        <Group justify="space-between" mb="sm">
          <Title order={5}>Quantity Difference</Title>
          <Group gap="xs">
            <IconSearch size={18} />
            <IconTable size={18} />
          </Group>
        </Group>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Item Code</Table.Th>
              <Table.Th>Item Name</Table.Th>
              <Table.Th>Total IT Quantity</Table.Th>
              <Table.Th>Total TR Quantity</Table.Th>
              <Table.Th>Difference</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {quantityDiffData.map((item, index) => (
              <Table.Tr key={index}>
                <Table.Td>{item.itemCode}</Table.Td>
                <Table.Td>{item.itemName}</Table.Td>
                <Table.Td>{item.itQuantity}</Table.Td>
                <Table.Td>{item.trQuantity}</Table.Td>
                <Table.Td>{item.difference}</Table.Td>
                <Table.Td>
                  <Button size="xs" color="green" variant="outline" radius="xl">
                    View
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default ReconciliationScreen;