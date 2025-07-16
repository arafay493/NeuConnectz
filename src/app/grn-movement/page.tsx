// Note: GRN Movement Screen...!

"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    Group,
    SegmentedControl,
    Title,
    Stack,
    Button,
    ScrollArea,
    Select,
    TextInput,
    Table,
    Flex
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconFileTypeCsv } from "@tabler/icons-react";
import { customStyles } from '@/styles/custom-theme';
import Loader from '@/components/loader/loader';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data } from '@/redux/actions/itr-actions/itr-actions';
import ITR_TableCom from '@/components/itr-table/itr-table';
import TR_TableCom from '@/components/tr-table/tr-table';
import IT_TableCom from '@/components/it-table/it-table';
import { exportToCSV } from '@/constants/export-to-csv';
import { grnFilters, sapStatusOptionsGRN, docStatusOptions, apiFilterParamsForGRNS } from '@/constants/filters';
import { exportDataToCsvFile, fetchAll_GRNS, fetchAllVendorCodes } from '@/redux/actions/sap-actions/sap-actions';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import DataNotFound from '@/components/data-not-found/data-not-found';
import PaginationComponent from '@/components/pagination/pagination';

const grnsHeaders: string[] =
    [
        "S.No",
        "Doc Num",
        "Doc Date",
        "Warehouse Code",
        "Vendor Code",
        "Doc Status",
        "Item Code",
        "Item Description",
        "ERP Doc Entry",
        "ERP Doc Line",
        "SAP Status",
        "User Name",
    ];

