// Note: ITR Table Component...!

import React, { memo, useState, useEffect, useMemo } from 'react';
import {
    Table,
    Flex,
    Select,
    Stack,
    Box,
    Button,
    Group,
    Text,
    Title,
    ActionIcon,
    Image,
    Grid,
    GridCol
} from '@mantine/core';
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '@/components/data-not-found/data-not-found';
import { ITR_DataType } from '@/types/redux-types';
import { customStyles } from '@/styles/custom-theme';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data, fetchAllItrData } from '@/redux/actions/itr-actions/itr-actions';
import Loader from '../loader/loader';
import { IconBuildingWarehouse, IconCalendarMonth, IconChevronDown, IconSearch, IconColumns, IconBorderCorners, IconFilter, IconSearchOff, IconFilterOff, IconArrowsUpDown, IconChevronLeft, IconChevronRight, IconArrowNarrowUp, IconArrowNarrowDown } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { DatePickerInput } from '@mantine/dates';
import NextImage from 'next/image'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    PaginationState,
    flexRender,
    getPaginationRowModel
} from '@tanstack/react-table';
import { GlobalSearchFilter } from '@/components/table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';
import { localAssets } from '@/lib/file-paths/file-paths';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import showNotificationToast from '@/lib/notification-toast/notification-toast';

// Note: ITR Data type based on actual Redux state structure
type ITRDataType = {
    id: string,
    docNum: string | number,
    docDate: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    docStatus: string,
    itemCode: string,
    itemName: string,
    quantity: string | number,
    uom: string,
    openQuantity: string | number,
    erpDocEntry: string | number,
    erpObjectType: string,
    erpDocLine: string | number,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean,
    sapStatus: string
};

type ApiProp = {
    apiUrl: string;
};

export type SapStatusProp = 'Pending' | 'Updated' | 'Integrated'
export type DocStatusProp = 'Pending' | 'Open' | 'Closed'

