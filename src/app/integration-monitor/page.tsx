// Note: IntegrationMonitor screen...!

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Center, Container, Grid, Group, SegmentedControl, Table, Tabs, Text, TextInput, Title, Stack, Pagination } from '@mantine/core';
import { IconSearch, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { IconCheckbox } from "@tabler/icons-react";
import { customStyles } from '@/styles/custom-theme';

const data = [
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
];

function ReplicationPage() {
    return (
        <Container>
            <Card withBorder shadow="sm">
                <Title order={3}>Replication Component</Title>
                <Text>This is where you can build your Replication tab content.</Text>
            </Card>
        </Container>
    );
}


const IntegrationMonitor = () => {

    const [tab, setTab] = useState<'integration' | 'replication'>('integration');
    const [activePage, setPage] = useState(1);
    const rowsPerPage = 5;

    const paginatedData = data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);
    const headers = ["Type", "Number", "Item Code", "From Warehouse", "To Warehouse", "Status", "ERP Doc Entry", "ERP Line ID", "Doc Type"];

    return (
        <div>

            {/* Note: Screen Head section */}
            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-start"
                p="md"
                bg="gray.0"
            >
                <Stack gap={4}>
                    <Title order={3} style={{ color: customStyles.colors._4D4D4D }}>
                        Integration Monitor
                    </Title>

                    <Text size="sm" c="dimmed">
                        Track the status of your data syncs between ZConnect and SAP in real time
                    </Text>
                </Stack>

                <Button
                    leftSection={<IconCheckbox size={14} color={customStyles.colors.white} />}
                    color={customStyles.colors._1B59F8}
                >
                    Post All
                </Button>
            </Group>

            <div style={{ padding: 10 }}>
                <SegmentedControl
                    fullWidth
                    data={[{ label: 'Integration', value: 'integration' }, { label: 'Replication', value: 'replication' }]}
                    value={tab}
                    onChange={(value) => setTab(value as 'integration' | 'replication')}
                    mb="lg"
                />

                {tab === 'replication' ? (
                    <ReplicationPage />
                ) : (
                    <>
                        <Grid grow>
                            {["ITR", "IT", "TR", "GI", "GR", "GRN"].map((type, idx) => (
                                <Grid.Col span={{ base: 12, sm: 6, md: 2 }} key={type}>
                                    <Card shadow="sm" radius="md" withBorder>
                                        <Title order={4}>{type}</Title>
                                        <Text size="xl" style={{ fontWeight: 700 }} mt="sm">{idx * 1000 + 260}</Text>
                                        <Text c="dimmed" size="sm">20 mins ago</Text>
                                        <Button fullWidth mt="md">Post</Button>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>

                        <Card mt="xl" withBorder>
                            <Title order={5}>Pending & Success Data</Title>
                            <Text size="sm" c="dimmed" mb="sm">Track inventory transfers that are pending or successfully synced with SAP.</Text>

                            <Group gap="xs" mb="sm">
                                <Button variant="light">Pending</Button>
                                <Button variant="light">Success</Button>
                                <Button variant="light">Error</Button>
                            </Group>

                            <Group justify="space-between" mb="sm" gap="sm">
                                <TextInput placeholder="Search..." leftSection={<IconSearch size={16} />} />
                                <Group>
                                    <Button variant="light" leftSection={<IconAdjustmentsHorizontal size={16} />}>
                                        Filter
                                    </Button>
                                </Group>
                            </Group>

                            <Table highlightOnHover striped withTableBorder>
                                <Table.Thead>
                                    <Table.Tr>{headers.map(h => <Table.Th key={h}>{h}</Table.Th>)}</Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {paginatedData.map((row, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Td>{row.type}</Table.Td>
                                            <Table.Td>{row.number}</Table.Td>
                                            <Table.Td>{row.itemCode}</Table.Td>
                                            <Table.Td>{row.from}</Table.Td>
                                            <Table.Td>{row.to}</Table.Td>
                                            <Table.Td>{row.status}</Table.Td>
                                            <Table.Td>{row.erpDoc}</Table.Td>
                                            <Table.Td>{row.lineId}</Table.Td>
                                            <Table.Td>{row.docType}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>

                            {/* Note: Pagination section */}
                            <Group justify="end" mt="md">
                                <Pagination
                                    value={activePage}
                                    onChange={setPage}
                                    total={Math.ceil(data.length / rowsPerPage)}
                                />
                            </Group>
                        </Card>
                    </>
                )}
            </div>
        </div>
    );
};

export default IntegrationMonitor;