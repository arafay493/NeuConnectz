// Note: Delivery order component...!

'use client';

import { FC, useEffect, useMemo, useState, memo } from 'react';
import { routes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { ActionIcon, Badge, Box, Button, Group, Image, Select, Stack, Text, Title, GridCol, Grid } from '@mantine/core';
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsDown, IconArrowsUp, IconArrowsUpDown, IconBorderCorners, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconEdit, IconFilter, IconFilterOff, IconPointFilled, IconSearch, IconSearchOff, IconUserPlus, IconDownload } from '@tabler/icons-react';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { GlobalSearchFilter } from '../table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';
import { apiGet } from '@/lib/api-service';
import DeliveryOrderFilterBar from './DeliveryOrderFilterBar';
import { useMediaQuery } from "@mantine/hooks";
import { DatePickerInput } from "@mantine/dates";
import generatePDF from '@/constants/save-pdf';

export interface DeliveryOrderProps {
    contractor: {
        contractorName: string;
        id: string;
    };
    createdBy: string;
    createdDate: string; // ISO datetime string
    deliveryDate: string; // ISO datetime string
    doNumber: string;
    docNum: number;
    driver: {
        driverId: string;
        driverName: string;
        cnic: string;
        phone: string;
    };
    id: string;
    isActive: boolean;
    isArchived: boolean;
    itemCode: string;
    itemName: string;
    quantity: number;
    salesOrder: {
        id: string;
        salesOrderNumber: string;
        soDate: string;
        deliveryDate: string;
        customer: {
            customerCode: string;
            customerName: string;
        }
    };
    transportMode: string;
    uoM: string;
    updatedBy: string;
    updatedDate: string; // ISO datetime string
    vehicle: {
        vehicleNumber: string;
        vehicleType: string;
    };
    items: {
        id: string;
        itemCode: string;
        itemName: string;
        quantity: number;
        uoM: string;
        docStatus: string;
        sapStatus: string;
    }[];
};

