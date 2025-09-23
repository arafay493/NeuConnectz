// Note: Integration component...!

import { localAssets } from '@/lib/file-paths/file-paths';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { fetchDashboardAnalytics } from '@/redux/actions/dashboard-actions/dashboard-actions';
import { fetchAll_GRNS, fetchAllITR_IT_TRS, postRequestToSAP } from '@/redux/actions/sap-actions/sap-actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { GRN_Props, IT_TR_ITR_Props } from '@/types/redux-types';
import { useMediaQuery } from "@mantine/hooks";
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Grid,
    Group,
    Image,
    Select,
    Stack,
    Text,
    ThemeIcon,
    Title,
    ScrollArea,
    Flex,
    SegmentedControl
} from '@mantine/core';
import {
    IconArrowNarrowDown,
    IconArrowNarrowUp,
    IconArrowsUpDown,
    IconBorderCorners,
    IconChartBar,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconColumns,
    IconFilter,
    IconFilterOff,
    IconSearch,
    IconSearchOff,
    IconCheckbox,
    IconReload
} from "@tabler/icons-react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
import NextImage from 'next/image';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { GlobalSearchFilter } from '../table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';
import classes from "../production-order-section-component/po.module.css";
import Loader from '@/components/loader/loader';

const cardsData = [
    {
        title: "Inventory Transfer Request",
        label: "ITR",
        pendingValue: "totalItrPending",
        integratedValue: "totalItrIntegrated",
        lastIntegrationDate: "lastItrIntegrationDate",
        color: "#FA5A7D"
    },
    {
        title: "Inventory Transfer",
        label: "IT",
        pendingValue: "totalItPending",
        integratedValue: "totalItIntegrated",
        lastIntegrationDate: "lastItIntegrationDate",
        color: "#FF947A"
    },
    {
        title: "Transfer Request",
        label: "TR",
        pendingValue: "totalTrPending",
        integratedValue: "totalTrIntegrated",
        lastIntegrationDate: "lastTrIntegrationDate",
        color: "#3CD856"
    },
    {
        title: "Goods Issue",
        label: "GI",
        pendingValue: "totalGoodIssuePending",
        integratedValue: "totalGoodIssueIntegrated",
        lastIntegrationDate: "",
        color: "#BF83FF"
    },
    // {
    //     label: "GR",
    //     pendingValue: "",
    //     integratedValue: "",
    //     lastIntegrationDate: ""
    // },
    {
        title: "Goods Receipt Notes",
        label: "GRN",
        pendingValue: "totalGrnPending",
        integratedValue: "totalGrnIntegrated",
        lastIntegrationDate: "lastGrnIntegrationDate",
        color: "#5BB0FF"
    },

    {
        title: "Issue For Production",
        label: "IFP",
        pendingValue: "totalIssueForProductionPending",
        integratedValue: "totalIssueForProductionIntegrated",
        lastIntegrationDate: "",
        color: "#5181FF"
    },

    {
        title: "Receipt From Production",
        label: "RFP",
        pendingValue: "totalReceiptFromProductionPending",
        integratedValue: "totalReceiptFromProductionIntegrated",
        lastIntegrationDate: "",
        color: "#5BB0FF"
    },
];

// GRN Table Props...!
type TableProps = {
    type: "Pending" | "Integrated";
    areTableFiltersVisible: boolean;
    isLoading?: boolean;
};

// Stock Movement Table Props...!
type SMTableProps = {
    type: "Pending" | "Integrated";
    sapType?: "ITR" | "IT" | "TR";
    areTableFiltersVisible: boolean;
    isLoading?: boolean;
};

// Note: Utility function to calculate optimal column width
const calculateColumnWidth = (headerText: string, sampleValues: string[], minWidth: number = 80, maxWidth: number = 300) => {
    // Calculate width based on header text (approximate 8px per character)
    const headerWidth = headerText.length * 8 + 40; // +40 for padding

    // Calculate width based on longest sample value
    const maxValueLength = sampleValues.reduce((max, value) => {
        return Math.max(max, String(value).length);
    }, 0);
    const valueWidth = maxValueLength * 8 + 40; // +40 for padding

    // Return the larger of header or content width, within min/max bounds
    return Math.min(Math.max(Math.max(headerWidth, valueWidth), minWidth), maxWidth);
};

