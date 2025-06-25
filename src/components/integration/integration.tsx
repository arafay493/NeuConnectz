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
    Select,
    ScrollArea,
} from '@mantine/core';
import { IconChartBar } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { postRequestToSAP, fetchAllITR_IT_TRS } from '@/redux/actions/sap-actions/sap-actions';
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '../data-not-found/data-not-found';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { SAP_ITR_IT_TRS_DataType } from '@/types/modules/sap-types/sap-types';
import { customStyles } from '@/styles/custom-theme';
import Loader from '../loader/loader';

const headers: string[] =
    [
        "S.No",
        "Type",
        "Number",
        "Item Code",
        "From Warehouse",
        "To Warehouse",
        "User Name",
        "ERP Doc Entry",
        "ERP Line ID",
        "SAP Status",
        "Doc Status",
        "Doc Date"
    ];
const types: string[] = ["ITR", "IT", "TR"];
const cardsData = [
    {
        label: "ITR",
        pendingValue: "pendingItrs",
        integratedValue: "integratedItrs",
        lastIntegrationDate: "lastItrIntegrationDate"
    },
    {
        label: "IT",
        pendingValue: "pendingIts",
        integratedValue: "integratedIts",
        lastIntegrationDate: "lastItIntegrationDate"
    },
    {
        label: "TR",
        pendingValue: "pendingTrs",
        integratedValue: "integratedTrs",
        lastIntegrationDate: "lastTrIntegrationDate"
    },
    {
        label: "GI",
        pendingValue: "pendingGis",
        integratedValue: "integratedGis",
        lastIntegrationDate: ""
    },
    {
        label: "GR",
        pendingValue: "pendingGrs",
        integratedValue: "integratedGrs",
        lastIntegrationDate: ""
    },
    {
        label: "GRN",
        pendingValue: "pendingGrns",
        integratedValue: "integratedGrns",
        lastIntegrationDate: ""
    },
];

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
    const [selectedType, setSelectedType] = useState("");
    const [loading, setLoading] = useState(false);

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { listAll_ITR_IT_TRS, sapErrorState, pendingAndIntegratedData } = useAppSelector(({ sapStates }) => { return sapStates });
    console.log("listAll_ITR_IT_TRS: ", listAll_ITR_IT_TRS);
    console.log("pendingAndIntegratedData: ", pendingAndIntegratedData);

    // Note: Required variables...!
    const totalPages = Math.ceil(listAll_ITR_IT_TRS.length / itemsPerPage);
    const paginatedData = listAll_ITR_IT_TRS.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    // Note: Status dropdown handler...!
    const dropDownHandler = (val: string): void => {

        if (val === null) {
            setSelectedType("");
            // console.log('Clear button clicked!');
            dispatch(fetchAllITR_IT_TRS({
                token: authenticatedUser?.token as string,
                dataStatus: statusColor as "Pending" | "Integrated",
                handleLoading: () => setLoading(false)
            }));
        }

        else {
            setLoading(true);
            // console.log("Selected type: ", val);
            setSelectedType(val);
            dispatch(fetchAllITR_IT_TRS({
                token: authenticatedUser?.token as string,
                dataStatus: statusColor as "Pending" | "Integrated",
                handleLoading: () => setLoading(false),
                type: val as "ITR" | "TR" | "IT"
            }));
        };
    };

    // Note: Function to shoe pending and integrated values...!
    const showPendingAndIntegratedValues = (value: string) => {
        // console.log("Type: ", type);
        // console.log("Value: ", value);

        if (pendingAndIntegratedData && pendingAndIntegratedData.hasOwnProperty(value)) {
            return pendingAndIntegratedData[value] || 0;
        };

        return 0;
    };

    // Note: Handle disable values...!
    const handleDisable = (pendingType: string) => {
        // console.log("Pending Type: ", pendingType);

        // let disableTrue = false;
        // const isITRDataExist = [...listAll_ITR_IT_TRS].find((item) => { return item.type == "ITR" });

        // if ((label == "IT" || label == "TR") && isITRDataExist) {
        //     disableTrue = true;
        // }

        // else {
        //     disableTrue = false;
        // };

        // return disableTrue;

        // let disableTrue = false;
        const checkDataInProp = pendingAndIntegratedData[pendingType] || 0;
        // console.log("Check Data in Prop: ", checkDataInProp);
        const disableTrue = checkDataInProp > 0 ? false : true;
        return disableTrue;
    };

    // Note: post request to SAP api response handler...!
    const handleResponse = (response: any): void => {
        // console.log("Post request to SAP api response: ", response);

        // Note: Stop loading...!
        disableLoader();

        if (response && response.status == 201) {
            if (response?.data?.data?.success) {
                showNotificationToast("Successfull", response?.data?.data?.message, customStyles.colors._408CCE);
                dispatch(fetchAllITR_IT_TRS({
                    token: authenticatedUser?.token as string,
                    dataStatus: "Pending",
                    handleLoading: () => setLoading(false)
                }));
            }

            else if (!response?.data?.data?.success) {
                showNotificationToast(response?.data?.data?.message, response?.data?.data?.error, customStyles.colors.red);
            };
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
        console.log("Request Data: ", reqData);

        // Note: Enable loader...!
        // enableLoader();

        // if (reqData == "ITR") {
        //     dispatch(postRequestToSAP({
        //         token: authenticatedUser?.token as string,
        //         apiUrl: process.env.NEXT_PUBLIC_POST_ITR_REQUEST_TO_SAP as string,
        //         resHandler: handleResponse
        //     }));
        //     return;
        // };

        // if (reqData == "TR") {
        //     dispatch(postRequestToSAP({
        //         token: authenticatedUser?.token as string,
        //         apiUrl: process.env.NEXT_PUBLIC_POST_TR_REQUEST_TO_SAP as string,
        //         resHandler: handleResponse
        //     }));
        //     return;
        // };

        // if (reqData == "IT") {
        //     dispatch(postRequestToSAP({
        //         token: authenticatedUser?.token as string,
        //         apiUrl: process.env.NEXT_PUBLIC_POST_IT_REQUEST_TO_SAP as string,
        //         resHandler: handleResponse
        //     }));
        //     return;
        // };

        // if (reqData == "GRN") {
        //     dispatch(postRequestToSAP({
        //         token: authenticatedUser?.token as string,
        //         apiUrl: process.env.NEXT_PUBLIC_POST_GRN_REQUEST_TO_SAP as string,
        //         resHandler: handleResponse
        //     }));
        //     return;
        // };

        // if (reqData == "GI" || reqData == "GR") {
        //     disableLoader(); // Note: Disable loader...!
        //     showNotificationToast("Error", "This feature is not implemented yet!", customStyles.colors.red);
        //     return;
        // };
    };

    // Note: handle change status...!
    const handleStatusChange = (status: "Pending" | "Integrated") => {
        // console.log("Status: ", status);
        setStatusColor(status);
        setLoading(true);

        if (authenticatedUser && status) {
            const token: string = authenticatedUser?.token
            dispatch(fetchAllITR_IT_TRS({
                token,
                dataStatus: status,
                handleLoading: () => setLoading(false)
            }));
        };
    };

    // Note: When this component mounted then this hook will run...!
    useEffect(() => {
        if (authenticatedUser) {
            const token: string = authenticatedUser?.token
            dispatch(fetchAllITR_IT_TRS({
                token,
                dataStatus: "Pending",
                handleLoading: () => setLoading(false)
            }));
        };
    }, []);

    return (
        <>
            <Grid grow>
                {
                    cardsData.map((item) => (
                        <Grid.Col
                            span={{ base: 12, sm: 6, md: 2 }}
                            key={item.label}
                        >
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

                                <Title order={4}>{item.label}</Title>
                                <Text size="xl" style={{ fontWeight: 700 }} mt="sm">
                                    {`${showPendingAndIntegratedValues(item.pendingValue)} / ${showPendingAndIntegratedValues(item.integratedValue)}`}
                                </Text>

                                <Text c="dimmed" size="sm">
                                    {`${new Date(showPendingAndIntegratedValues(item.lastIntegrationDate)).getMinutes()} mins ago`}
                                </Text>

                                <Button
                                    fullWidth
                                    mt="md"
                                    variant="outline"
                                    onClick={() => handleRequestToSap(item.label)}
                                    disabled={handleDisable(item.pendingValue)}
                                    color={customStyles.colors._1B59F8}
                                    style={{
                                        root: {
                                            '&:hover': {
                                                backgroundColor: 'yellow',
                                            },
                                        },
                                    }}
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
                                backgroundColor: statusColor === "Pending" ? customStyles.colors._1B59F8 : undefined,
                            }}
                        >
                            Pending
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => handleStatusChange("Integrated")}
                            style={{
                                color: statusColor === "Integrated" ? customStyles.colors.white : undefined,
                                backgroundColor: statusColor === "Integrated" ? customStyles.colors._1B59F8 : undefined,
                            }}
                        >
                            Success
                        </Button>

                        {/* <Button variant="outline">
                            Error
                        </Button> */}
                    </Group>

                    <Group>
                        <Select
                            data={types}
                            placeholder="Filters"
                            value={selectedType}
                            onChange={(value) => dropDownHandler(value as string)}
                            clearable
                            w={200}
                        />
                    </Group>
                </Group>


                {loading && <Loader loadingState={loading} />}

                <ScrollArea type="auto">
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
                                (paginatedData?.length > 0)
                                    ?
                                    (
                                        paginatedData?.map((row: SAP_ITR_IT_TRS_DataType, index) => (
                                            <Table.Tr key={row.id}>
                                                <Table.Td>{(activePage - 1) * itemsPerPage + index + 1}</Table.Td>
                                                <Table.Td>{row.type}</Table.Td>
                                                <Table.Td>{row.docNumber ? row.docNumber : '-'}</Table.Td>
                                                <Table.Td>{row.itemCode}</Table.Td>
                                                <Table.Td>{row.fromWarehouse}</Table.Td>
                                                <Table.Td>{row.toWarehouse}</Table.Td>
                                                <Table.Td>{row.userName}</Table.Td>
                                                <Table.Td>{row.erpDocEntry != null ? row.erpDocEntry : '-'}</Table.Td>
                                                <Table.Td>{row.erpLineID != null ? row.erpLineID : '-'}</Table.Td>
                                                <Table.Td>{row.status}</Table.Td>
                                                <Table.Td>{row.docStatus}</Table.Td>
                                                <Table.Td>{`${new Date(row.updatedDate).toLocaleTimeString()} - ${new Date(row.updatedDate).toLocaleDateString()}`}</Table.Td>
                                            </Table.Tr>
                                        ))
                                    )
                                    :
                                    (<DataNotFound notFoundContent={sapErrorState || "No data found."} colSpanValue={9} />)
                            }
                        </Table.Tbody>
                    </Table>
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