const GRNMovementScreen = () => {

    // Note: Using useRef to store the previous tab value...!
    const controlRef = useRef<HTMLDivElement>(null);

    // Note: Handeling states here...!
    const [loading, setLoading] = useState(false);
    const [activePage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Note: Filters states...!

    // Note: Multi-filter state...!
    const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
    const [warehousesOptions, setWarehousesOptions] = useState([]);
    const [vendorCodeOptions, setVendorCodeOptions] = useState([]);

    // Note: Redux dispatch and selector hooks...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
    const { list_GRNS_Data, sapErrorState, vendorCodeList } = useAppSelector(({ sapStates }) => { return sapStates });
    // console.log("list_GRNS_Data: ", list_GRNS_Data);
    // console.log("vendorCodeList: ", vendorCodeList);
    // console.log("wareHousesList: ", wareHousesList);

    // Note: Required variables...!
    const totalPages = Math.ceil(list_GRNS_Data.length / itemsPerPage);
    const paginatedData = list_GRNS_Data.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    // Note: Export to CSV handler...!
    // const handleExportToCSV = () => {
    //     // console.log('Tab: ', tab);

    //     const isFiltersApplied = Object.keys(appliedFilters);

    //     if (isFiltersApplied.length < 1) {
    //         if (tab === 'ITR') {
    //             dispatch(exportDataToCsvFile({
    //                 token: authenticatedUser?.token || "",
    //                 apiUrl: process.env.NEXT_PUBLIC_EXPORT_ITR_TO_EXCEL as string,
    //                 type: 'ITR',
    //             }));
    //         }

    //         if (tab === 'IT') {
    //             dispatch(exportDataToCsvFile({
    //                 token: authenticatedUser?.token || "",
    //                 apiUrl: process.env.NEXT_PUBLIC_EXPORT_IT_TO_EXCEL as string,
    //                 type: 'IT',
    //             }));
    //         }

    //         if (tab === 'TR') {
    //             dispatch(exportDataToCsvFile({
    //                 token: authenticatedUser?.token || "",
    //                 apiUrl: process.env.NEXT_PUBLIC_EXPORT_TR_TO_EXCEL as string,
    //                 type: 'TR',
    //             }));
    //         }
    //     }

    //     else if (isFiltersApplied.length > 0) {
    //         const cleanedFilters = Object.entries(appliedFilters)
    //             .filter(([_, value]) => value && value.trim() !== '')
    //             .reduce((acc, [key, value]) => {
    //                 const paramKey = apiFilterParams[filters.indexOf(key)];
    //                 if (paramKey) acc[paramKey] = value;
    //                 return acc;
    //             }, {} as Record<string, string>);

    //         const queryString = new URLSearchParams(cleanedFilters).toString();

    //         if (tab === 'ITR') {
    //             dispatch(exportDataToCsvFile({
    //                 token: authenticatedUser?.token || "",
    //                 apiUrl: `${process.env.NEXT_PUBLIC_EXPORT_ITR_TO_EXCEL}?${queryString}` as string,
    //                 type: 'ITR',
    //             }));
    //         }

    //         if (tab === 'IT') {
    //             dispatch(exportDataToCsvFile({
    //                 token: authenticatedUser?.token || "",
    //                 apiUrl: `${process.env.NEXT_PUBLIC_EXPORT_IT_TO_EXCEL}?${queryString}` as string,
    //                 type: 'IT',
    //             }));
    //         }

    //         if (tab === 'TR') {
    //             dispatch(exportDataToCsvFile({
    //                 token: authenticatedUser?.token || "",
    //                 apiUrl: `${process.env.NEXT_PUBLIC_EXPORT_TR_TO_EXCEL}?${queryString}` as string,
    //                 type: 'TR',
    //             }));
    //         }
    //     }

    //     // const rightNow = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
    //     // if (tab === 'ITR') exportToCSV(paginatedData, `${rightNow} - Inventory Transfer Request.csv`);
    //     // else if (tab === 'TR') exportToCSV(paginatedData_TR, `${rightNow} - Transfer Request.csv`);
    //     // else if (tab === 'IT') exportToCSV(paginatedData_IT, `${rightNow} - Inventory Transfer.csv`);
    // };

    // Note: Mounted effect to fetch ITR data initially...!
    useEffect(() => {
        if (authenticatedUser) {
            setLoading(true);
            dispatch(fetchAll_GRNS({
                token: authenticatedUser?.token || "",
                handleLoading: () => setLoading(false),
                apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=Pending`
            }));
            dispatch(fetchAllWareHouses({ authToken: authenticatedUser?.token || "" }));
            dispatch(fetchAllVendorCodes(authenticatedUser?.token || ""));
        };
    }, []);

    // Note: This hook will run when wareHousesList state wil update...!
    useEffect(() => {
        if (wareHousesList.data && wareHousesList.data.length > 0) {
            const selectWarehouseOptions: any = wareHousesList?.data.map((wh) => ({
                value: wh.whsCode,
                label: wh.whsName,
            }));
            // console.log("Warehouses options: ", selectWarehouseOptions);
            selectWarehouseOptions && setWarehousesOptions(selectWarehouseOptions);
        };
    }, [wareHousesList.data]);

    // Note: This hook will run when vendorCodeList state wil update...!
    useEffect(() => {
        if (vendorCodeList && vendorCodeList.length > 0) {
            const selectVendorCodeOptions: any = vendorCodeList?.map((vendorCodeVal) => ({
                value: vendorCodeVal.cardCode,
                label: vendorCodeVal.cardName,
            }));
            selectVendorCodeOptions && setVendorCodeOptions(selectVendorCodeOptions);
        };
    }, [vendorCodeList]);

    // useEffect(() => {
    //     if (appliedFilters) {
    //         console.log('Applied filters: ', appliedFilters);
    //     };
    // }, [appliedFilters]);

    return (
        <div>

            {/* Note: Loading component */}
            <Loader loadingState={loading} />

            {/* Note: Screen Head section */}
            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-start"
                p="md"
                bg="gray.0"
                style={{ alignItems: "center" }}
            >
                <Stack gap={4}>
                    <Title
                        order={3}
                        style={{
                            color: customStyles.colors._4D4D4D,
                            fontSize: "24px",
                            fontWeight: 700
                        }}
                    >
                        GRN Movement
                    </Title>

                    <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
                        Track and manage all goods receipt notes to ensure timely, accurate inventory updates and smooth warehouse operations.
                    </Text>
                </Stack>

                <Button
                    leftSection={<IconFileTypeCsv size={20} color={customStyles.colors.white} />}
                    color={customStyles.colors._1B59F8}
                // onClick={handleExportToCSV}
                >
                    Export to CSV
                </Button>
            </Group>

            {/* GRN Filters */}
            <Group grow align="flex-end" p="md" style={{ flexWrap: "wrap" }}>
                {
                    grnFilters.map((filter) => {
                        const label = `Select ${filter}`;

                        if (filter === "SAP Status" || filter === "DOC Status") {
                            const options = filter === "SAP Status" ? sapStatusOptionsGRN : docStatusOptions;

                            return (
                                <Select
                                    key={filter}
                                    label={label}
                                    placeholder={label}
                                    data={options}
                                    value={appliedFilters[filter] || null}
                                    onChange={(value) =>
                                        setAppliedFilters((prev) => ({
                                            ...prev,
                                            [filter]: value || '',
                                        }))
                                    }
                                    clearable
                                />
                            );
                        }

                        if (filter === "Vendor Code") {
                            return (
                                <Select
                                    key={filter}
                                    label={label}
                                    placeholder={label}
                                    data={vendorCodeOptions}
                                    // value={appliedFilters[filter] || ''}
                                    value={appliedFilters[filter] || null}
                                    onChange={(value) => {
                                        setAppliedFilters((prev) => ({
                                            ...prev,
                                            [filter]: value || '',
                                        }));
                                    }}
                                    searchable
                                />
                            );
                        }

                        if (filter === "Warehouse") {
                            return (
                                <Select
                                    key={filter}
                                    label={label}
                                    placeholder={label}
                                    data={warehousesOptions}
                                    // value={appliedFilters[filter] || ''}
                                    value={appliedFilters[filter] ? appliedFilters[filter] : null}
                                    onChange={(value) => {
                                        setAppliedFilters((prev) => ({
                                            ...prev,
                                            [filter]: value || '',
                                        }));
                                    }}
                                    searchable
                                />
                            );
                        }

                        if (filter === "Doc Date") {
                            return (
                                <DateInput
                                    key={filter}
                                    label={label}
                                    placeholder={label}
                                    value={appliedFilters[filter] ? new Date(appliedFilters[filter]) : null}
                                    onChange={(date) =>
                                        setAppliedFilters((prev) => ({
                                            ...prev,
                                            [filter]: date ? new Date(date).toISOString().split('T')[0] : '',
                                        }))
                                    }
                                    clearable
                                    size="sm"
                                    onKeyDown={(e) => e.preventDefault()}
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
                            );
                        }

                        if (filter === "Item Code") {
                            return (
                                <TextInput
                                    key={filter}
                                    label={label}
                                    placeholder={label}
                                    value={appliedFilters?.[filter] ?? ''}
                                    onChange={(e) =>
                                        setAppliedFilters((prev) => ({
                                            ...prev,
                                            [filter]: e.target.value,
                                        }))
                                    }
                                />
                            );
                        }

                        return null;
                    })
                }

                <Button
                    mt="xs"
                    onClick={() => {
                        const cleanedFilters = Object.entries(appliedFilters)
                            .filter(([_, value]) => value && value.trim() !== '')
                            .reduce((acc, [key, value]) => {
                                console.log('Key: ', key);
                                const paramKey = apiFilterParamsForGRNS[grnFilters.indexOf(key)];
                                if (paramKey) acc[paramKey] = value;
                                return acc;
                            }, {} as Record<string, string>);

                        const queryString = new URLSearchParams(cleanedFilters).toString();
                        const modifiedUrl = `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?${queryString}`;
                        console.log('Modified URL:', modifiedUrl);

                        setLoading(true);
                        dispatch(fetchAll_GRNS({
                            token: authenticatedUser?.token || "",
                            handleLoading: () => setLoading(false),
                            apiUrl: modifiedUrl
                        }));
                    }}
                    disabled={Object.values(appliedFilters).every(v => !v || v.trim() === '')}
                >
                    Apply Filters
                </Button>

                <Button
                    variant="outline"
                    color="red"
                    mt="xs"
                    onClick={() => {
                        setAppliedFilters({});
                        setLoading(true);
                        dispatch(fetchAll_GRNS({
                            token: authenticatedUser?.token || "",
                            handleLoading: () => setLoading(false),
                            apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=Pending`
                        }));
                    }}
                >
                    Clear All
                </Button>
            </Group>


            <div style={{ padding: 10, paddingTop: 20 }}>
                <ScrollArea type='auto'>
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
                                paginatedData?.map((row: any, index) => {
                                    return (
                                        <Table.Tr key={row.id}>
                                            <Table.Td>{(activePage - 1) * itemsPerPage + index + 1}</Table.Td>
                                            <Table.Td>{row.docNum}</Table.Td>
                                            <Table.Td>{`${new Date(row.updatedDate).toLocaleDateString()}`}</Table.Td>
                                            <Table.Td>{row.whsCode}</Table.Td>
                                            <Table.Td>{row.vendorCode}</Table.Td>
                                            <Table.Td>{row.docStatus}</Table.Td>
                                            <Table.Td>{row.itemCode}</Table.Td>
                                            <Table.Td>{row.itemName}</Table.Td>
                                            <Table.Td>{(row.erpDocEntry) ? (row.erpDocEntry) : ("-")}</Table.Td>
                                            <Table.Td>{(row.erpDocLine) ? (row.erpDocLine) : ("-")}</Table.Td>
                                            <Table.Td>{row.sapStatus}</Table.Td>
                                            <Table.Td>{row.userName}</Table.Td>
                                        </Table.Tr>
                                    )
                                })
                            }

                        </Table.Tbody>
                    </Table>

                    {/* Note: If no data found */}
                    {paginatedData.length < 1 && <DataNotFound notFoundContent={sapErrorState || "No data found."} />}
                </ScrollArea>

                {
                    paginatedData.length > 0 &&
                    <Flex
                        justify={customStyles.alignment.spaceBetween}
                        align={customStyles.alignment.center}
                        mb="md"
                        wrap="wrap"
                        gap="sm"
                        mt={'1%'}
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
                }
            </div>
        </div>
    );
};

export default GRNMovementScreen;