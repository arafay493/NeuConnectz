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
import { postRequestToSAP, fetchAllITR_IT_TRS, fetchAll_GRNS } from '@/redux/actions/sap-actions/sap-actions';
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '../data-not-found/data-not-found';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import Loader from '../loader/loader';
import { fetchDashboardAnalytics } from '@/redux/actions/dashboard-actions/dashboard-actions';

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
const grnsHeaders: string[] =
    [
        "S.No",
        "Type", // GRN
        "Number",
        "Item Code",
        "Warehouse",
        "Vendor",
        "User Name",
        "SAP Status",
        "Doc Status",
        "Doc Date"
    ];

const types: string[] = ["ITR", "IT", "TR"];
const cardsData = [
    {
        label: "ITR",
        pendingValue: "totalItrPending",
        integratedValue: "totalItrIntegrated",
        lastIntegrationDate: "lastItrIntegrationDate"
    },
    {
        label: "IT",
        pendingValue: "totalItPending",
        integratedValue: "totalItIntegrated",
        lastIntegrationDate: "lastItIntegrationDate"
    },
    {
        label: "TR",
        pendingValue: "totalTrPending",
        integratedValue: "totalTrIntegrated",
        lastIntegrationDate: "lastTrIntegrationDate"
    },
    {
        label: "GI",
        pendingValue: "",
        integratedValue: "",
        lastIntegrationDate: ""
    },
    {
        label: "GR",
        pendingValue: "",
        integratedValue: "",
        lastIntegrationDate: ""
    },
    {
        label: "GRN",
        pendingValue: "totalGrnPending",
        integratedValue: "totalGrnIntegrated",
        lastIntegrationDate: "lastGrnIntegrationDate"
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
    const [headerBtnType, setHeaderBtnType] = useState<"Stock Movement" | "GRN">("Stock Movement");

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const {
        listAll_ITR_IT_TRS,
        list_GRNS_Data,
        sapErrorState,
    } = useAppSelector(({ sapStates }) => { return sapStates });
    const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => { return dashboardStates });
    // console.log("listAll_ITR_IT_TRS: ", listAll_ITR_IT_TRS);
    // console.log("list_GRNS_Data: ", list_GRNS_Data);
    // console.log("Dashboard Analytics Data: ", dashboardAnalyticsData);

    // Note: Required variables...!
    const targetTableData = headerBtnType === "GRN" ? list_GRNS_Data : listAll_ITR_IT_TRS;
    const totalPages = Math.ceil(targetTableData.length / itemsPerPage);
    const paginatedData = targetTableData.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

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
    const showPendingAndIntegratedValues = (sapType: string, value: string) => {
        // console.log('SAP Type: ', sapType);
        // console.log("Value: ", value);

        if (sapType === "ITR" || sapType === "IT" || sapType === "TR") {
            const { transferStatistics } = dashboardAnalyticsData || {};
            // console.log("Transfer Statistics: ", transferStatistics);
            const pendingValue = transferStatistics ? transferStatistics[value as keyof typeof transferStatistics] : 0;
            // console.log("Pending Value: ", pendingValue);
            return pendingValue;
        }

        if (sapType === "GRN") {
            const { grnStatistics } = dashboardAnalyticsData || {};
            // console.log("GRN Statistics: ", grnStatistics);
            const pendingValue = grnStatistics ? grnStatistics[value as keyof typeof grnStatistics] : 0;
            // console.log("Pending Value: ", pendingValue);
            return pendingValue;
        };

        return 0;
    };

    // Note: Function to show time / minutes...!
    const showTime = (dateVal: string) => {
        // console.log("Date Value: ", dateVal);

        const { lastIntegrationDates } = dashboardAnalyticsData || {};
        const lastIntegrationDateValue = lastIntegrationDates ? lastIntegrationDates[dateVal as keyof typeof lastIntegrationDates] : 0;
        // console.log("Last Integration Date Value: ", lastIntegrationDateValue);

        if (!lastIntegrationDateValue) return "No data";

        const start = new Date(lastIntegrationDateValue);
        const end = new Date();

        const diffInMs = end.getTime() - start.getTime();

        const totalSeconds = Math.floor(diffInMs / 1000);
        const totalMinutes = Math.floor(diffInMs / (1000 * 60));
        const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const totalDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (totalSeconds < 60) return "just now";
        if (totalMinutes < 60) return `${totalMinutes} minute${totalMinutes > 1 ? "s" : ""} ago`;
        if (totalHours < 24) return `${totalHours} hour${totalHours > 1 ? "s" : ""} ago`;
        if (totalDays < 7) return `${totalDays} day${totalDays > 1 ? "s" : ""} ago`;

        const totalWeeks = Math.floor(totalDays / 7);
        if (totalWeeks < 4) return `${totalWeeks} week${totalWeeks > 1 ? "s" : ""} ago`;

        const totalMonths = Math.floor(totalDays / 30);
        if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? "s" : ""} ago`;

        const totalYears = Math.floor(totalDays / 365);
        // console.log('Total Years:', totalYears);

        if ( totalYears == 1 ) return `1 year ago`;
        else return `Long time ago`;
        
        // return `${totalYears} year${totalYears > 1 ? "s" : ""} ago`;
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

        // if (pendingAndIntegratedData && pendingAndIntegratedData.hasOwnProperty(pendingType)) {
        //     const checkDataInProp = pendingAndIntegratedData[pendingType] || 0;
        //     // console.log("Check Data in Prop: ", checkDataInProp);
        //     const disableTrue = checkDataInProp > 0 ? false : true;
        //     return disableTrue;
        // }
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
        // console.log("Request Data: ", reqData);

        // Note: Enable loader...!
        enableLoader();

        if (reqData == "ITR") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to ITR",
                apiUrl: process.env.NEXT_PUBLIC_POST_ITR_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "TR") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to TR",
                apiUrl: process.env.NEXT_PUBLIC_POST_TR_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "IT") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to IT",
                apiUrl: process.env.NEXT_PUBLIC_POST_IT_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "GRN") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to GRN",
                apiUrl: process.env.NEXT_PUBLIC_POST_GRN_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }));
            return;
        };

        if (reqData == "GI" || reqData == "GR") {
            disableLoader(); // Note: Disable loader...!
            showNotificationToast("Error", "This feature is not implemented yet!", customStyles.colors.red);
            return;
        };
    };

    // Note: handle change status...!
    const handleStatusChange = (status: "Pending" | "Integrated") => {
        // console.log("Status: ", status);
        setStatusColor(status);
        setLoading(true);

        if (!authenticatedUser && !status) {
            return;
        };

        if (headerBtnType == "Stock Movement") {
            dispatch(fetchAllITR_IT_TRS({
                token: authenticatedUser?.token || "",
                dataStatus: status,
                handleLoading: () => setLoading(false)
            }));
            return;
        };

        if (headerBtnType == "GRN") {
            dispatch(fetchAll_GRNS({
                token: authenticatedUser?.token || "",
                sapStatus: status,
                handleLoading: () => setLoading(false)
            }));
        };
    };

    // Note: Function to see stock movement data...!
    const viewStockMovementData = () => {

        // Note: Enable loader...!
        setLoading(true);
        setHeaderBtnType("Stock Movement");
        // setStatusColor("Pending");

        const token = authenticatedUser?.token || "";
        dispatch(fetchAllITR_IT_TRS({
            token,
            dataStatus: statusColor,
            handleLoading: () => setLoading(false)
        }));
    };

    // Note: Functio to fetch GRNS data...!
    const viewGrnsData = () => {

        // Note: Enable loader...!
        setLoading(true);
        setHeaderBtnType("GRN");
        // setStatusColor("Pending");

        dispatch(fetchAll_GRNS({
            token: authenticatedUser?.token || "",
            sapStatus: statusColor,
            handleLoading: () => setLoading(false)
        }));
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
            dispatch(fetchDashboardAnalytics(token));
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
                                    {`${showPendingAndIntegratedValues(item.label, item.pendingValue)} / ${showPendingAndIntegratedValues(item.label, item.integratedValue)}`}
                                </Text>

                                <Text c="dimmed" size="sm">
                                    {showTime(item.lastIntegrationDate)}
                                </Text>

                                <Button
                                    fullWidth
                                    mt="md"
                                    variant="outline"
                                    onClick={() => handleRequestToSap(item.label)}
                                    // disabled={handleDisable(item.pendingValue)}
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
                    justify={customStyles.alignment.left}
                    mb="sm"
                    gap="sm"
                    style={{
                        display: "flex",
                        alignItems: customStyles.alignment.center,
                    }}
                >
                    <Button
                        variant="outline"
                        onClick={viewStockMovementData}
                        style={{
                            width: 200,
                            color: headerBtnType === "Stock Movement" ? customStyles.colors.white : undefined,
                            backgroundColor: headerBtnType === "Stock Movement" ? customStyles.colors._1B59F8 : undefined,
                        }}
                    >
                        Stock Movement
                    </Button>

                    <Button
                        variant="outline"
                        onClick={viewGrnsData}
                        style={{
                            width: 200,
                            color: headerBtnType === "GRN" ? customStyles.colors.white : undefined,
                            backgroundColor: headerBtnType === "GRN" ? customStyles.colors._1B59F8 : undefined,
                        }}
                    >
                        GRN
                    </Button>
                </Group>

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
                                width: 200,
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
                                width: 200,
                                color: statusColor === "Integrated" ? customStyles.colors.white : undefined,
                                backgroundColor: statusColor === "Integrated" ? customStyles.colors._1B59F8 : undefined,
                            }}
                        >
                            Success
                        </Button>
                    </Group>

                    <Group style={{ display : headerBtnType == "GRN" ? "none" : "block" }}>
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
                            {
                                (headerBtnType === "GRN")
                                    ?
                                    (<Table.Tr>{grnsHeaders.map(h => <Table.Th key={h}>{h}</Table.Th>)}</Table.Tr>)
                                    :
                                    (<Table.Tr>{headers.map(h => <Table.Th key={h}>{h}</Table.Th>)}</Table.Tr>)
                            }
                        </Table.Thead>

                        <Table.Tbody>
                            {
                                (paginatedData?.length > 0)
                                    ?
                                    (
                                        paginatedData?.map((row: any, index) => (
                                            headerBtnType === "GRN"
                                                ? (
                                                    <Table.Tr key={row.id}>
                                                        <Table.Td>{(activePage - 1) * itemsPerPage + index + 1}</Table.Td>
                                                        <Table.Td>{headerBtnType}</Table.Td>
                                                        <Table.Td>{row.docNum}</Table.Td>
                                                        <Table.Td>{row.itemCode}</Table.Td>
                                                        <Table.Td>{row.whsCode}</Table.Td>
                                                        <Table.Td>{row.vendorCode}</Table.Td>
                                                        <Table.Td>{row.userName}</Table.Td>
                                                        <Table.Td>{row.sapStatus}</Table.Td>
                                                        <Table.Td>{row.docStatus}</Table.Td>
                                                        <Table.Td>{`${new Date(row.updatedDate).toLocaleTimeString()} - ${new Date(row.updatedDate).toLocaleDateString()}`}</Table.Td>
                                                    </Table.Tr>
                                                )
                                                :
                                                (
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
                                                )
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