// Note: GRN_Table_Component...!
const GRN_Table_Component: React.FC<TableProps> = ({ type, areTableFiltersVisible }) => {

    // Note: Handling states here...!
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
    };

    // Note: Handling redux here...!
    const dispatch = useAppDispatch();

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { list_GRNS_Data, totalGRNS_DataCounts } = useAppSelector(({ sapStates }) => { return sapStates });

    // Note: State for Filters
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Custom filter functions for specific column types
    const serialNumberFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        // Calculate serial number based on the current row's position in the filtered data
        const serialNumber = row.index + 1;
        return String(serialNumber).includes(value);
    };

    const dateFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        const cellValue = row.getValue(columnId);
        if (!cellValue) return false;
        const date = new Date(cellValue as string);
        const dateValue = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
        return dateValue.toLowerCase().includes(value.toLowerCase());
    };

    const numberFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(value.toLowerCase());
    };

    const stringFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(value.toLowerCase());
    };

    // Note: Columns Data for GRN Table
    const columns = useMemo<ColumnDef<GRN_Props>[]>(
        () => [
            {
                id: 'serialNumber', // Use id instead of accessorKey for computed columns
                header: 'S.No',
                cell: ({ row }) => {
                    // Calculate serial number based on server-side pagination
                    const serialNumber = (pagination.pageIndex * pagination.pageSize) + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
                filterFn: serialNumberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('S.No', ['99999'], 80, 120),
            },
            {
                id: 'type', // Static value column
                header: 'Type',
                cell: () => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        GRN
                    </Text>
                ),
                filterFn: (row: any, columnId: string, value: string) => {
                    if (!value) return true;
                    return 'GRN'.toLowerCase().includes(value.toLowerCase());
                },
                enableColumnFilter: true,
                size: calculateColumnWidth('Type', ['GRN'], 80, 120),
            },
            {
                accessorKey: 'docNum',
                header: 'Number',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Number', list_GRNS_Data.map(item => String(item.docNum)), 120, 200),
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Item Code', list_GRNS_Data.map(item => item.itemCode), 150, 250),
            },
            {
                accessorKey: 'whsCode',
                header: 'Warehouse',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Warehouse', list_GRNS_Data.map(item => item.whsCode), 120, 200),
            },
            {
                accessorKey: 'vendorCode',
                header: 'Vendor',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Vendor', list_GRNS_Data.map(item => item.vendorCode), 120, 200),
            },
            {
                accessorKey: 'userName',
                header: 'User Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('User Name', list_GRNS_Data.map(item => item.userName), 150, 250),
            },
            {
                accessorKey: 'erpDocEntry',
                header: 'ERP Doc Entry',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() ? String(getValue()) : '-'}
                    </Text>
                ),
                filterFn: numberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('ERP Doc Entry', list_GRNS_Data.map(item => item.erpDocEntry ? String(item.erpDocEntry) : '-'), 140, 220),
            },
            {
                accessorKey: 'erpDocLine',
                header: 'ERP Line ID',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() ? String(getValue()) : '-'}
                    </Text>
                ),
                filterFn: numberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('ERP Line ID', list_GRNS_Data.map(item => item.erpDocLine ? String(item.erpDocLine) : '-'), 130, 200),
            },
            {
                accessorKey: 'sapStatus',
                header: 'SAP Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('SAP Status', list_GRNS_Data.map(item => item.sapStatus), 120, 180),
            },
            {
                accessorKey: 'docStatus',
                header: 'Doc Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Doc Status', list_GRNS_Data.map(item => item.docStatus), 120, 180),
            },
            {
                accessorKey: 'updatedDate',
                header: 'Doc Date',
                cell: ({ getValue }) => {
                    const date = new Date(getValue() as string);
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {`${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`}
                        </Text>
                    );
                },
                filterFn: dateFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Doc Date', ['00:00:00 AM - 00/00/0000'], 180, 250),
            },
        ],
        [list_GRNS_Data]
    );

    // Custom global filter function to handle columns properly
    const globalFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;

        // Get the search value in lowercase for case-insensitive search
        const searchValue = value.toLowerCase();

        // Get the cell value
        const cellValue = row.getValue(columnId);

        // Handle S.No column (computed value)
        if (columnId === 'serialNumber') {
            const serialNumber = row.index + (table?.getState?.()?.pagination?.pageIndex || 0) * (table?.getState?.()?.pagination?.pageSize || 10) + 1;
            return String(serialNumber).includes(value);
        }

        // Handle updatedDate column (formatted date)
        if (columnId === 'updatedDate') {
            const date = new Date(cellValue as string);
            const formattedDate = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
            return formattedDate.toLowerCase().includes(searchValue);
        }

        // Handle other columns (convert to string and search)
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    // Note: Table Definition
    const table = useReactTable({
        data: list_GRNS_Data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: (value) => {
            setGlobalFilter(value);
            // Reset to first page when global filter changes
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            // Reset to first page when column filters change
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        globalFilterFn: (row, columnId, value) => {
            // Handle S.No column separately for global search
            if (row.index + 1 && String(row.index + 1).includes(value)) {
                return true;
            }

            // Handle Type column separately (always 'GRN')
            if ('GRN'.toLowerCase().includes(value.toLowerCase())) {
                return true;
            }

            // Get all column IDs to search across
            const columnIds = ['docNum', 'itemCode', 'whsCode', 'vendorCode', 'userName', 'erpDocEntry', 'erpDocLine', 'sapStatus', 'docStatus', 'updatedDate'];

            // Search across all columns
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        onPaginationChange: setPagination,
        manualPagination: false,
        state: {
            sorting,
            globalFilter,
            columnFilters,
            pagination,
        },
    });

    const numbersArray = useMemo<number[]>(() => {
        return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
    }, [table.getPageCount()]);

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            dispatch(fetchAll_GRNS({
                token: authenticatedUser?.token || "",
                handleLoading: () => setIsLoading(false),
                apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${type}` || "",
                lastCount: 1000,
                skipRecords: 0
            }));
        };
    }, [authenticatedUser, type]);

    return (
        <>
            {/* Global Search Filter for GRN Table */}
            {/* <Group mb={16}>
                <GlobalSearchFilter
                    filters={globalFilter}
                    setFilters={setGlobalFilter}
                    isSearchInputVisible={isSearchInputVisible}
                />
                {
                    !isSearchInputVisible ?
                        <IconSearch cursor="pointer" size={24} onClick={handleSearchInputVisibility} /> : <IconSearchOff cursor="pointer" size={24} onClick={handleSearchInputVisibility} />
                }
            </Group> */}

            <Box
                // className="show-scroll-bar-overflow"
                w="100%"
                mah={700}
                className={"custom-scroll"} style={{ overflow: "auto" }}
            >
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: 'max-content'
                }}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} style={{
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        padding: '0 16px 24px 16px',
                                        borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#E5E5E5'}`,
                                        width: `${header.getSize()}px`,
                                        minWidth: `${header.getSize()}px`,
                                        maxWidth: 'max-content',
                                        verticalAlign: 'top',
                                    }}>
                                        <Group
                                            wrap="nowrap"
                                            gap={6}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <Text style={{ whiteSpace: 'nowrap' }} fw={600} c={customStyles.colors._4D4D4D}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </Text>
                                            {header.column.getCanSort() && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    size="xs"
                                                    c={customStyles.colors._4D4D4D}
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    ml={4}
                                                >
                                                    {(() => {
                                                        const sortDirection = header.column.getIsSorted();
                                                        if (sortDirection === 'asc') {
                                                            return <IconArrowNarrowUp size={16} />;
                                                        } else if (sortDirection === 'desc') {
                                                            return <IconArrowNarrowDown size={16} />;
                                                        } else {
                                                            return <IconArrowsUpDown size={16} />;
                                                        }
                                                    })()}
                                                </ActionIcon>
                                            )}
                                        </Group>
                                        {/* Note: Table Filter Input */}
                                        {
                                            header.column.getCanFilter() && (
                                                <TableColumnsFilter
                                                    areTableFiltersVisible={areTableFiltersVisible}
                                                    placeholder={header.column.columnDef.header as string}
                                                    value={header.column.getFilterValue() as string ?? ''}
                                                    setValue={value => header.column.setFilterValue(value)}
                                                />
                                            )
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: pagination.pageSize }).map((_, index) => (
                                <tr key={`loading-${index}`} style={{
                                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                }}>
                                    {columns.map((_, colIndex) => (
                                        <td key={`loading-cell-${colIndex}`} style={{
                                            textAlign: 'left',
                                            padding: '16px',
                                        }}>
                                            <Box
                                                h={20}
                                                bg={customStyles.colors._E1E7EC || '#F0F0F0'}
                                                style={{
                                                    borderRadius: '4px',
                                                    animation: 'pulse 1.5s ease-in-out infinite'
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} style={{
                                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                }}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} style={{
                                            textAlign: 'left',
                                            padding: '16px',
                                            width: `${cell.column.getSize()}px`,
                                            minWidth: `${cell.column.getSize()}px`,
                                            maxWidth: 'max-content',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            verticalAlign: 'middle',
                                        }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} style={{
                                    textAlign: 'center',
                                    padding: '32px 16px',
                                    borderBottom: 'none'
                                }}>
                                    <Stack justify="center" align="center">
                                        <Image w={180} h={180} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
                                        <Title order={4} c={customStyles.colors._4D4D4D}>No Data Found</Title>
                                    </Stack>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>

            {/* Pagination */}
            <Box
                mt={12}
                bg={customStyles.colors.white}
                style={{ borderRadius: '16px', padding: "12px 24px" }}
            >
                <Group justify="space-between" align="center">
                    {/* Left side - Page navigation */}
                    <Group justify="flex-start" align="center" gap="xs">
                        <ActionIcon
                            className={!table.getCanPreviousPage() ? 'pagination-icon-disabled' : 'pagination-icon'}
                            variant="transparent"
                            size="lg"
                            h={36}
                            w={36}
                            radius={8}
                            c={customStyles.colors._909090}
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <IconChevronLeft size={18} />
                        </ActionIcon>

                        <Group gap="xs" align="center">
                            <Select
                                w={80}
                                radius={8}
                                rightSection={<IconChevronDown size={18} />}
                                data={numbersArray.map(num => ({ value: String(num), label: String(num) }))}
                                styles={{
                                    input: {
                                        border: `1px solid ${customStyles.colors._E1E7EC}`
                                    }
                                }}
                                max={table.getPageCount()}
                                value={String(table.getState().pagination.pageIndex + 1)}
                                onChange={value => {
                                    const page = value ? Number(value) - 1 : 0
                                    table.setPageIndex(page)
                                }}
                            />
                        </Group>

                        <ActionIcon
                            className={!table.getCanNextPage() ? 'pagination-icon-disabled' : 'pagination-icon'}
                            variant="transparent"
                            size="lg"
                            h={36}
                            w={36}
                            radius={8}
                            c={customStyles.colors._909090}
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <IconChevronRight size={18} />
                        </ActionIcon>
                        <Text size="md" c={customStyles.colors._4D4D4D}>
                            / {table.getPageCount()} pages
                        </Text>
                    </Group>

                    {/* Right side - Page size selector and info */}
                    <Group gap="md" align="center">
                        <Group gap="xs" align="center">
                            <Text size="sm" c={customStyles.colors._909090}>
                                Show
                            </Text>
                            <Select
                                w={80}
                                radius={8}
                                rightSection={<IconChevronDown size={18} />}
                                data={[
                                    { value: '5', label: '5' },
                                    { value: '10', label: '10' },
                                    { value: '20', label: '20' },
                                    { value: '50', label: '50' },
                                    { value: '100', label: '100' }
                                ]}
                                styles={{
                                    input: {
                                        border: `1px solid ${customStyles.colors._E1E7EC}`
                                    }
                                }}
                                value={String(pagination.pageSize)}
                                onChange={value => {
                                    const newPageSize = value ? Number(value) : 10;
                                    table.setPageSize(newPageSize);
                                }}
                            />
                            <Text size="sm" c={customStyles.colors._909090}>
                                per page
                            </Text>
                        </Group>

                        <Text size="sm" c={customStyles.colors._909090}>
                            Showing {(pagination.pageIndex * pagination.pageSize) + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalGRNS_DataCounts)} of {totalGRNS_DataCounts} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </>
    );
};

// Note: Stock_Movement_Table_Component...!
const Stock_Movement_Table_Component: React.FC<SMTableProps> = ({ type, sapType, areTableFiltersVisible, isLoading }) => {

    // Note: Handeling states here...!
    const [loading, setLoading] = useState(false);
    const [activePage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);

    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
    };

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { listAll_ITR_IT_TRS, sapErrorState, listAll_ITR_IT_TRS_Count } = useAppSelector(({ sapStates }) => { return sapStates });
    const totalPages = Math.ceil(listAll_ITR_IT_TRS_Count / itemsPerPage);

    const handleNewPage = (newPage: number) => {
        setPage(newPage);
    };

    // Note: State for Filters
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // Custom filter functions for specific column types
    const serialNumberFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        // Calculate serial number based on the current row's position in the filtered data
        const serialNumber = row.index + 1;
        return String(serialNumber).includes(value);
    };

    const dateFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        const cellValue = row.getValue(columnId);
        if (!cellValue) return false;
        const date = new Date(cellValue as string);
        const dateValue = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
        return dateValue.toLowerCase().includes(value.toLowerCase());
    };

    const numberFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(value.toLowerCase());
    };

    const stringFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;
        const cellValue = row.getValue(columnId);
        if (cellValue == null) return false;
        return String(cellValue).toLowerCase().includes(value.toLowerCase());
    };

    // Note: Columns Data for Stock Movement Table
    const columns = useMemo<ColumnDef<IT_TR_ITR_Props>[]>(
        () => [
            {
                id: 'serialNumber', // Use id instead of accessorKey for computed columns
                header: 'S.No',
                cell: ({ row }) => {
                    // Calculate serial number based on server-side pagination
                    const serialNumber = (pagination.pageIndex * pagination.pageSize) + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
                filterFn: serialNumberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('S.No', ['99999'], 80, 120),
            },
            {
                accessorKey: 'type',
                header: 'Type',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Type', listAll_ITR_IT_TRS.map(item => item.type), 80, 120),
            },
            {
                accessorKey: 'docNumber',
                header: 'Number',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() ? String(getValue()) : '-'}
                    </Text>
                ),
                filterFn: numberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Number', listAll_ITR_IT_TRS.map(item => item.docNumber ? String(item.docNumber) : '-'), 120, 200),
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Item Code', listAll_ITR_IT_TRS.map(item => item.itemCode), 150, 250),
            },
            {
                accessorKey: 'fromWarehouse',
                header: 'From Warehouse',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('From Warehouse', listAll_ITR_IT_TRS.map(item => item.fromWarehouse), 150, 250),
            },
            {
                accessorKey: 'toWarehouse',
                header: 'To Warehouse',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('To Warehouse', listAll_ITR_IT_TRS.map(item => item.toWarehouse), 150, 250),
            },
            {
                accessorKey: 'userName',
                header: 'User Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('User Name', listAll_ITR_IT_TRS.map(item => item.userName), 150, 250),
            },
            {
                accessorKey: 'erpDocEntry',
                header: 'ERP Doc Entry',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() ? String(getValue()) : '-'}
                    </Text>
                ),
                filterFn: numberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('ERP Doc Entry', listAll_ITR_IT_TRS.map(item => item.erpDocEntry ? String(item.erpDocEntry) : '-'), 140, 220),
            },
            {
                accessorKey: 'erpLineID',
                header: 'ERP Line ID',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() ? String(getValue()) : '-'}
                    </Text>
                ),
                filterFn: numberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('ERP Line ID', listAll_ITR_IT_TRS.map(item => item.erpLineID ? String(item.erpLineID) : '-'), 130, 200),
            },
            {
                accessorKey: 'status',
                header: 'SAP Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('SAP Status', listAll_ITR_IT_TRS.map(item => item.status), 120, 180),
            },
            {
                accessorKey: 'docStatus',
                header: 'Doc Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Doc Status', listAll_ITR_IT_TRS.map(item => item.docStatus), 120, 180),
            },
            {
                accessorKey: 'updatedDate',
                header: 'Doc Date',
                cell: ({ getValue }) => {
                    const date = new Date(getValue() as string);
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {`${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`}
                        </Text>
                    );
                },
                filterFn: dateFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Doc Date', ['00:00:00 AM - 00/00/0000'], 180, 250),
            },
        ],
        [listAll_ITR_IT_TRS]
    );

    // Custom global filter function to handle columns properly
    const globalFilterFnSM = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;

        // Get the search value in lowercase for case-insensitive search
        const searchValue = value.toLowerCase();

        // Get the cell value
        const cellValue = row.getValue(columnId);

        // Handle updatedDate column (formatted date)
        if (columnId === 'updatedDate') {
            const date = new Date(cellValue as string);
            const formattedDate = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
            return formattedDate.toLowerCase().includes(searchValue);
        }

        // Handle other columns (convert to string and search)
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    // Note: Table Definition
    const table = useReactTable({
        data: listAll_ITR_IT_TRS,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Remove client-side filtering and sorting for server-side pagination
        // getFilteredRowModel: getFilteredRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: (value) => {
            setGlobalFilter(value);
            // Reset to first page when global filter changes
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            // Reset to first page when column filters change
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        globalFilterFn: (row, columnId, value) => {
            // Handle S.No column separately for global search
            if (row.index + 1 && String(row.index + 1).includes(value)) {
                return true;
            }

            // Get all column IDs to search across
            const columnIds = ['type', 'docNumber', 'itemCode', 'fromWarehouse', 'toWarehouse', 'userName', 'erpDocEntry', 'erpLineID', 'status', 'docStatus', 'updatedDate'];

            // Search across all columns
            return columnIds.some((colId: string) => globalFilterFnSM(row, colId, value));
        },
        onPaginationChange: setPagination,
        manualPagination: true, // Enable server-side pagination
        pageCount: Math.ceil(listAll_ITR_IT_TRS_Count / pagination.pageSize), // Calculate total pages from server data
        state: {
            sorting,
            globalFilter,
            columnFilters,
            pagination,
        },
    });

    const numbersArray = useMemo<number[]>(() => {
        return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
    }, [table.getPageCount()]);

    useEffect(() => {
        if (authenticatedUser?.token) {
            setLoading(true); // Note: Enable loading...!
            const skipRecord = pagination.pageIndex * pagination.pageSize;

            dispatch(fetchAllITR_IT_TRS({
                token: authenticatedUser?.token || "",
                dataStatus: type,
                handleLoading: () => setLoading(false),
                type: sapType != undefined ? sapType : undefined,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecord
            }));
        };
    }, [authenticatedUser, type, sapType, pagination.pageIndex, pagination.pageSize]); // Add pagination dependencies

    return (
        <>
            {/* Global Search Filter for Stock Movement Table */}
            {/* <Group justify='flex-end' mb={16}>
                <GlobalSearchFilter
                    filters={globalFilter}
                    setFilters={setGlobalFilter}
                    isSearchInputVisible={isSearchInputVisible}
                />
                {
                    !isSearchInputVisible ?
                        <IconSearch cursor="pointer" size={24} onClick={handleSearchInputVisibility} /> : <IconSearchOff cursor="pointer" size={24} onClick={handleSearchInputVisibility} />
                }
            </Group> */}

            <Box
                w="100%"
                mah={700}
                className={"custom-scroll"} style={{ overflow: "auto" }}
            >
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: 'max-content'
                }}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} style={{
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        padding: '0 16px 24px 16px',
                                        borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#E5E5E5'}`,
                                        width: `${header.getSize()}px`,
                                        minWidth: `${header.getSize()}px`,
                                        maxWidth: 'max-content',
                                        verticalAlign: 'top',
                                    }}>
                                        <Group
                                            wrap="nowrap"
                                            gap={6}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <Text style={{ whiteSpace: 'nowrap' }} fw={600} c={customStyles.colors._4D4D4D}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </Text>
                                            {header.column.getCanSort() && (
                                                <ActionIcon
                                                    variant="subtle"
                                                    size="xs"
                                                    c={customStyles.colors._4D4D4D}
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    ml={4}
                                                >
                                                    {(() => {
                                                        const sortDirection = header.column.getIsSorted();
                                                        if (sortDirection === 'asc') {
                                                            return <IconArrowNarrowUp size={16} />;
                                                        } else if (sortDirection === 'desc') {
                                                            return <IconArrowNarrowDown size={16} />;
                                                        } else {
                                                            return <IconArrowsUpDown size={16} />;
                                                        }
                                                    })()}
                                                </ActionIcon>
                                            )}
                                        </Group>
                                        {/* Note: Table Filter Input */}
                                        {
                                            header.column.getCanFilter() && (
                                                <TableColumnsFilter
                                                    areTableFiltersVisible={areTableFiltersVisible}
                                                    placeholder={header.column.columnDef.header as string}
                                                    value={header.column.getFilterValue() as string ?? ''}
                                                    setValue={value => header.column.setFilterValue(value)}
                                                />
                                            )
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: pagination.pageSize }).map((_, index) => (
                                <tr key={`loading-${index}`} style={{
                                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                }}>
                                    {columns.map((_, colIndex) => (
                                        <td key={`loading-cell-${colIndex}`} style={{
                                            textAlign: 'left',
                                            padding: '16px',
                                        }}>
                                            <Box
                                                h={20}
                                                bg={customStyles.colors._E1E7EC || '#F0F0F0'}
                                                style={{
                                                    borderRadius: '4px',
                                                    animation: 'pulse 1.5s ease-in-out infinite'
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} style={{
                                    borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                }}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} style={{
                                            textAlign: 'left',
                                            padding: '16px',
                                            width: `${cell.column.getSize()}px`,
                                            minWidth: `${cell.column.getSize()}px`,
                                            maxWidth: 'max-content',
                                            verticalAlign: 'middle',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} style={{
                                    textAlign: 'center',
                                    padding: '32px 16px',
                                    borderBottom: 'none'
                                }}>
                                    <Stack justify="center" align="center">
                                        <Image w={180} h={180} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
                                        <Title order={4} c={customStyles.colors._4D4D4D}>No Data Found</Title>
                                    </Stack>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box >

            {/* Pagination */}
            <Box
                mt={12}
                bg={customStyles.colors.white}
                style={{ borderRadius: '16px', padding: "12px 24px" }}
            >
                <Group justify="space-between" align="center">
                    {/* Left side - Page navigation */}
                    <Group justify="flex-start" align="center" gap="xs">
                        <ActionIcon
                            className={!table.getCanPreviousPage() ? 'pagination-icon-disabled' : 'pagination-icon'}
                            variant="transparent"
                            size="lg"
                            h={36}
                            w={36}
                            radius={8}
                            c={customStyles.colors._909090}
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <IconChevronLeft size={18} />
                        </ActionIcon>

                        <Group gap="xs" align="center">
                            <Select
                                w={80}
                                radius={8}
                                rightSection={<IconChevronDown size={18} />}
                                data={numbersArray.map(num => ({ value: String(num), label: String(num) }))}
                                styles={{
                                    input: {
                                        border: `1px solid ${customStyles.colors._E1E7EC}`
                                    }
                                }}
                                max={table.getPageCount()}
                                value={String(table.getState().pagination.pageIndex + 1)}
                                onChange={value => {
                                    const page = value ? Number(value) - 1 : 0
                                    table.setPageIndex(page)
                                }}
                            />
                        </Group>

                        <ActionIcon
                            className={!table.getCanNextPage() ? 'pagination-icon-disabled' : 'pagination-icon'}
                            variant="transparent"
                            size="lg"
                            h={36}
                            w={36}
                            radius={8}
                            c={customStyles.colors._909090}
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <IconChevronRight size={18} />
                        </ActionIcon>
                        <Text size="md" c={customStyles.colors._4D4D4D}>
                            / {table.getPageCount()} pages
                        </Text>
                    </Group>

                    {/* Right side - Page size selector and info */}
                    <Group gap="md" align="center">
                        <Group gap="xs" align="center">
                            <Text size="sm" c={customStyles.colors._909090}>
                                Show
                            </Text>
                            <Select
                                w={80}
                                radius={8}
                                rightSection={<IconChevronDown size={18} />}
                                data={[
                                    { value: '5', label: '5' },
                                    { value: '10', label: '10' },
                                    { value: '20', label: '20' },
                                    { value: '50', label: '50' },
                                    { value: '100', label: '100' }
                                ]}
                                styles={{
                                    input: {
                                        border: `1px solid ${customStyles.colors._E1E7EC}`
                                    }
                                }}
                                value={String(pagination.pageSize)}
                                onChange={value => {
                                    const newPageSize = value ? Number(value) : 10;
                                    table.setPageSize(newPageSize);
                                }}
                            />
                            <Text size="sm" c={customStyles.colors._909090}>
                                per page
                            </Text>
                        </Group>

                        <Text size="sm" c={customStyles.colors._909090}>
                            Showing {(pagination.pageIndex * pagination.pageSize) + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, listAll_ITR_IT_TRS_Count)} of {listAll_ITR_IT_TRS_Count} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </>
    );
};

const handleGlobalSearch = (value: string) => {

};

const IntegrationComponent = () => {

    const isLargeScreen = useMediaQuery("(min-width: 992px)");

    // Note: Handling states here...!
    const [statusColor, setStatusColor] = useState<"Pending" | "Integrated">("Pending");
    const [selectedType, setSelectedType] = useState("");
    const [loading, setLoading] = useState(false);
    const [headerBtnType, setHeaderBtnType] = useState<"Stock Movement" | "GRN">("Stock Movement");
    const [dataLoading, setDataLoading] = useState(false);
    const [mouseover, setMouseover] = useState(false)

    // Note: State for Table Filters and Search
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
    };

    const handleTableFiltersVisibility = () => {
        setAreTableFiltersVisible(!areTableFiltersVisible);
    };

    // Note: Handling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => { return dashboardStates });
    // console.log('Stats: ', dashboardAnalyticsData);
    console.log('User: ', authenticatedUser);

    // Note: Function to shoe pending and integrated values...!
    const showPendingAndIntegratedValues = (sapType: string, value: string) => {
        // console.log("SAP type: ", sapType, "Val: ", value);

        if (sapType === "ITR" || sapType === "IT" || sapType === "TR") {
            const { transferStatistics } = dashboardAnalyticsData || {};
            const pendingValue = transferStatistics ? transferStatistics[value as keyof typeof transferStatistics] : 0;
            return pendingValue;
        }

        if (sapType === "GRN") {
            const { grnStatistics } = dashboardAnalyticsData || {};
            const pendingValue = grnStatistics ? grnStatistics[value as keyof typeof grnStatistics] : 0;
            return pendingValue;
        };

        if (sapType === "GI") {
            const { goodIssueStatistics } = dashboardAnalyticsData || {};
            const pendingValue = goodIssueStatistics ? goodIssueStatistics[value as keyof typeof goodIssueStatistics] : 0;
            return pendingValue;
        };

        if (sapType === "IFP") {
            const { issueForProductionStatistics } = dashboardAnalyticsData || {};
            const pendingValue = issueForProductionStatistics ? issueForProductionStatistics[value as keyof typeof issueForProductionStatistics] : 0;
            return pendingValue;
        };

        if (sapType === "RFP") {
            const { receiptFromProductionStatistics } = dashboardAnalyticsData || {};
            const pendingValue = receiptFromProductionStatistics ? receiptFromProductionStatistics[value as keyof typeof receiptFromProductionStatistics] : 0;
            return pendingValue;
        };

        return 0;
    };

    // Note: Function to show time / minutes...!
    const showTime = (dateVal: string) => {

        const { lastIntegrationDates } = dashboardAnalyticsData || {};
        const lastIntegrationDateValue = lastIntegrationDates ? lastIntegrationDates[dateVal as keyof typeof lastIntegrationDates] : 0;

        if (!lastIntegrationDateValue) return "No data";

        const start = new Date(lastIntegrationDateValue);
        const end = new Date();

        const diffInMs = end.getTime() - start.getTime();

        const totalSeconds = Math.floor(diffInMs / 1000);
        const totalMinutes = Math.floor(diffInMs / (1000 * 60));
        const totalHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const totalDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        if (totalSeconds < 60) return "just now";
        if (totalMinutes < 60) return `${totalMinutes} minute${totalMinutes > 1 ? "s" : ""} ago`;
        if (totalHours < 24) return `${totalHours} hour${totalHours > 1 ? "s" : ""} ago`;
        if (totalDays < 7) return `${totalDays} day${totalDays > 1 ? "s" : ""} ago`;

        const totalWeeks = Math.floor(totalDays / 7);
        if (totalWeeks < 4) return `${totalWeeks} week${totalWeeks > 1 ? "s" : ""} ago`;

        const totalMonths = Math.floor(totalDays / 30);
        if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? "s" : ""} ago`;

        const totalYears = Math.floor(totalDays / 365);

        if (totalYears == 1) return `1 year ago`;
        else return `Long time ago`;

    };

    // Note: Handle disable values...!
    const handleDisable = (pendingVal: string, integratedVal: string) => {

        const statsData = { ...dashboardAnalyticsData?.transferStatistics, ...dashboardAnalyticsData?.grnStatistics };

        const isPendingVal0 = statsData[pendingVal as keyof typeof statsData];
        if (isPendingVal0 == 0) return true;
        return false;
    };

    // Note: post request to SAP api response handler...!
    const handleResponse = (response: any): void => {
        // console.log('Res in component: ', response);

        if (response && response.status == 201) {
            if (response?.data?.data?.success) {
                showNotificationToast("Successful", response?.data?.data?.message, customStyles.colors._408CCE);
                dispatch(fetchDashboardAnalytics(authenticatedUser?.token as string,)); // For data updating purpose...!

                if (headerBtnType == "Stock Movement") {
                    dispatch(fetchAllITR_IT_TRS({
                        token: authenticatedUser?.token as string,
                        dataStatus: statusColor,
                        handleLoading: () => setLoading(false),
                        lastCount: 10,
                        skipRecords: 0
                    }));
                }

                else if (headerBtnType == "GRN") {
                    dispatch(fetchAll_GRNS({
                        token: authenticatedUser?.token || "",
                        handleLoading: () => setLoading(false),
                        apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${statusColor}`,
                        lastCount: 10,
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
        setDataLoading(true);

        if (reqData == "ITR") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to ITR",
                apiUrl: process.env.NEXT_PUBLIC_POST_ITR_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }))
                .finally(() => {
                    setDataLoading(false);
                })
            return;
        };

        if (reqData == "TR") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to TR",
                apiUrl: process.env.NEXT_PUBLIC_POST_TR_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }))
                .finally(() => {
                    setDataLoading(false);
                })
            return;
        };

        if (reqData == "IT") {

            const statsData = { ...dashboardAnalyticsData?.transferStatistics, ...dashboardAnalyticsData?.grnStatistics };
            const itrPendingVal = statsData['totalItrPending']

            if (itrPendingVal != undefined && itrPendingVal > 0) {
                showNotificationToast("Warning", "Please post ITR first!", customStyles.colors.red);
                return;
            }

            else if (itrPendingVal == 0) {
                dispatch(postRequestToSAP({
                    token: authenticatedUser?.token as string,
                    type: "Post to IT",
                    apiUrl: process.env.NEXT_PUBLIC_POST_IT_REQUEST_TO_SAP as string,
                    resHandler: handleResponse
                }))
                    .finally(() => {
                        setDataLoading(false);
                    })
                return;
            }
        };

        if (reqData == "GRN") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to GRN",
                apiUrl: process.env.NEXT_PUBLIC_POST_GRN_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }))
                .finally(() => {
                    setDataLoading(false);
                })
            return;
        };

        if (reqData == "RFP") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to RFP",
                apiUrl: process.env.NEXT_PUBLIC_POST_RFP_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }))
                .finally(() => {
                    setDataLoading(false);
                })
            return;
        };

        if (reqData == "IFP") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to IFP",
                apiUrl: process.env.NEXT_PUBLIC_POST_IFP_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }))
                .finally(() => {
                    setDataLoading(false);
                })
            return;
        };

        if (reqData == "GI") {
            dispatch(postRequestToSAP({
                token: authenticatedUser?.token as string,
                type: "Post to GI",
                apiUrl: process.env.NEXT_PUBLIC_POST_GI_REQUEST_TO_SAP as string,
                resHandler: handleResponse
            }))
                .finally(() => {
                    setDataLoading(false);
                })
            return;
        };

        if (reqData == "GI" || reqData == "RFP" || reqData == "IFP") {
            showNotificationToast("Error", "This feature is not implemented yet!", customStyles.colors.red);
            setDataLoading(false);
            return;
        };
    };

    // Note: handle change status...!
    const handleStatusChange = (status: "Pending" | "Integrated") => {
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
                lastCount: 10,
                skipRecords: 0
            }));
            return;
        };

        if (headerBtnType == "GRN") {
            dispatch(fetchAll_GRNS({
                token: authenticatedUser?.token || "",
                handleLoading: () => setLoading(false),
                apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${status}`,
                lastCount: 10,
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
            lastCount: 10,
            skipRecords: 0
        }));
    };

    // Note: Function to fetch GRNS data...!
    const viewGrnsData = () => {

        // Note: Enable loader...!
        setLoading(true);
        setHeaderBtnType("GRN");

        dispatch(fetchAll_GRNS({
            token: authenticatedUser?.token || "",
            handleLoading: () => setLoading(false),
            apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=${statusColor}`,
            lastCount: 10,
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


    // Note: List of IT TR and ITR API Call
    useEffect(() => {
        if (authenticatedUser) {
            dispatch(fetchAllITR_IT_TRS({
                token: authenticatedUser?.token,
                dataStatus: statusColor,
                handleLoading: () => setLoading(false),
                lastCount: 10,
                skipRecords: 0,
            }))
        }
    }, [])

    const handleMouseOver = () => {
        setMouseover(true)
    }

    const handleMouseOut = () => {
        setMouseover(false)
    }

    return (
        <Box>

            {/* Note: Loading Component */}
            <Loader loadingState={dataLoading} />

            <Stack bg={"white"} p={24} pb={12} style={{ borderRadius: 20 }} onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseOut}>
                <Stack
                    // type="auto"
                    // scrollbarSize={6}
                    // offsetScrollbars
                    bg={"white"}
                    className={"custom-scroll"} style={{ overflow: "auto" }}
                // styles={{
                //     scrollbar: {
                //         backgroundColor: "white", // scrollbar track color
                //     },
                //     thumb: {
                //         backgroundColor: "#E7E7E7", // scrollbar thumb color
                //         borderRadius: 8,
                //     },
                // }}
                >
                    <Flex
                        direction="row"
                        gap="md"
                        wrap="nowrap"
                        style={{
                            // paddingBottom: mouseover ? '16px' : "0px",
                            paddingBottom: '16px',
                            // overflowX: 'auto',
                            // WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {cardsData.map((item) => (
                            <Box
                                key={item.label}
                                style={{
                                    // minWidth: isLargeScreen ? '15%' : '30%',
                                    // minWidth: "15%",
                                    flexShrink: 0,
                                    // width: isLargeScreen ? '25%' : '30%'
                                    width: 230
                                }}
                            >
                                <Card radius="lg" style={{border: "1px solid #E1E7EC"}}>
                                    <Group
                                        justify={customStyles.alignment.spaceBetween}
                                        mb="sm"
                                    >
                                        <ThemeIcon
                                            variant="light"
                                            color={customStyles.colors.white}
                                            size="xl"
                                            style={{ backgroundColor: item?.color, borderRadius: 50 }}
                                        >
                                            <IconChartBar size="1.5rem" />
                                        </ThemeIcon>
                                    </Group>

                                    <Title
                                        order={4}
                                        style={{ color: "#4D4D4D" }}
                                        size={isLargeScreen ? 'md' : 'sm'}
                                        fw={500}
                                    >
                                        {item.title}
                                    </Title>

                                    <Group gap={2} align='baseline'>
                                        <Text style={{ fontWeight: 700, fontSize: "35px" }} mt="sm">
                                            {`${showPendingAndIntegratedValues(item.label, item.pendingValue)}`}
                                        </Text>
                                        <Text size="xl" style={{ fontWeight: 700 }} mt="sm" color='#909090'>
                                            {` / ${showPendingAndIntegratedValues(item.label, item.integratedValue)}`}
                                        </Text>
                                    </Group>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginTop: 8
                                        }}
                                    >
                                        <IconReload cursor="pointer" size={18} color='#909090' />
                                        <Text c="dimmed" size="sm">
                                            {showTime(item.lastIntegrationDate)}
                                        </Text>
                                    </div>

                                    <Button
                                        leftSection={<IconCheckbox size={18} />}
                                        variant="transparent"
                                        className={handleDisable(item.pendingValue, item.integratedValue) ? 'filledDisabledButton' : 'outlineButton'}
                                        radius={8}
                                        size="md"
                                        fullWidth
                                        mt="md"
                                        onClick={() => handleRequestToSap(item.label, item.pendingValue)}
                                        disabled={handleDisable(item.pendingValue, item.integratedValue)}
                                        color={customStyles.colors._1B59F8}
                                    >
                                        {handleDisable(item.pendingValue, item.integratedValue) ? 'Posted' : 'Post'}
                                    </Button>
                                </Card>
                            </Box>
                        ))}
                    </Flex>
                </Stack>
            </Stack>

            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                <Group justify='space-between'>
                    <Group
                        pt={1}
                        pb={1}
                        justify={customStyles.alignment.left}
                        mb="sm"
                        gap={0} // gap hatao taake border connect ho
                        className="tabGroup"
                        style={{
                            display: "flex",
                            alignItems: customStyles.alignment.center,
                            border: "1px solid #228be6",
                            borderRadius: "5px"
                        }}
                    >
                        <Button
                            variant="transparent"
                            radius={0}
                            size="md"
                            w={250}
                            onClick={() => setHeaderBtnType("Stock Movement")}
                            style={{
                                backgroundColor: headerBtnType === "Stock Movement" ? "#DEE4F5" : "white"
                            }}
                        >
                            Stock Movement
                        </Button>

                        <Button
                            variant="transparent"
                            // className={headerBtnType === "GRN" ? "myFilledButton" : "myOutlineButton"}
                            radius={0}
                            size="md"
                            w={250}
                            onClick={() => setHeaderBtnType("GRN")}
                            style={{
                                borderLeftWidth: 1,
                                borderLeftColor: "#228be6",
                                backgroundColor: headerBtnType === "GRN" ? "#DEE4F5" : "white"
                            }}
                        >
                            GRN
                        </Button>
                    </Group>

                    <Group>
                        <Text size='md' fw={500}>Select Status</Text>
                        <Select
                            data={[{ label: 'Pending', value: 'Pending' }, { label: 'Success', value: 'Integrated' }]}
                            rightSection={<IconChevronDown size={18} />}
                            defaultValue='Success'
                            placeholder="Select Status"
                            value={statusColor}
                            onChange={(value) => handleStatusChange(value as 'Pending' || 'Integrated')}
                            clearable
                            w={200}
                            size='md'
                            fw={500}
                            styles={{
                                input: {
                                    color: customStyles.colors._4D4D4D

                                }
                            }}
                        />
                    </Group>
                </Group>
                <Group my={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D} style={{ fontWeight: 600, fontSize: 16 }}>
                            Pending & Success Data
                        </Title>
                        <Text c={customStyles.colors._909090} style={{ fontWeight: 500, fontSize: 16 }}>
                            Track inventory transfers that are pending or successfully synced with SAP.
                        </Text>
                    </Stack>
                    <Group gap="xs">
                        <GlobalSearchFilter
                            filters={globalFilter}
                            handleGlobalSearch={handleGlobalSearch}
                            isSearchInputVisible={isSearchInputVisible}
                        />
                        {
                            !isSearchInputVisible ?
                                <IconSearch cursor="pointer" size={24} onClick={handleSearchInputVisibility} /> : <IconSearchOff cursor="pointer" size={24} onClick={handleSearchInputVisibility} />
                        }
                        {
                            !areTableFiltersVisible ?
                                <IconFilter cursor="pointer" size={24} onClick={handleTableFiltersVisibility} /> : <IconFilterOff cursor="pointer" size={24} onClick={handleTableFiltersVisibility} />

                        }
                        <IconColumns cursor="pointer" size={24} />
                        <IconBorderCorners cursor="pointer" size={24} />
                    </Group>
                </Group>

                {
                    headerBtnType == "GRN" ?
                        <GRN_Table_Component type={statusColor} areTableFiltersVisible={areTableFiltersVisible} isLoading={loading} />
                        : <Stock_Movement_Table_Component type={statusColor} sapType={selectedType as "ITR" | "IT" | "TR"} areTableFiltersVisible={areTableFiltersVisible} isLoading={loading} />
                }
            </Stack>

        </Box>
    );
};

export default memo(IntegrationComponent);