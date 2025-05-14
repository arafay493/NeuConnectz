// Note: Integration component...!

import React, { useState, memo } from 'react';
import {
    Button,
    Card,
    Grid,
    Group,
    Table,
    Text,
    Title,
    Pagination,
    ThemeIcon
} from '@mantine/core';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { IconChartBar } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { postITRRequestToSAP } from '@/redux/actions/sap-actions/sap-actions';
import PaginationComponent from '../pagination/pagination';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';

// Note: THis is the dummy data in futuire it will be cming from an API...!
const data = [
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
    { type: 'ITR', number: '10245', itemCode: 'ITM-001', from: 'DMSTHT', to: 'MW', status: 'Pending', erpDoc: '234567779', lineId: '245656667', docType: 'Active' },
];
const headers = ["Type", "Number", "Item Code", "From Warehouse", "To Warehouse", "Status", "ERP Doc Entry", "ERP Line ID", "Doc Type"];

interface IntegrationComponentProps {
    enableLoader: () => void,
    disableLoader: () => void,
};

const IntegrationComponent = (props: IntegrationComponentProps) => {
    const { enableLoader, disableLoader } = props;
    console.log("Props of Integration Component: ", props);

    // Note: Handeling states here...!
    const [activePage, setPage] = useState(1);

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });

    // Note: Required variables...!
    const rowsPerPage = 5;
    const paginatedData = data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);

    // Note: post ITR request to SAP api response handler...!
    const handleResponse = (response: any): void => {
        console.log("Post ITR request to SAP api response: ", response);

        // Note: Stop loading...!
        disableLoader();

        if (response && response.status == 201) {
            showNotificationToast("Successfull", response?.data?.data?.message, customStyles.colors._408CCE);
            return;
        };

        if (response && response.status == 403) {
            showNotificationToast("Unauthorized User", "You are not authorized to perform this action!", customStyles.colors.red);
            return;
        };

        // if (response && response.status != 201) {
        //     return;
        // };
    };

    // Note: Handle post ITR request to SAP...!
    const handlePostITR = (itrData: string) => {
        // console.log("ITR Data: ", itrData);

        // Note: Enable loader...!
        enableLoader();

        dispatch(postITRRequestToSAP({
            token: authenticatedUser?.token as string,
            resHandler: handleResponse
        }));
    };

    return (
        <>
            <Grid grow>
                {["ITR", "IT", "TR", "GI", "GR", "GRN"].map((type, idx) => (
                    <Grid.Col span={{ base: 12, sm: 6, md: 2 }} key={type}>
                        <Card shadow="sm" radius="md" withBorder>
                            <Group justify={customStyles.alignment.spaceBetween} mb="sm">
                                <ThemeIcon
                                    variant="light"
                                    color={customStyles.colors._1B59F8}
                                    size="xl"
                                    radius="md"
                                >
                                    <IconChartBar size="1.5rem" />
                                </ThemeIcon>
                            </Group>

                            <Title order={4}>{type}</Title>
                            <Text size="xl" style={{ fontWeight: 700 }} mt="sm">{idx * 1000 + 260}</Text>
                            <Text c="dimmed" size="sm">20 mins ago</Text>
                            <Button
                                fullWidth
                                mt="md"
                                variant="outline"
                                onClick={() => handlePostITR(type)}
                            >
                                Post
                            </Button>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>

            <Card mt="xl" withBorder>
                <Title order={5}>Pending & Success Data</Title>
                <Text size="sm" c="dimmed" mb="sm">Track inventory transfers that are pending or successfully synced with SAP.</Text>

                <Group pt={5} pb={5} justify="space-between" mb="sm" gap="sm" style={{ display: "flex", alignItems: "center" }}>
                    <Group gap="xs">
                        <Button variant="outline">Pending</Button>
                        <Button variant="outline">Success</Button>
                        <Button variant="outline">Error</Button>
                    </Group>

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
                        {
                            paginatedData.map((row, i) => (
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
                            ))
                        }
                    </Table.Tbody>
                </Table>

                {/* Note: Pagination section */}
                <PaginationComponent
                    totalPages={Math.ceil(data.length / rowsPerPage)}
                    pageNum={activePage}
                    handleNewPage={setPage}
                />
            </Card>
        </>
    );
};

export default memo(IntegrationComponent);