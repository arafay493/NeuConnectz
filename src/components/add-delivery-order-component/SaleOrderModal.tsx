"use client";

import { FC, useEffect, useMemo, useState, memo } from 'react';
import { routes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { ActionIcon, Badge, Box, Button, Group, Image, Select, Stack, Text, Title, Paper, Modal, NumberInput, Grid } from '@mantine/core';
import { IconX, IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsDown, IconArrowsUp, IconArrowsUpDown, IconBorderCorners, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconEdit, IconFilter, IconFilterOff, IconPointFilled, IconSearch, IconSearchOff, IconUserPlus } from '@tabler/icons-react';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';
import { apiGet, apiPost } from '@/lib/api-service';
import showNotificationToast from '@/lib/notification-toast/notification-toast';

interface ListAllSaleOrderItemsTableModalProps {
    open: boolean,
    close: () => void,
    fetchSaleOrderData: (data: any) => void;
};

interface SalesOrderProps {
    id: string,
    salesOrderNumber: string,
    soDate: string,
    deliveryDate: string,
    totalItems: string,
    totalQuantity: string,
    customer: {
        customerCode: string,
        customerName: string
    },
    warehouse: {
        whsCode: string,
        whsName: string
    },
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
}

const ListAllSaleOrderItemsTableModal: FC<ListAllSaleOrderItemsTableModalProps> = ({ open, close, fetchSaleOrderData }) => {

    const [salesOrderItems, setSalesOrderItems] = useState<SalesOrderProps[]>([]);
    const [salesOrderItemsCount, setSalesOrderItemsCount] = useState<number>(0);
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [targetRow, setTargetRow] = useState<any>(null);

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // Note: Router for switch page
    const router = useRouter();

    const dispatch = useAppDispatch();

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);
    // console.log('User: ', authenticatedUser);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Note: State for Table Filters
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);
    const [disableBtn, setDisableBtn] = useState(true);

    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
    };

    const handleTableFiltersVisibility = () => {
        setAreTableFiltersVisible(!areTableFiltersVisible);
    };

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
    const columns = useMemo<ColumnDef<SalesOrderProps>[]>(
        () => [
            {
                id: 'select',
                header: '',
                size: 50,
                cell: ({ row }) => (
                    <input
                        type="radio"
                        name="row-select"
                        checked={selectedRowId === row.id}
                        onChange={() => {
                            setSelectedRowId(row.id)
                            setTargetRow(row?.original);
                        }}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                ),
            },
            {
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
                size: calculateColumnWidth('S.No', ['99999'], 80, 120), // Assuming max 999 records
            },
            {
                accessorKey: 'salesOrderNumber',
                header: 'SO No',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('SO No', (salesOrderItems || []).map(item => item.salesOrderNumber), 150, 200),
            },
            {
                accessorKey: 'customer.customerCode',
                header: 'Customer Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Customer Code', (salesOrderItems || []).map(item => item.customer.customerCode), 150, 150),
            },
            {
                accessorKey: 'warehouse.whsName',
                header: 'Warehouse',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Warehouse', (salesOrderItems || []).map(item => item.warehouse.whsName), 200, 200),
            },
            {
                accessorKey: 'createdBy',
                header: 'Created By',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Created By', (salesOrderItems || []).map(item => item.createdBy), 200, 200),
            },
            {
                accessorKey: 'createdDate',
                header: 'Created Date',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Created Date', (salesOrderItems || []).map(item => item.createdDate), 150, 200),
            },
        ],
        [salesOrderItems, targetRow] // Add data as dependency to recalculate when data changes
    );

    // Custom global filter function to handle Status column properly
    const globalFilterFn = (row: any, columnId: string, value: string): boolean => {
        if (!value) return true;

        // Get the search value in lowercase for case-insensitive search
        const searchValue = value.toLowerCase();

        // Get the cell value
        const cellValue = row.getValue(columnId);

        // Special handling for isActive (Status) column
        if (columnId === 'isActive') {
            const displayText = cellValue === true ? 'Active' : 'Inactive';
            return displayText.toLowerCase().includes(searchValue);
        }

        // Handle S.No column (computed value)
        if (columnId === 'S.No') {
            // For global filter, we need to check against the original row index
            // since filtering happens before pagination
            const serialNumber = row.index + 1;
            return String(serialNumber).includes(value);
        }

        // Handle other columns (convert to string and search)
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    const table = useReactTable({
        data: salesOrderItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
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
            // Get all column IDs to search across
            const columnIds = ['S.No', 'userName', 'email', 'department', 'phone', 'role', 'isActive'];

            // Search across all columns
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        // Enable server-side pagination
        onPaginationChange: setPagination,
        manualPagination: true, // Enable server-side pagination
        pageCount: Math.ceil(salesOrderItemsCount / pagination.pageSize), // Calculate total pages from server data
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

    // Note: Fetch all sales order items...!
    const fetchAllSalesOrderItems = async () => {
        try {
            const skipRecord = pagination.pageIndex * pagination.pageSize;
            const params: { [key: string]: number } = {};

            if (pagination.pageSize !== undefined) params.LastCount = pagination.pageSize;
            if (skipRecord !== undefined) params.skipRecord = skipRecord;

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_SALES_ORDER_ITEMS}?DocStatus=Completed&userId=${authenticatedUser?.userId}`, authenticatedUser?.token, params);
            console.log(response);

            const { status, data } = response;
            if (status == 200) {
                setSalesOrderItems(data?.data?.data || []);
                setSalesOrderItemsCount(data?.data?.totalRecords || 0);
                setIsLoading(false);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching sales order items', error);
        };
    };

    useEffect(() => {
        if (authenticatedUser) {
            setIsLoading(true);
            fetchAllSalesOrderItems();
        };
    }, [authenticatedUser, dispatch, pagination.pageIndex, pagination.pageSize]); // Add pagination dependencies for server-side pagination

    // Note: This hook will run when row selection...!
    // useEffect(() => {
    //     if (targetRow) {
    //         console.log('Selected Row: ', targetRow);
    //     };
    // }, [targetRow]);

    // Note: Function to select sale order...!
    const selectSaleOrder = () => {
        if (targetRow) {
            // console.log('Target sale order: ', targetRow);
            fetchSaleOrderData(targetRow);
            close();
        };
    };

    return (
        <Modal
            opened={open}
            onClose={close}
            withCloseButton={false}  // hide default close icon
            size="80%"               // width: 80% of viewport
            styles={{
                body: { height: '80vh' } // height: 80% of viewport height
            }}
            centered
            radius={5}
        >
            <Paper shadow="md" radius="md" p="xl" withBorder mt={'2%'}>
                <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }}>
                    <Stack gap={0}>
                        <Title order={2} c={customStyles.colors._4D4D4D}>Select Sale Order</Title>
                    </Stack>
                    <Button
                        className='outlineButton'
                        variant="transparent"
                        size="md"
                        radius={8}
                        onClick={() => close()}
                    >
                        <IconX size={24} color="red" />
                    </Button>
                </Group>

                <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>

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
                                {table.getHeaderGroups().map(headerGroup =>
                                (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} style={{
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                padding: '0 16px 24px 10px',
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
                                            // borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                            borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                            backgroundColor: selectedRowId === row.id ? '#EEF6FF' : 'transparent',
                                            transition: '0.2s ease',
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
                                                <Image w={180} h={180} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
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
                                Showing {(pagination.pageIndex * pagination.pageSize) + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, salesOrderItemsCount)} of {salesOrderItemsCount} entries
                            </Text>
                        </Group>
                    </Group>
                </Box>

                <Box mt={15} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        className='filledButton'
                        variant="transparent"
                        size="md"
                        radius={8}
                        onClick={selectSaleOrder}
                        // loading={formData.loading}
                        disabled={!targetRow}
                    >
                        Select
                    </Button>
                </Box>

            </Paper>
        </Modal>
    );
};

export default memo(ListAllSaleOrderItemsTableModal);