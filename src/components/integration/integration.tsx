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
    // {
    //     label: "GI",
    //     pendingValue: "",
    //     integratedValue: "",
    //     lastIntegrationDate: ""
    // },
    // {
    //     label: "GR",
    //     pendingValue: "",
    //     integratedValue: "",
    //     lastIntegrationDate: ""
    // },
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

type TableProps = {
    type: "Pending" | "Integrated";
};

// Note: GRN_Table_Component...!
const GRN_Table_Component: React.FC<TableProps> = ({ type }) => {
    // console.log('Type: ', type);

    // Note: States...!
    const [loading, setLoading] = useState(false);
    const [activePage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Note: Required variables...!
    const lastCount = itemsPerPage;
    const skipRecords = (activePage - 1) * itemsPerPage;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { list_GRNS_Data, totalGRNS_DataCounts, sapErrorState } = useAppSelector(({ sapStates }) => { return sapStates });
    // console.log("list_GRNS_Data: ", list_GRNS_Data);
    // console.log("Total GRNS counts: ", totalGRNS_DataCounts);

    const totalPages = Math.ceil(totalGRNS_DataCounts / itemsPerPage);

    const handleNewPage = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (authenticatedUser?.token) {
            setLoading(true);
            dispatch(fetchAll_GRNS({
                token: authenticatedUser?.token || "",
                handleLoading: () => setLoading(false),
                apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${type}` || "",
                lastCount: lastCount,
                skipRecords: skipRecords
            }));
        };
    }, [authenticatedUser, skipRecords, lastCount]);

    return (
        <>
            {loading && <Loader loadingState={loading} />}

            <ScrollArea type="auto">
                <Table
                    highlightOnHover
                    striped
                    withTableBorder
                >
                    <Table.Thead>
                        <Table.Tr>{grnsHeaders.map(h => <Table.Th key={h}>{h}</Table.Th>)}</Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {
                            list_GRNS_Data?.map((row: any, index) => (
                                <Table.Tr key={row.id}>
                                    <Table.Td>{(activePage - 1) * itemsPerPage + index + 1}</Table.Td>
                                    <Table.Td> GRN </Table.Td>
                                    <Table.Td>{row.docNum}</Table.Td>
                                    <Table.Td>{row.itemCode}</Table.Td>
                                    <Table.Td>{row.whsCode}</Table.Td>
                                    <Table.Td>{row.vendorCode}</Table.Td>
                                    <Table.Td>{row.userName}</Table.Td>
                                    <Table.Td>{(row.erpDocEntry) ? (row.erpDocEntry) : ("-")}</Table.Td>
                                    <Table.Td>{(row.erpDocLine) ? (row.erpDocLine) : ("-")}</Table.Td>
                                    <Table.Td>{row.sapStatus}</Table.Td>
                                    <Table.Td>{row.docStatus}</Table.Td>
                                    <Table.Td>{`${new Date(row.updatedDate).toLocaleTimeString()} - ${new Date(row.updatedDate).toLocaleDateString()}`}</Table.Td>
                                </Table.Tr>
                            ))
                        }
                    </Table.Tbody>
                </Table>

                {list_GRNS_Data.length < 1 && <DataNotFound notFoundContent={sapErrorState || "No data found."} />}
            </ScrollArea>

            {
                list_GRNS_Data.length > 0 &&
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
        </>
    );
};

// Note: Stock_Movement_Table_Component...!
const Stock_Movement_Table_Component: React.FC<TableProps> = ({ type }) => {

    // Note: States...!
    const [loading, setLoading] = useState(false);
    const [activePage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Note: Required variables...!
    const lastCount = itemsPerPage;
    const skipRecords = (activePage - 1) * itemsPerPage;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { listAll_ITR_IT_TRS, sapErrorState, listAll_ITR_IT_TRS_Count } = useAppSelector(({ sapStates }) => { return sapStates });

    const totalPages = Math.ceil(listAll_ITR_IT_TRS_Count / itemsPerPage);

    const handleNewPage = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (authenticatedUser?.token) {
            setLoading(true);
            dispatch(fetchAllITR_IT_TRS({
                token: authenticatedUser?.token || "",
                dataStatus: type,
                handleLoading: () => setLoading(false),
                lastCount: lastCount,
                skipRecords: skipRecords
            }));
        };
    }, [authenticatedUser, skipRecords, lastCount]);

    return (
        <>
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
                            listAll_ITR_IT_TRS?.map((row: any, index) => (
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
                        }
                    </Table.Tbody>
                </Table>

                {listAll_ITR_IT_TRS.length < 1 && <DataNotFound notFoundContent={sapErrorState || "No data found."} />}
            </ScrollArea>

            {
                listAll_ITR_IT_TRS.length > 0 &&
                <Flex
                    justify={customStyles.alignment.spaceBetween}
                    align={customStyles.alignment.center}
                    mb="md"
                    wrap="wrap"
                    gap="sm"
                >

                    <PaginationComponent
                        totalPages={totalPages}
                        pageNum={activePage}
                        handleNewPage={handleNewPage}
                    />

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
        </>
    );
};

const IntegrationComponent = (props: IntegrationComponentProps) => {
    const { enableLoader, disableLoader } = props;
    // console.log("Props of Integration Component: ", props);

    // Note: Handeling states here...!
    const [statusColor, setStatusColor] = useState<"Pending" | "Integrated">("Pending");
    const [selectedType, setSelectedType] = useState("");
    const [loading, setLoading] = useState(false);
    const [headerBtnType, setHeaderBtnType] = useState<"Stock Movement" | "GRN">("Stock Movement");

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => { return dashboardStates });
    // console.log("Dashboard Analytics Data: ", dashboardAnalyticsData);

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
        // console.log(start , end , diffInMs);

        const totalSeconds = Math.floor(diffInMs / 1000);
        const totalMinutes = Math.floor(diffInMs / (1000 * 60));
        const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const totalDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        // console.log('Days: ', totalDays);

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

        if (totalYears == 1) return `1 year ago`;
        else return `Long time ago`;

        // return `${totalYears} year${totalYears > 1 ? "s" : ""} ago`;
    };

    // Note: Handle disable values...!
    const handleDisable = (pendingVal: string, integratedVal: string) => {
        // console.log("Pending value: ", pendingVal);
        // console.log("Integrated value: ", integratedVal);

        const statsData = { ...dashboardAnalyticsData?.transferStatistics, ...dashboardAnalyticsData?.grnStatistics };
        // console.log("Stats: ", statsData);

        // const isPendingVal0 = statsData[pendingVal];
        const isPendingVal0 = statsData[pendingVal as keyof typeof statsData];
        if (isPendingVal0 == 0) return true;
        return false;
    };

    // Note: post request to SAP api response handler...!
    const handleResponse = (response: any): void => {
        // console.log("Post request to SAP api response: ", response);

        // Note: Stop loading...!
        disableLoader();

        if (response && response.status == 201) {
            if (response?.data?.data?.success) {
                showNotificationToast("Successfull", response?.data?.data?.message, customStyles.colors._408CCE);
                dispatch(fetchDashboardAnalytics(authenticatedUser?.token as string,)); // For data updation purpose...!

                if (headerBtnType == "Stock Movement") {
                    dispatch(fetchAllITR_IT_TRS({
                        token: authenticatedUser?.token as string,
                        dataStatus: statusColor,
                        handleLoading: () => setLoading(false),
                        lastCount: 5,
                        skipRecords: 0
                    }));
                }

                else if (headerBtnType == "GRN") {
                    dispatch(fetchAll_GRNS({
                        token: authenticatedUser?.token || "",
                        handleLoading: () => setLoading(false),
                        apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${statusColor}`,
                        lastCount: 5,
                        skipRecords: 0
                    }));
                }
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
    const handleRequestToSap = (reqData: string, totalPendingValue: string) => {
        // console.log("Request Data: ", reqData);
        // console.log("Total pending Value: ", totalPendingValue);

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

            const statsData = { ...dashboardAnalyticsData?.transferStatistics, ...dashboardAnalyticsData?.grnStatistics };
            // console.log('Stats: ', statsData);
            const itrPendingVal = statsData['totalItrPending']
            // console.log('ITR Pending Val:', itrPendingVal)

            if (itrPendingVal != undefined && itrPendingVal > 0) {
                disableLoader();
                showNotificationToast("Warning", "Please post ITR first!", customStyles.colors.red);
                return;
            }

            else if (itrPendingVal == 0) {
                dispatch(postRequestToSAP({
                    token: authenticatedUser?.token as string,
                    type: "Post to IT",
                    apiUrl: process.env.NEXT_PUBLIC_POST_IT_REQUEST_TO_SAP as string,
                    resHandler: handleResponse
                }));
                return;
            }
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
                handleLoading: () => setLoading(false),
                lastCount: 5,
                skipRecords: 0
            }));
            return;
        };

        if (headerBtnType == "GRN") {
            dispatch(fetchAll_GRNS({
                token: authenticatedUser?.token || "",
                handleLoading: () => setLoading(false),
                apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${status}`,
                lastCount: 5,
                skipRecords: 0
            }));
        };
    };

    // Note: Function to see stock movement data...!
    const viewStockMovementData = () => {

        // Note: Enable loader...!
        setLoading(true);
        setHeaderBtnType("Stock Movement");

        const token = authenticatedUser?.token || "";
        dispatch(fetchAllITR_IT_TRS({
            token,
            dataStatus: statusColor,
            handleLoading: () => setLoading(false),
            lastCount: 5,
            skipRecords: 0
        }));
    };

    // Note: Functio to fetch GRNS data...!
    const viewGrnsData = () => {
        // console.log('statusColor: ', statusColor);

        // Note: Enable loader...!
        setLoading(true);
        setHeaderBtnType("GRN");

        dispatch(fetchAll_GRNS({
            token: authenticatedUser?.token || "",
            handleLoading: () => setLoading(false),
            apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${statusColor}`,
            lastCount: 5,
            skipRecords: 0
        }));
    };

    // Note: When this component mounted then this hook will run...!
    useEffect(() => {
        if (authenticatedUser) {
            const token: string = authenticatedUser?.token
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
                                    variant="transparent"
                                    className={handleDisable(item.pendingValue, item.integratedValue) ? 'outlineDisabledButton' : 'outlineButton'}
                                    radius={8}
                                    size="md"
                                    fullWidth
                                    mt="md"
                                    onClick={() => handleRequestToSap(item.label, item.pendingValue)}
                                    disabled={handleDisable(item.pendingValue, item.integratedValue)}
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
                        variant="transparent"
                        className={headerBtnType === 'Stock Movement' ? 'filledButton' : 'outlineButton'}
                        radius={8}
                        size="md"
                        w={200}
                        onClick={viewStockMovementData}
                    >
                        Stock Movement
                    </Button>

                    <Button
                        variant="transparent"
                        className={headerBtnType === 'GRN' ? 'filledButton' : 'outlineButton'}
                        radius={8}
                        size="md"
                        w={200}
                        onClick={viewGrnsData}
                    // style={{
                    //     width: 200,
                    //     color: headerBtnType === "GRN" ? customStyles.colors.white : undefined,
                    //     backgroundColor: headerBtnType === "GRN" ? customStyles.colors._1B59F8 : undefined,
                    // }}
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
                            variant='transparent'
                            className={statusColor === 'Pending' ? 'filledButton' : 'outlineButton'}
                            radius={8}
                            size='md'
                            w={200}
                            onClick={() => handleStatusChange("Pending")}
                        >
                            Pending
                        </Button>

                        <Button
                            variant='transparent'
                            className={statusColor === 'Integrated' ? 'filledButton' : 'outlineButton'}
                            radius={8}
                            size='md'
                            w={200}
                            onClick={() => handleStatusChange("Integrated")}
                        >
                            Success
                        </Button>
                    </Group>

                    <Group style={{ display: headerBtnType == "GRN" ? "none" : "block" }}>
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

            </Card>

            {
                headerBtnType == "GRN" ? (<GRN_Table_Component type={statusColor} />) : (<Stock_Movement_Table_Component type={statusColor} />)
            }
        </>
    );
};

export default memo(IntegrationComponent);