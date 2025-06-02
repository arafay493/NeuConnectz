// Note: Integration component...!

import React, { useState, useEffect, memo } from 'react';
import {
    Button,
    Card,
    Grid,
    Group,
    Table,
    Text,
    Title,
    ThemeIcon,
    Flex,
    Select
} from '@mantine/core';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { IconChartBar } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { postRequestToSAP, fetchAllITR_IT_TRS } from '@/redux/actions/sap-actions/sap-actions';
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '../data-not-found/data-not-found';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { SAP_ITR_IT_TRS_DataType } from '@/types/modules/sap-types/sap-types';
import { customStyles } from '@/styles/custom-theme';

const headers = ["S.No", "Type", "Number", "Item Code", "From Warehouse", "To Warehouse", "User Name", "ERP Doc Entry", "ERP Line ID", "Doc Date"];

interface IntegrationComponentProps {
    enableLoader: () => void,
    disableLoader: () => void,
};

const IntegrationComponent = (props: IntegrationComponentProps) => {
    const { enableLoader, disableLoader } = props;
    // console.log("Props of Integration Component: ", props);

    // Note: Handeling states here...!
    const [activePage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [statusColor, setStatusColor] = useState("Pending");

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { listAll_ITR_IT_TRS, sapErrorState } = useAppSelector(({ sapStates }) => { return sapStates });
    // console.log("listAll_ITR_IT_TRS: ", listAll_ITR_IT_TRS);

    // Note: Required variables...!
    const totalPages = Math.ceil(listAll_ITR_IT_TRS.length / itemsPerPage);
    const paginatedData = listAll_ITR_IT_TRS.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    // Note: post request to SAP api response handler...!
    const handleResponse = (response: any): void => {
        // console.log("Post request to SAP api response: ", response);

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

    // Note: Handle post request to SAP...!
    const handleRequestToSap = (reqData: string) => {
        // console.log("Request Data: ", reqData);

        // Note: Enable loader...!
        enableLoader();

        if (reqData == "ITR") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                apiUrl: process.env.NEXT_PUBLIC_POST_ITR_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "TR") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                apiUrl: process.env.NEXT_PUBLIC_POST_TR_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "IT") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                apiUrl: process.env.NEXT_PUBLIC_POST_IT_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "GI" || reqData == "GR" || reqData == "GRN") {
            disableLoader(); // Note: Disable loader...!
            showNotificationToast("Error", "This feature is not implemented yet!", customStyles.colors.red);
            return;
        };
    };

    // Note: handle change status...!
    const handleStatusChange = (status: "Pending" | "Integrated") => {
        // console.log("Status: ", status);
        setStatusColor(status);

        if (authenticatedUser && status) {
            const token: string = authenticatedUser?.token
            dispatch(fetchAllITR_IT_TRS({ token, dataStatus: status }));
        };
    };

    // Note: When this component mounted then this hook will run...!
    useEffect(() => {
        if (authenticatedUser) {
            const token: string = authenticatedUser?.token
            dispatch(fetchAllITR_IT_TRS({ token, dataStatus: "Pending" }));
        };
    }, []);

    return (
        <>
            <Grid grow>
                {
                    ["ITR", "IT", "TR", "GI", "GR", "GRN"]
                        .map((type, idx) => (
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
                                        onClick={() => handleRequestToSap(type)}
                                    >
                                        Post
                                    </Button>
                                </Card>
                            </Grid.Col>
                        ))
                }
            </Grid>

            <Card mt="xl" withBorder>
                <Title order={5}>
                    Pending & Success Data
                </Title>
                <Text size="sm" c="dimmed" mb="sm">
                    Track inventory transfers that are pending or successfully synced with SAP.
                </Text>

                <Group
                    pt={5}
                    pb={5}
                    justify={customStyles.alignment.spaceBetween}
                    mb="sm"
                    gap="sm"
                    style={{
                        display: "flex",
                        alignItems: customStyles.alignment.center,
                    }}
                >
                    <Group gap="xs">
                        <Button
                            variant="outline"
                            onClick={() => handleStatusChange("Pending")}
                            style={{
                                color: statusColor === "Pending" ? customStyles.colors.white : undefined,
                                backgroundColor: statusColor === "Pending" ? customStyles.colors._408CCE : undefined,
                            }}
                        >
                            Pending
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleStatusChange("Integrated")}
                            style={{
                                color: statusColor === "Integrated" ? customStyles.colors.white : undefined,
                                backgroundColor: statusColor === "Integrated" ? customStyles.colors._408CCE : undefined,
                            }}
                        >
                            Success
                        </Button>

                        <Button variant="outline">
                            Error
                        </Button>
                    </Group>

                    <Group>
                        <Button variant="light" leftSection={<IconAdjustmentsHorizontal size={16} />}>
                            Filter
                        </Button>
                    </Group>
                </Group>

                <Table
                    highlightOnHover
                    striped
                    withTableBorder
                >
                    <Table.Thead>
                        <Table.Tr>{headers.map(h => <Table.Th key={h}>{h}</Table.Th>)}</Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {
                            (paginatedData.length > 0)
                                ?
                                (
                                    paginatedData.map((row: SAP_ITR_IT_TRS_DataType, index) => (
                                        <Table.Tr key={row.id}>
                                            <Table.Td>{index + 1}</Table.Td>
                                            <Table.Td>{row.type}</Table.Td>
                                            <Table.Td>{row.docNumber ? row.docNumber : '-'}</Table.Td>
                                            <Table.Td>{row.itemCode}</Table.Td>
                                            <Table.Td>{row.fromWarehouse}</Table.Td>
                                            <Table.Td>{row.toWarehouse}</Table.Td>
                                            <Table.Td>{row.userName}</Table.Td>
                                            <Table.Td>{row.erpDocEntry != null ? row.erpDocEntry : '-'}</Table.Td>
                                            <Table.Td>{row.erpLineID != null ? row.erpLineID : '-'}</Table.Td>
                                            <Table.Td>{`${new Date(row.updatedDate).toLocaleTimeString()} - ${new Date(row.updatedDate).toLocaleDateString()}`}</Table.Td>
                                        </Table.Tr>
                                    ))
                                )
                                :
                                (<DataNotFound notFoundContent={sapErrorState || "No ITR_IT_TRS data found."} colSpanValue={9} />)
                        }
                    </Table.Tbody>
                </Table>

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
                        pageNum={activePage}
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
            </Card>
        </>
    );
};

export default memo(IntegrationComponent);