// Note: IT Table Component...!

import React, { memo, useState, useEffect, useMemo } from 'react';
import {
    Table,
    Flex,
    Select,
    Box,
    Button,
    Stack,
    Text,
    Group,
    Title,
    ActionIcon,
    Image
} from '@mantine/core';
import NextImage from 'next/image'
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '@/components/data-not-found/data-not-found';
import { IT_DataType } from '@/types/redux-types';
import { customStyles } from '@/styles/custom-theme';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data, fetchAllItData } from '@/redux/actions/itr-actions/itr-actions';
import Loader from '../loader/loader';
import { useMediaQuery } from '@mantine/hooks';
import { IconBuildingWarehouse, IconCalendarMonth, IconSearch, IconColumns, IconBorderCorners, IconSearchOff, IconFilterOff, IconFilter, IconArrowsUpDown, IconChevronRight, IconChevronDown, IconChevronLeft, IconArrowNarrowUp, IconArrowNarrowDown } from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
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
    getPaginationRowModel,
} from '@tanstack/react-table';
import { GlobalSearchFilter } from '@/components/table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';
import { localAssets } from '@/lib/file-paths/file-paths';

// Note: IT Data type based on actual Redux state structure
type ITDataType = {
    id: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    itemCode: string,
    itemName: string,
    binCode: string,
    barCode: string,
    docStatus: string,
    receivedQuantity: string | number,
    erpDocEntry: string | number,
    erpObjectType: string | number,
    erpDocLine: string | number,
    sapStatus: string,
    inTransit: string,
    docNum: string | number,
    uniqueId: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
};

type ApiProp = {
    apiUrl: string;
};

const IT_TableCom: React.FC<ApiProp> = ({ apiUrl }) => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1200px)');

    // Note: state for date
    const [selectDate, setSelectDate] = useState<string | null>(null);

    // Note: States...!
    const [isLoading, setIsLoading] = useState(false);

    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const lastCount = pagination.pageSize;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { itData, itDataCount, itrErrorState } = useAppSelector(({ itrStates }) => { return itrStates });

    const totalPages = Math.ceil(itDataCount / pagination.pageSize);

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
    const columns = useMemo<ColumnDef<ITDataType>[]>(
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
                size: calculateColumnWidth('Document Number', itData.map(item => String(item.docNum)), 120, 200),
            },
            {
                accessorKey: 'uniqueId',
                header: 'Base Doc Num',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                size: calculateColumnWidth('Base Document Number', itData.map(item => String(item.uniqueId)), 180, 220),
            },
            {
                accessorKey: 'fromWarehouseId',
                header: 'From WH Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('From Warehouse Code', itData.map(item => item.fromWarehouseId), 180, 220),
            },
            {
                accessorKey: 'toWarehouseId',
                header: 'To WH Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('To Warehouse Code', itData.map(item => item.toWarehouseId), 180, 220),
            },
            {
                accessorKey: 'docStatus',
                header: 'Doc Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Document Status', itData.map(item => item.docStatus), 150, 200),
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Code', itData.map(item => item.itemCode), 180, 220),
            },
            {
                accessorKey: 'itemName',
                header: 'Item Description',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Description', itData.map(item => item.itemName), 200, 300),
            },
            {
                accessorKey: 'erpDocEntry',
                header: 'ERP Doc Entry',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                size: calculateColumnWidth('ERP Document Entry', itData.map(item => String(item.erpDocEntry || '-')), 180, 220),
            },
            {
                accessorKey: 'erpObjectType',
                header: 'ERP Object Type',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                size: calculateColumnWidth('ERP Object Type', itData.map(item => String(item.erpObjectType || '-')), 200, 220),
            },
            {
                accessorKey: 'erpDocLine',
                header: 'ERP Doc Line',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : "-"}
                    </Text>
                ),
                size: calculateColumnWidth('ERP Doc Line', itData.map(item => String(item.erpDocLine || '-')), 200, 220),
            },
            {
                accessorKey: 'sapStatus',
                header: 'SAP Status',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('SAP Status', itData.map(item => item.sapStatus), 180, 200),
            }
        ],
        [itData, skipRecord]
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

        // Handle other columns
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    const table = useReactTable({
        data: itData,
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
            const columnIds = ['S.No', 'docNum', 'uniqueId', 'fromWarehouseId', 'toWarehouseId', 'docStatus', 'itemCode', 'itemName', 'erpDocEntry', 'erpObjectType', 'erpDocLine', 'sapStatus'];
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        onPaginationChange: setPagination,
        manualPagination: false,
        // pageCount: Math.ceil(itDataCount / pagination.pageSize),
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
            // setLoading(true);
            dispatch(fetchAllItData({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: 1000,
                skipRecords: 0
            }));
        };
    }, [authenticatedUser]);

    return (
        <Box>
            {/* Search Bar */}
            <Group
                p={isSmallScreen ? 16 : 24}
                justify={isSmallScreen ? 'flex-start' : customStyles.alignment.right}
                align={isSmallScreen ? 'stretch' : 'flex-end'}
                bg={customStyles.colors.white}
                style={{ borderRadius: '16px' }}
                wrap="wrap"
                gap={isSmallScreen ? 16 : 24}
            >
                {/* <Group
                    w={isSmallScreen ? '100%' : 'auto'}
                    justify={isSmallScreen ? 'center' : 'flex-start'}
                    wrap="wrap"
                    gap={isSmallScreen ? 12 : 16}
                >
                    <Stack
                        gap={0}
                        w={isSmallScreen ? '100%' : isMediumScreen ? '48%' : isLargeScreen ? 300 : 250}
                        maw={isSmallScreen ? '100%' : 350}
                    >
                        <Text size="md" mb={8} fw={500}>Date</Text>
                        <DatePickerInput
                            rightSection={<IconCalendarMonth size={24} />}
                            rightSectionPointerEvents='none'
                            placeholder="DD/MM/YY"
                            value={selectDate}
                            onChange={(value: string) => setSelectDate(value)}
                            radius={8}
                            size='md'
                            clearable
                        />
                    </Stack>
                </Group> */}
                <Button
                    variant='transparent'
                    className='filledButton'
                    radius={8}
                    size={isSmallScreen ? 'sm' : 'md'}
                    leftSection={<IconBuildingWarehouse size={isSmallScreen ? 20 : 24} />}
                    // onClick={handleAssignGroups}
                    w={isSmallScreen ? '100%' : 'auto'}
                    mt={isSmallScreen ? 16 : 0}
                >
                    Export To CSV
                </Button>
            </Group>

            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Manage IT Data
                        </Title>
                        <Text c={customStyles.colors._909090}>View, search, and manage all IT data by using multiple filters.</Text>
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

                {itData.length < 1 && <DataNotFound notFoundContent={itrErrorState || "No IT data found."} />}
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
                                rightSectionPointerEvents='none'
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
                                <span> (filtered from {itDataCount} total entries)</span>
                            )}
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box>
    );
};

export default memo(IT_TableCom);