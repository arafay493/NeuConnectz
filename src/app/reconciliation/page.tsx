// Note: Reconciliation screen...!

'use client';

import { useState } from 'react';
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
import ReconciliationComponent from '@/components/reconcilliation/ReconciliationComponent';

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
  // const [fromWarehouse, setFromWarehouse] = useState<string | null>(null);
  // const [toWarehouse, setToWarehouse] = useState<string | null>(null);
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <ReconciliationComponent />
    // <Stack p="md" gap="lg">
    //   {/* Filters */}
    //   <Group grow align="flex-end">
    //     <Select label="To Warehouse" placeholder="Select Warehouse" data={['WH1', 'WH2']} value={toWarehouse} onChange={setToWarehouse} />
    //     <Select label="From Warehouse" placeholder="Select Warehouse" data={['WH1', 'WH2']} value={fromWarehouse} onChange={setFromWarehouse} />
    //     <DateInput
    //       label="Date"
    //       placeholder="DD/MM/YY"
    //       value={selectedDate}
    //     // onChange={setSelectedDate}
    //     />
    //     <Button mt="xs">Get Data</Button>
    //   </Group>

    //   {/* Inventory Transfer & Receipt */}
    //   <Grid>
    //     <Grid.Col span={{ base: 12, md: 6 }}>
    //       <Paper withBorder p="md" radius="md">
    //         <Group justify="space-between" mb="sm">
    //           <Title order={5}>Inventory Transfer</Title>
    //           <Group gap="xs">
    //             <IconSearch size={18} />
    //             <IconTable size={18} />
    //           </Group>
    //         </Group>
    //         <Table striped highlightOnHover withTableBorder>
    //           <Table.Thead>
    //             <Table.Tr>
    //               <Table.Th>Item Code</Table.Th>
    //               <Table.Th>Item Name</Table.Th>
    //               <Table.Th>Quantity</Table.Th>
    //             </Table.Tr>
    //           </Table.Thead>
    //           <Table.Tbody>
    //             {dummyData.map((item, index) => (
    //               <Table.Tr key={index}>
    //                 <Table.Td>{item.itemCode}</Table.Td>
    //                 <Table.Td>{item.itemName}</Table.Td>
    //                 <Table.Td>{item.quantity}</Table.Td>
    //               </Table.Tr>
    //             ))}
    //           </Table.Tbody>
    //         </Table>
    //       </Paper>
    //     </Grid.Col>

    //     <Grid.Col span={{ base: 12, md: 6 }}>
    //       <Paper withBorder p="md" radius="md">
    //         <Group justify="space-between" mb="sm">
    //           <Title order={5}>Transfer Receipt</Title>
    //           <Group gap="xs">
    //             <IconSearch size={18} />
    //             <IconTable size={18} />
    //           </Group>
    //         </Group>
    //         <Table striped highlightOnHover withTableBorder>
    //           <Table.Thead>
    //             <Table.Tr>
    //               <Table.Th>Item Code</Table.Th>
    //               <Table.Th>Item Name</Table.Th>
    //               <Table.Th>Quantity</Table.Th>
    //             </Table.Tr>
    //           </Table.Thead>
    //           <Table.Tbody>
    //             {dummyData.map((item, index) => (
    //               <Table.Tr key={index}>
    //                 <Table.Td>{item.itemCode}</Table.Td>
    //                 <Table.Td>{item.itemName}</Table.Td>
    //                 <Table.Td>{item.quantity}</Table.Td>
    //               </Table.Tr>
    //             ))}
    //           </Table.Tbody>
    //         </Table>
    //       </Paper>
    //     </Grid.Col>
    //   </Grid>

    //   {/* Reconciliation Actions */}
    //   <Box>
    //     <Text size="sm" mb="xs" c="dimmed">
    //       Auto mode shows mismatches, manual mode lets you match entries.
    //     </Text>
    //     <Group>
    //       <Button variant="outline">Reconcile</Button>
    //       <Button>Auto Reconcile</Button>
    //     </Group>
    //   </Box>

    //   {/* Quantity Difference Table */}
    //   <Paper withBorder p="md" radius="md">
    //     <Group justify="space-between" mb="sm">
    //       <Title order={5}>Quantity Difference</Title>
    //       <Group gap="xs">
    //         <IconSearch size={18} />
    //         <IconTable size={18} />
    //       </Group>
    //     </Group>
    //     <Table striped highlightOnHover withTableBorder>
    //       <Table.Thead>
    //         <Table.Tr>
    //           <Table.Th>Item Code</Table.Th>
    //           <Table.Th>Item Name</Table.Th>
    //           <Table.Th>Total IT Quantity</Table.Th>
    //           <Table.Th>Total TR Quantity</Table.Th>
    //           <Table.Th>Difference</Table.Th>
    //           <Table.Th>Actions</Table.Th>
    //         </Table.Tr>
    //       </Table.Thead>
    //       <Table.Tbody>
    //         {quantityDiffData.map((item, index) => (
    //           <Table.Tr key={index}>
    //             <Table.Td>{item.itemCode}</Table.Td>
    //             <Table.Td>{item.itemName}</Table.Td>
    //             <Table.Td>{item.itQuantity}</Table.Td>
    //             <Table.Td>{item.trQuantity}</Table.Td>
    //             <Table.Td>{item.difference}</Table.Td>
    //             <Table.Td>
    //               <Button size="xs" color="green" variant="outline" radius="xl">
    //                 View
    //               </Button>
    //             </Table.Td>
    //           </Table.Tr>
    //         ))}
    //       </Table.Tbody>
    //     </Table>
    //   </Paper>
    // </Stack>
  );
};

export default ReconciliationScreen;