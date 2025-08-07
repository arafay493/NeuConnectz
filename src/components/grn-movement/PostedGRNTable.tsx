'use client';

import calculateColumnWidth from "@/constants/calculateColumnWidth";
import { localAssets } from "@/lib/file-paths/file-paths";
import { exportDataToCsvFile, fetchAll_INTEGRATED_GRNS, fetchAllVendorCodes } from "@/redux/actions/sap-actions/sap-actions";
import { fetchAllWareHouses } from "@/redux/actions/warehouse-actions/warehouse-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { GRN_Props } from "@/types/redux-types";
import { ActionIcon, Box, Group, Image, Select, Stack, Text, Title } from "@mantine/core";
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsUpDown, IconBorderCorners, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconFilter, IconFilterOff, IconSearch, IconSearchOff } from "@tabler/icons-react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import NextImage from 'next/image';
import { useEffect, useMemo, useState } from "react";
import { DocStatusProp } from "../stock-movement/StockMovementFilterBar";
import { GlobalSearchFilter } from "../table-filters/GlobalSearchFilter";
import { TableColumnsFilter } from "../table-filters/TableColumnsFilter";
import GRNMovementFilterBar from "./GRNMovementFilterBar";

const PostedGRNTable = () => {
    // Search Table Filter With API Call
    const [warehouseCode, setWarehouseCode] = useState<string | null>('')
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [vendorCode, setVendorCode] = useState<string>();
    const [docStatus, setDocStatus] = useState<DocStatusProp>();

    // Note: Handling redux here...!
    const dispatch = useAppDispatch();

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
    const { vendorCodeList } = useAppSelector(({ sapStates }) => { return sapStates });
    const { list_Integrated_GRNS_Data, totalGRNS_DataCounts, sapErrorState } = useAppSelector(({ sapStates }) => { return sapStates });

    // Note: State for Filters
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Note: State for Table Filters
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);

    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
    };

    const handleTableFiltersVisibility = () => {
        setAreTableFiltersVisible(!areTableFiltersVisible);
    };

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;

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
                cell: ({ row, table }) => {
                    // Get the original index from filtered data, not paginated data
                    const filteredRows = table.getFilteredRowModel().rows;
                    const originalIndex = filteredRows.findIndex(filteredRow => filteredRow.id === row.id);
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {originalIndex + 1}
                        </Text>
                    );
                },
                filterFn: serialNumberFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('S.No', ['99999'], 80, 120),
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
                size: calculateColumnWidth('Number', list_Integrated_GRNS_Data.map(item => String(item.docNum)), 120, 200),
            },
            {
                accessorKey: 'whsCode',
                header: 'Warehouse Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Warehouse', list_Integrated_GRNS_Data.map(item => item.whsCode), 120, 200),
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
                size: calculateColumnWidth('Vendor', list_Integrated_GRNS_Data.map(item => item.vendorCode), 120, 200),
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
                size: calculateColumnWidth('Doc Status', list_Integrated_GRNS_Data.map(item => item.docStatus), 120, 180),
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
                size: calculateColumnWidth('Item Code', list_Integrated_GRNS_Data.map(item => item.itemCode), 150, 250),
            },
            {
                accessorKey: 'itemName',
                header: 'Item Description',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Item Name', list_Integrated_GRNS_Data.map(item => item.itemName), 150, 250),
            },
            {
                accessorKey: 'groupCode',
                header: 'Group Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Group Code', list_Integrated_GRNS_Data.map(item => item.groupCode), 200, 220),
            },
            {
                accessorKey: 'groupName',
                header: 'Group Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                size: calculateColumnWidth('Group Name', list_Integrated_GRNS_Data.map(item => item.groupName), 200, 300),
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
                size: calculateColumnWidth('ERP Doc Entry', list_Integrated_GRNS_Data.map(item => item.erpDocEntry ? String(item.erpDocEntry) : '-'), 140, 220),
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
                size: calculateColumnWidth('ERP Line ID', list_Integrated_GRNS_Data.map(item => item.erpDocLine ? String(item.erpDocLine) : '-'), 130, 200),
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
                size: calculateColumnWidth('SAP Status', list_Integrated_GRNS_Data.map(item => item.sapStatus || item.vendorCode), 120, 180),
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
                size: calculateColumnWidth('User Name', list_Integrated_GRNS_Data.map(item => item.userName), 150, 250),
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
        [list_Integrated_GRNS_Data]
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
        data: list_Integrated_GRNS_Data,
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
            const columnIds = ['docNum', 'itemCode', 'whsCode', 'vendorCode', 'userName', 'erpDocEntry', 'erpDocLine', 'vendorCode', 'docStatus', 'updatedDate'];

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

    // Function to build URL parameters from filters
    const buildFilterParams = () => {
        const params = new URLSearchParams();

        params.append('sapStatus', 'integrated'); // Always include SAP status
        if (vendorCode) params.append('vendorCode', vendorCode);
        if (docStatus) params.append('docStatus', docStatus);
        if (warehouseCode) params.append('whsCode', warehouseCode);
        if (selectDate) params.append('docDate', selectDate);

        return params.toString();
    };

    // Function to fetch filtered data
    const fetchFilteredData = () => {
        if (!authenticatedUser?.token) return;
        const apiUrl = process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA || "";
        const filterParams = buildFilterParams();
        const apiUrlWithParams = filterParams ? `${apiUrl}?${filterParams}` : apiUrl;

        setIsLoading(true);
        dispatch(fetchAll_INTEGRATED_GRNS({
            token: authenticatedUser.token,
            handleLoading: () => setIsLoading(false),
            apiUrl: apiUrlWithParams,
            lastCount: 1000,
            skipRecords: 0
        })).finally(() => {
            setIsLoading(false);
        });
    };

    // Auto-apply filters when any filter value changes (optional - remove this useEffect if you want manual apply only)
    useEffect(() => {
        // Uncomment the lines below if you want auto-filtering on filter changes
        const timeoutId = setTimeout(() => {
            // if (vendorCode || docStatus || warehouseCode || toWarehouse || selectDate) {
            fetchFilteredData();
            // }
        }, 500); // Debounce API calls by 500ms

        return () => clearTimeout(timeoutId);
    }, [vendorCode, docStatus, warehouseCode, selectDate]);

    const numbersArray = useMemo<number[]>(() => {
        return Array.from({ length: table.getPageCount() }, (_, i) => i + 1);
    }, [table.getPageCount()]);

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            dispatch(fetchAll_INTEGRATED_GRNS({
                token: authenticatedUser?.token || "",
                handleLoading: () => setIsLoading(false),
                apiUrl: `${process.env.NEXT_PUBLIC_FETCH_ALL_GRNS_DATA}?sapStatus=integrated` || "",
                lastCount: 1000,
                skipRecords: 0
            }));
        };
    }, [authenticatedUser]);

    useEffect(() => {
        dispatch(fetchAllVendorCodes(authenticatedUser?.token as string))
    }, [dispatch, authenticatedUser?.token]);

    // Note: Fetch All Warehouse List
    useEffect(() => {
        dispatch(fetchAllWareHouses({ authToken: authenticatedUser?.token as string }))
    }, [dispatch, authenticatedUser?.token])

    // Transform warehouse data for Select component
    const selectWarehouseData = wareHousesList.data
        .filter(warehouse => warehouse.isActive && !warehouse.isArchived)
        .map(warehouse => ({
            value: warehouse.whsCode,
            label: warehouse.whsName
        }));

    // Note: Transform vendor codes for Select component
    const selectVendorCodesData = vendorCodeList
        .map(vendor => ({
            value: vendor.cardCode,
            label: vendor.cardName
        }));

    // Note: Function to export to CSV data...!
    const handleExportToCSV = () => {
        const params = new URLSearchParams();

        params.append('sapStatus', 'Integrated'); // Always include SAP status
        if (vendorCode) params.append('vendorCode', vendorCode);
        if (docStatus) params.append('docStatus', docStatus);
        if (warehouseCode) params.append('whsCode', warehouseCode);
        if (selectDate) params.append('docDate', selectDate);

        const isFilterParams = params.toString();

        let apiUrl = !isFilterParams ? process.env.NEXT_PUBLIC_EXPORT_GRN_TO_EXCEL : `${process.env.NEXT_PUBLIC_EXPORT_GRN_TO_EXCEL}?${isFilterParams}`
        dispatch(exportDataToCsvFile({
            token: authenticatedUser?.token || "",
            apiUrl: apiUrl || "",
            type: 'GRN'
        }));
    };
    return (
        <Box>
            <GRNMovementFilterBar
                selectWarehouseData={selectWarehouseData}
                vendorCodeList={selectVendorCodesData}
                warehouseCode={warehouseCode}
                setWarehouseCode={setWarehouseCode}
                selectDate={selectDate}
                setSelectDate={setSelectDate}
                vendorCode={vendorCode}
                setVendorCode={setVendorCode}
                docStatus={docStatus}
                setDocStatus={setDocStatus}
                exportToCSV={handleExportToCSV}
            />
            {/* Main Content */}
            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Posted GRN
                        </Title>
                        <Text c={customStyles.colors._909090}>
                            All GRNs that have been successfully recorded and synced with the system. No further edits allowed.
                        </Text>
                    </Stack>
                    <Group gap="xs">
                        <GlobalSearchFilter
                            filters={globalFilter}
                            setFilters={setGlobalFilter}
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
                </Group >

                {/* Table */}
                < Box
                    className="show-scroll-bar-overflow"
                    w="100%"
                    mah={700}
                    style={{
                        overflowX: 'auto',
                        // overflowY: 'auto',
                    }}
                >
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: 'max-content'
                    }}>
                        <thead                        >
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
                                            verticalAlign: 'top',
                                            width: `${header.getSize()}px`,
                                            minWidth: `${header.getSize()}px`,
                                            maxWidth: 'max-content',
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
                                                padding: '10px',
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
                                            <Image w={250} h={250} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
                                            <Title order={4} c={customStyles.colors._4D4D4D}>No Data Found</Title>
                                        </Stack>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box >

            </Stack >

            {/* Pagination */}
            < Box
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
                            Showing {skipRecord + 1} to {Math.min(skipRecord + pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
                            {(globalFilter || columnFilters.length > 0) && (
                                <span> (filtered from {totalGRNS_DataCounts} total entries)</span>
                            )}
                        </Text>
                    </Group>
                </Group>
            </Box >
        </Box>
    )
}

export default PostedGRNTable