const DeliveryOrderComponent: FC = () => {

    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1300px)');

    const [deliveryOrderItems, setDeliveryOrderItems] = useState<DeliveryOrderProps[]>([]);
    const [deliveryOrderItemsCount, setDeliveryOrderItemsCount] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    console.log('DO List: ', deliveryOrderItems);

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // FIlterbar states...!
    const [saleOrderNo, setSaleOrderNo] = useState<string | null>(null);
    const [orderDate, setOrderDate] = useState<string | null>(null);
    const [itemCode, setItemCode] = useState<string | null>(null);

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
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (rowId: string) => {
        console.log('Toggling row: ', rowId, expandedRows);
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

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
    const columns = useMemo<ColumnDef<DeliveryOrderProps>[]>(
        () => [
            {
                id: 'expand',
                header: '',
                cell: ({ row }) => (
                    <ActionIcon
                        variant="subtle"
                        onClick={() => toggleRow(row.original.id)}
                    >
                        {
                            expandedRows[row.original.id]
                                ? <IconChevronDown size={18} />
                                : <IconChevronRight size={18} />
                        }
                    </ActionIcon>
                ),
                size: 60,
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
                accessorKey: 'doNumber',
                header: 'Delivery Order',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Delivery Order', (deliveryOrderItems || []).map(item => item.doNumber), 200, 200),
            },
            {
                accessorKey: 'salesOrder.customer.customerName',
                header: 'Customer Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Customer Name', (deliveryOrderItems || []).map(item => item.salesOrder.customer.customerName), 350, 350),
            },
            {
                accessorKey: 'salesOrder.salesOrderNumber',
                header: 'Sales Order',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Sales Order', (deliveryOrderItems || []).map(item => item.salesOrder.salesOrderNumber), 200, 200),
            },
            {
                accessorKey: 'vehicle.vehicleNumber',
                header: 'Vehicle Number',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Vehicle Number', (deliveryOrderItems || []).map(item => item.vehicle.vehicleNumber), 200, 200),
            },
            {
                accessorKey: 'driver.driverName',
                header: 'Driver Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Driver Name', (deliveryOrderItems || []).map(item => item.driver.driverName), 200, 200),
            },
            {
                accessorKey: 'transportMode',
                header: 'Transport',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Transport', (deliveryOrderItems || []).map(item => item.transportMode), 200, 200),
            },
            {
                accessorKey: 'contractor.contractorName',
                header: 'Contractor Name',
                cell: ({ getValue, row }) => {
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {getValue() as string || 'N/A'}
                        </Text>
                    );
                },
                size: calculateColumnWidth('Contractor Name', (deliveryOrderItems || []).map(item => item?.contractor?.contractorName || 'NA'), 200, 200),
            },
            {
                accessorKey: 'createdBy',
                header: 'Created By',
                cell: ({ getValue }) => {
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {getValue() as string}
                        </Text>
                    );
                },
                size: calculateColumnWidth('Created By', (deliveryOrderItems || []).map(item => item.createdBy), 200, 200),
            },
            {
                accessorKey: 'createdDate',
                header: 'Created Date',
                cell: ({ getValue }) => {
                    const date = new Date(getValue() as string);
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {date.toLocaleDateString()}
                        </Text>
                    );
                },
                size: calculateColumnWidth('Created Date', (deliveryOrderItems || []).map(item => item.createdDate), 200, 200),
            },
            {
                accessorKey: 'deliveryDate',
                header: 'Delivery Date',
                cell: ({ getValue }) => {
                    const date = new Date(getValue() as string);
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {date.toLocaleDateString()}
                        </Text>
                    );
                },
                size: calculateColumnWidth('Delivery Date', (deliveryOrderItems || []).map(item => item.deliveryDate), 150, 200),
            },
            {
                // accessorKey: 'batchId',
                header: 'Action',
                cell: ({ getValue, row }) => {
                    const rowData = row.original;
                    return (
                        <Button
                            variant="transparent"
                            className="filledButton"
                            size="sm"
                            radius={8}
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={() => rowData && generatePDF(rowData as any)}
                        >
                            Generate PDF
                        </Button>
                    )
                },
                size: calculateColumnWidth('Action', ['Edit'], 100, 120)
            }
        ],
        [deliveryOrderItems]
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
        data: deliveryOrderItems,
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
        pageCount: Math.ceil(deliveryOrderItemsCount / pagination.pageSize), // Calculate total pages from server data
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

    // Note: Fetch all delivery order items...!
    const fetchAllDeliveryOrderItems = async (filterByDate?: any) => {
        try {
            const skipRecord = pagination.pageIndex * pagination.pageSize;
            const params: { [key: string]: number } = {};

            if (pagination.pageSize !== undefined) params.lastCount = pagination.pageSize;
            if (skipRecord !== undefined) params.skipRecords = skipRecord;
            if (filterByDate !== undefined) params.CreatedDate = filterByDate;

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_ALL_DELIVERY_ORDER_ITEMS}?DocStatus=Completed`, authenticatedUser?.token, params);
            console.log('DO List: ', response);

            const { status, data } = response;
            if (status == 200) {
                setDeliveryOrderItems(data?.data?.data || []);
                setDeliveryOrderItemsCount(data?.data?.totalRecords || 0);
                setIsLoading(false);
            };

            if (!String(status).startsWith('2')) {
                setIsLoading(false);
                setDeliveryOrderItems([]);
                setDeliveryOrderItemsCount(0);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching delivery order items', error);
        };
    };

    useEffect(() => {
        if (selectedDate) {
            console.log("Selected Date:", selectedDate);
            const isoFormat = new Date(selectedDate).toISOString();
            // dispatch(listProductionOrder({
            //     CreatedDate: selectedDate,
            //     lastCount: pagination.pageSize,
            //     skipRecord: skipRecord
            // }));
            fetchAllDeliveryOrderItems(isoFormat);
        }

        else {
            fetchAllDeliveryOrderItems();
        };
    }, [selectedDate]);

    useEffect(() => {
        if (authenticatedUser) {
            setIsLoading(true);
            fetchAllDeliveryOrderItems();
        };
    }, [authenticatedUser, pagination.pageIndex, pagination.pageSize]);

    return (
        <Box p={8}>
            <Group justify={customStyles.alignment.spaceBetween} align={customStyles.alignment.center} style={{ flexShrink: 0, marginBottom: '16px' }}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>
                        Delivery Order
                    </Title>
                    <Text c={customStyles.colors._909090}>
                        Create, monitor, and control delivery orders from warehouse to customer with real-time visibility.
                    </Text>
                </Stack>
                {/* <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                    onClick={() => router.push(routes.addDeliveryOrder)}
                >
                    Add Delivery Order
                </Button> */}

                {/* {
                    deliveryOrderItems.length > 0 &&
                    <Button
                        leftSection={<IconDownload size={24} />}
                        className='filledButton'
                        variant="transparent"
                        size="md"
                        radius={8}
                        onClick={() => generatePDF(deliveryOrderItems)}
                    >
                        Generate PDF
                    </Button>
                } */}
            </Group>

            <Grid
                mt={16}
                mb={8}
                bg={customStyles.colors.white}
                p={24}
                align='center'
                justify="space-between"
                style={{
                    borderRadius: '16px',
                    gap: isSmallScreen ? '16px' : '24px'
                }}
            >

                <Stack gap={8}>
                    <Title order={3} c={customStyles.colors._4D4D4D}>
                        Delivery Order
                    </Title>
                    <Text c={customStyles.colors._909090}>
                        Select a date to filter delivery orders and generate a PDF report for that specific date.
                    </Text>
                </Stack>

                <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                    <Text size="md" mb={8} fw={500}>Select Date</Text>
                    <DatePickerInput
                        placeholder="Select Date"
                        value={selectedDate}
                        onChange={(value: string | null) => setSelectedDate(value as string)}
                        radius={8}
                        size='md'
                        clearable
                    />
                </GridCol>
            </Grid>

            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>

                <Group mb={24} justify={customStyles.alignment.spaceBetween} align={customStyles.alignment.center} style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Delivery Order
                        </Title>
                        <Text c={customStyles.colors._909090}>Track and review delivery order seamlessly.</Text>
                    </Stack>
                    {/* <Group gap="xs">
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
                    </Group> */}
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
                            {table.getHeaderGroups().map(headerGroup =>
                            (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} style={{
                                            cursor: 'pointer',
                                            textAlign: customStyles.alignment.left,
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
                                            </Group>
                                            {/* Note: Table Filter Input */}
                                            {/* {
                                                header.column.getCanFilter() && (
                                                    <TableColumnsFilter
                                                        areTableFiltersVisible={areTableFiltersVisible}
                                                        placeholder={header.column.columnDef.header as string}
                                                        value={header.column.getFilterValue() as string ?? ''}
                                                        setValue={value => header.column.setFilterValue(value)}
                                                    />
                                                )
                                            } */}
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
                                                textAlign: customStyles.alignment.left,
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
                                    <>
                                        {/* Main Row */}
                                        <tr
                                            key={row.id}
                                            style={{ borderBottom: `1px solid ${customStyles.colors._E1E7EC}` }}
                                        >
                                            {
                                                row.getVisibleCells().map(cell => (
                                                    <td
                                                        key={cell.id}
                                                        style={{
                                                            textAlign: customStyles.alignment.left,
                                                            padding: '12px',
                                                            verticalAlign: 'middle',
                                                        }}
                                                    >
                                                        {
                                                            flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )
                                                        }
                                                    </td>
                                                ))
                                            }
                                        </tr>

                                        {/* Expanded Row */}
                                        {expandedRows[row.original.id] && (
                                            <tr>
                                                <td
                                                    colSpan={columns.length}
                                                    style={{
                                                        padding: '16px',
                                                        background: '#f8f9fa'
                                                    }}
                                                >
                                                    <Text fw={600} mb={12}>
                                                        Items
                                                    </Text>

                                                    <table
                                                        style={{
                                                            width: '100%',
                                                            borderCollapse: 'collapse'
                                                        }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th style={{ textAlign: customStyles.alignment.left, padding: '8px' }}>
                                                                    Item Code
                                                                </th>
                                                                <th style={{ textAlign: customStyles.alignment.left, padding: '8px' }}>
                                                                    Item Name
                                                                </th>
                                                                <th style={{ textAlign: customStyles.alignment.left, padding: '8px' }}>
                                                                    Quantity
                                                                </th>
                                                                <th style={{ textAlign: customStyles.alignment.left, padding: '8px' }}>
                                                                    UOM
                                                                </th>
                                                                <th style={{ textAlign: customStyles.alignment.left, padding: '8px' }}>
                                                                    SAP Status
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {
                                                                row.original.items?.map((item, index) => (
                                                                    <tr key={item.id}>
                                                                        <td style={{ padding: '8px' }}>
                                                                            {item.itemCode}
                                                                        </td>

                                                                        <td style={{ padding: '8px' }}>
                                                                            {item.itemName}
                                                                        </td>

                                                                        <td style={{ padding: '8px' }}>
                                                                            {item.quantity}
                                                                        </td>

                                                                        <td style={{ padding: '8px' }}>
                                                                            {item.uoM}
                                                                        </td>

                                                                        <td style={{ padding: '8px' }}>
                                                                            {item.sapStatus}
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} style={{
                                        textAlign: customStyles.alignment.center,
                                        padding: '32px 16px',
                                        borderBottom: 'none'
                                    }}>
                                        <Stack justify={customStyles.alignment.center} align={customStyles.alignment.center}>
                                            <Image w={180} h={180} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='Data Not Found' />
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
                <Group justify={customStyles.alignment.spaceBetween} align={customStyles.alignment.center}>
                    {/* Left side - Page navigation */}
                    <Group justify={customStyles.alignment.left} align={customStyles.alignment.center} gap="xs">
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

                        <Group gap="xs" align={customStyles.alignment.center}>
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
                    <Group gap="md" align={customStyles.alignment.center}>
                        <Group gap="xs" align={customStyles.alignment.center}>
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
                            Showing {(pagination.pageIndex * pagination.pageSize) + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, deliveryOrderItemsCount)} of {deliveryOrderItemsCount} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box >
    )
}

export default memo(DeliveryOrderComponent);