const ITR_TableCom: React.FC<ApiProp> = ({ apiUrl }) => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1300px)');

    // Search Table Filter With API Call
    const [toWarehouse, setToWarehouse] = useState('')
    const [fromWarehouse, setFromWarehouse] = useState('')
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [sapStatus, setSapStatus] = useState<SapStatusProp>()
    const [docStatus, setDocStatus] = useState<DocStatusProp>()

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const lastCount = pagination.pageSize;

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

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
    const { itrData, itrDataCount, itrErrorState } = useAppSelector(({ itrStates }) => { return itrStates });

    // Utility function to calculate optimal column width
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

    // Note: Column definitions for the table
    const columns = useMemo<ColumnDef<ITRDataType>[]>(
        () => [
            {
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
                size: calculateColumnWidth('S.No', ['99999'], 80, 120),
            },
            {
                accessorKey: 'docNum',
                header: 'Doc Num',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                size: calculateColumnWidth('Document Number', (itrData || []).map(item => String(item.docNum)), 150, 220),
            },
            {
                accessorKey: 'docDate',
                header: 'Doc Date',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {new Date(getValue() as string).toLocaleDateString()}
                    </Text>
                ),
                size: calculateColumnWidth('Document Date', (itrData || []).map(item => new Date(item.docDate).toLocaleDateString()), 150, 220),
            },
            {
                accessorKey: 'fromWarehouseId',
                header: 'From WH Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('From Warehouse Code', (itrData || []).map(item => item.fromWarehouseId), 150, 220),
            },
            {
                accessorKey: 'toWarehouseId',
                header: 'To WH Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('To Warehouse Code', (itrData || []).map(item => item.toWarehouseId), 150, 220),
            },
            {
                accessorKey: 'docStatus',
                header: 'Doc Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Document Status', (itrData || []).map(item => item.docStatus), 150, 180),
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Code', (itrData || []).map(item => item.itemCode), 150, 220),
            },
            {
                accessorKey: 'itemName',
                header: 'Item Description',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Description', (itrData || []).map(item => item.itemName), 200, 300),
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                size: calculateColumnWidth('Quantity', (itrData || []).map(item => String(item.quantity)), 120, 150),
            },
            {
                accessorKey: 'erpDocEntry',
                header: 'ERP Doc Entry',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                size: calculateColumnWidth('ERP Document Entry', (itrData || []).map(item => String(item.erpDocEntry || '-')), 180, 220),
            },
            {
                accessorKey: 'erpObjectType',
                header: 'ERP Object Type',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                size: calculateColumnWidth('ERP Object Type', (itrData || []).map(item => String(item.erpObjectType || '-')), 200, 250),
            },
            {
                accessorKey: 'erpDocLine',
                header: 'ERP Doc Line',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                size: calculateColumnWidth('ERP Document Line', (itrData || []).map(item => String(item.erpDocLine || '-')), 150, 220),
            },
            {
                accessorKey: 'sapStatus',
                header: 'SAP Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('SAP Status', (itrData || []).map(item => item.sapStatus), 180, 200),
            }
        ],
        [itrData, skipRecord]
    );

    // Custom global filter function
    const globalFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;

        const searchValue = value.toLowerCase();
        const cellValue = row.getValue(columnId);

        // Handle S.No column (computed value)
        if (columnId === 'S.No') {
            const serialNumber = row.index + (table?.getState?.()?.pagination?.pageIndex || 0) * (table?.getState?.()?.pagination?.pageSize || 10) + 1;
            return String(serialNumber).includes(value);
        }

        // Handle date column
        if (columnId === 'docDate') {
            const dateValue = new Date(cellValue as string).toLocaleDateString();
            return dateValue.toLowerCase().includes(searchValue);
        }

        // Handle other columns
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    const table = useReactTable({
        data: itrData || [], // Handle undefined/null case
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
            const columnIds = ['S.No', 'docNum', 'docDate', 'fromWarehouseId', 'toWarehouseId', 'docStatus', 'itemCode', 'itemName', 'quantity', 'erpDocEntry', 'erpObjectType', 'erpDocLine', 'sapStatus'];
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        onPaginationChange: setPagination,
        manualPagination: false,
        // pageCount: Math.ceil((itrDataCount || 0) / pagination.pageSize), // Handle undefined case
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

    // Warehouse validation functions
    const handleFromWarehouseChange = (value: string | null) => {
        if (value && value === toWarehouse) {
            showNotificationToast(
                "Invalid Selection",
                "From Warehouse and To Warehouse cannot be the same!",
                customStyles.colors.red
            );
            return;
        }
        setFromWarehouse(value ?? '');
    };

    const handleToWarehouseChange = (value: string | null) => {
        if (value && value === fromWarehouse) {
            showNotificationToast(
                "Invalid Selection",
                "To Warehouse and From Warehouse cannot be the same!",
                customStyles.colors.red
            );
            return;
        }
        setToWarehouse(value ?? '');
    };

    // Function to build URL parameters from filters
    const buildFilterParams = () => {
        const params = new URLSearchParams();

        if (sapStatus) params.append('sapStatus', sapStatus);
        if (docStatus) params.append('docStatus', docStatus);
        if (fromWarehouse) params.append('fromWarehouseCode', fromWarehouse);
        if (toWarehouse) params.append('toWarehouseCode', toWarehouse);
        if (selectDate) params.append('docDate', selectDate);

        return params.toString();
    };

    // Function to fetch filtered data
    const fetchFilteredData = () => {
        if (!authenticatedUser?.token) return;

        const filterParams = buildFilterParams();
        const apiUrlWithParams = filterParams ? `${apiUrl}?${filterParams}` : apiUrl;

        setIsLoading(true);
        dispatch(fetchAllItrData({
            authToken: authenticatedUser.token,
            apiUrl: apiUrlWithParams,
            lastCount: 1000,
            skipRecords: 0
        })).finally(() => {
            setIsLoading(false);
        });
    };

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            // Initial load without filters
            dispatch(fetchAllItrData({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: 1000,
                skipRecords: 0
            })).finally(() => {
                setIsLoading(false)
            });
        };
    }, [authenticatedUser, dispatch, apiUrl]); // Only trigger on auth/api changes

    // Note: Fetch All Warehouse List
    useEffect(() => {
        dispatch(fetchAllWareHouses({ authToken: authenticatedUser?.token as string }))
    }, [dispatch, authenticatedUser?.token])

    // Auto-apply filters when any filter value changes (optional - remove this useEffect if you want manual apply only)
    useEffect(() => {
        // Uncomment the lines below if you want auto-filtering on filter changes
        const timeoutId = setTimeout(() => {
            // if (sapStatus || docStatus || fromWarehouse || toWarehouse || selectDate) {
            fetchFilteredData();
            // }
        }, 500); // Debounce API calls by 500ms

        return () => clearTimeout(timeoutId);
    }, [sapStatus, docStatus, fromWarehouse, toWarehouse, selectDate]);


    // Transform warehouse data for Select component
    const selectWarehouseData = wareHousesList.data
        .filter(warehouse => warehouse.isActive && !warehouse.isArchived)
        .map(warehouse => ({
            value: warehouse.whsCode,
            label: warehouse.whsName
        }));
    return (
        <Box>
            <Grid
                mt={16}
                mb={8}
                bg={customStyles.colors.white}
                p={24}
                align='end'
                style={{
                    borderRadius: '16px',
                    gap: isSmallScreen ? '16px' : '24px'
                }}
            >
                {/* Sap Status */}
                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Text size="md" mb={8} fw={500}>Sap Status</Text>
                    <Select
                        placeholder="Select Sap Status"
                        data={['Updated', 'Integrated', 'Pending']}
                        value={sapStatus}
                        onChange={(value) => setSapStatus(value as SapStatusProp | undefined)}
                        clearable
                        radius={8}
                        size='md'
                    />
                </GridCol>

                {/* Doc Status */}
                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Text size="md" mb={8} fw={500}>Doc Status</Text>
                    <Select
                        placeholder="Select Doc Status"
                        data={['Open', 'Closed', 'Pending']}
                        value={docStatus}
                        onChange={(value) => setDocStatus(value as DocStatusProp | undefined)}
                        clearable
                        radius={8}
                        size='md'
                    />
                </GridCol>

                {/* From Warehouse */}
                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Text size="md" mb={8} fw={500}>From Warehouse</Text>
                    <Select
                        placeholder="Select warehouse"
                        data={selectWarehouseData}
                        value={fromWarehouse}
                        onChange={handleFromWarehouseChange}
                        clearable
                        radius={8}
                        size='md'
                    />
                </GridCol>

                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Text size="md" mb={8} fw={500}>To Warehouse</Text>
                    <Select
                        placeholder="Select warehouse"
                        data={selectWarehouseData}
                        value={toWarehouse}
                        onChange={handleToWarehouseChange}
                        clearable
                        radius={8}
                        size='md'
                    />
                </GridCol>

                {/* Date */}
                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Text size="md" mb={8} fw={500}>Date</Text>
                    <DatePickerInput
                        placeholder="DD/MM/YY"
                        value={selectDate}
                        onChange={(value: string) => setSelectDate(value)}
                        radius={8}
                        size='md'
                        clearable
                    />
                </GridCol>

                {/* Apply Filters Button */}
                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Button
                        variant='transparent'
                        className='filledButton'
                        radius={8}
                        size={isSmallScreen ? 'sm' : 'md'}
                        leftSection={<IconBuildingWarehouse size={isSmallScreen ? 20 : 24} />}
                        // onClick={handleAssignGroups}
                        fullWidth
                        // w={isSmallScreen ? '100%' : 'auto'}
                        mt={isSmallScreen ? 16 : 0}
                    >
                        Export To CSV
                    </Button>
                </GridCol>
            </Grid>

            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Manage ITR Data
                        </Title>
                        <Text c={customStyles.colors._909090}>
                            View, search, and manage all ITR data by using multiple filters.
                            {(sapStatus || docStatus || fromWarehouse || toWarehouse || selectDate) && (
                                <Text component="span" c={customStyles.colors._408CCE} fw={500}> (Filters Active)</Text>
                            )}
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
                </Group>

                {/* Table */}
                <Box
                    w="100%"
                    mah={700}
                    style={{
                        overflowX: 'auto',
                        overflowY: 'auto',
                    }}
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
                                            maxWidth: `${header.getSize()}px`,
                                            verticalAlign: 'top',
                                        }}>
                                            <Group
                                                wrap="nowrap"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <Text fw={600} c={customStyles.colors._4D4D4D}>
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
                                                padding: '12px',
                                                width: `${cell.column.getSize()}px`,
                                                minWidth: `${cell.column.getSize()}px`,
                                                maxWidth: cell.column.id === 'isActive' ? 'fit-content' : 'max-content',
                                                overflow: cell.column.id === 'isActive' ? 'visible' : 'hidden',
                                                textOverflow: cell.column.id === 'isActive' ? 'initial' : 'ellipsis',
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
                                            <Image w={250} h={250} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
                                            <Title order={4} c={customStyles.colors._4D4D4D}>No Data Found</Title>
                                        </Stack>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box>
            </Stack>

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
                            Showing {skipRecord + 1} to {Math.min(skipRecord + pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
                            {(globalFilter || columnFilters.length > 0) && (
                                <span> (filtered from {itrDataCount} total entries)</span>
                            )}
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box>
    );
};

export default memo(ITR_TableCom);