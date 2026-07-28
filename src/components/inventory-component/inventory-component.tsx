'use client';

import { stringFilterFn } from "@/constants/table-filteration";
import { localAssets } from "@/lib/file-paths/file-paths";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { assignHandlingUnitToItems, fetchHandlingUnits, unassignHandlingUnitFromItems } from "@/redux/actions/handling-unit-actions/handling-unit-actions";
import { getItemByGroupId, listItemCodes } from "@/redux/actions/sap-actions/sap-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { ItemDataByHandlingUnitId, ItemDataProps } from "@/types/redux-types";
import { ActionIcon, Box, Button, Checkbox, Group, Image, Select, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsUpDown, IconBorderCorners, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconFilter, IconFilterOff, IconPackage, IconSearch, IconSearchOff } from "@tabler/icons-react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import NextImage from 'next/image';
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { GlobalSearchFilter } from "../table-filters/GlobalSearchFilter";
import { TableColumnsFilter } from "../table-filters/TableColumnsFilter";
import AssignHandlingUnitComponent from "../assign-handling-unit/assign-handling-unit";
import axios from "axios";

export interface InventoryItem {
    itemCode: string;
    itemName: string;
    code: string;
    capacity: number;
    stageName: string;
    stageLevel: number;
    productionOrderId: string;
}

const InventoryComponent = () => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');

    const [selectedItemCode, setSelectedItemCode] = useState<string | null>(null);
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [inventoryDataCount, setInventoryDataCount] = useState(0);

    // Note: Dispatcher for all Actions
    const dispatch = useAppDispatch();

    // Item Code List State
    const { list_Item_Code_Data, totalItemCodeCount } = useAppSelector(({ sapStates }) => sapStates);
    // console.log('list_item_Code_Data:', list_Item_Code_Data);

    // Transform users data for Select component
    const itemCodesData = list_Item_Code_Data?.map(user => ({
        value: user.itemCode,
        label: user.itemName
    })) || [];

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

    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

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

    // Note: Columns Data for Assign Groups
    const columns = useMemo<ColumnDef<InventoryItem>[]>(
        () => [
            {
                header: 'S.No',
                cell: ({ row }) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {(pagination.pageIndex * pagination.pageSize) + row.index + 1}
                    </Text>
                ),
                size: calculateColumnWidth('S.No', ['99999'], 80, 120), // Assuming max 999 records
            },
            {
                accessorKey: "itemCode",
                header: "Item Code",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Code', inventoryData?.map(item => String(item.itemCode)) || [], 150, 400),
            },
            {
                accessorKey: "itemName",
                header: "Item Name",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Name', inventoryData?.map(item => item.itemName) || [], 180, 450),
            },
            {
                accessorKey: "code",
                header: "Code",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Code', inventoryData?.map(item => item.code) || [], 150, 400),
            },
            {
                accessorKey: "capacity",
                header: "Capacity",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090}>
                        {getValue() as number}
                    </Text>
                ),
                size: calculateColumnWidth('Capacity', inventoryData?.map(item => String(item.capacity)) || [], 150, 400),
            },
            {
                accessorKey: "stageName",
                header: "Stage Name",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Stage Name', inventoryData?.map(item => item.stageName) || [], 180, 450),
            },
            {
                accessorKey: "stageLevel",
                header: "Stage Level",
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090}>
                        {getValue() as number}
                    </Text>
                ),
                size: calculateColumnWidth('Stage Level', inventoryData?.map(item => String(item.stageLevel)) || [], 150, 400),
            },
            {
                accessorKey: "productionOrderId",
                header: "Production Order ID",
                cell: ({ getValue }) => (
                    <Text
                        c={customStyles.colors._909090}
                        style={{
                            maxWidth: 280,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Production Order ID', inventoryData?.map(item => item.productionOrderId) || [], 180, 450),
            },
        ],
        [pagination]
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
            const serialNumber = row.index + (table?.getState?.()?.pagination?.pageIndex || 0) * (table?.getState?.()?.pagination?.pageSize || 10) + 1;
            return String(serialNumber).includes(value);
        }

        // Handle other columns (convert to string and search)
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    // Note: Table Definition
    const table = useReactTable({
        data: inventoryData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        onSortingChange: setSorting,
        enableSorting: true,
        manualSorting: false, // Disabled for client-side sorting

        onGlobalFilterChange: (value) => {
            setGlobalFilter(value);
            // Reset to first page when global filter changes
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        enableGlobalFilter: true,
        onColumnFiltersChange: (filters) => {
            setColumnFilters(filters);
            // Reset to first page when column filters change
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        globalFilterFn: (row, columnId, value) => {
            // Get all column IDs to search across
            const columnIds = ['S.No', 'itemCode', 'itemName'];

            // Search across all columns
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        onPaginationChange: setPagination,
        manualPagination: true, // Enable server-side pagination
        pageCount: Math.ceil(inventoryDataCount / pagination.pageSize), // Calculate total pages from server data
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
        dispatch(listItemCodes({}));
    }, []);

    // useEffect(() => {
    //     dispatch(listItemCodes({
    //         lastCount: pagination.pageSize,
    //         skipRecords: pagination.pageIndex * pagination.pageSize
    //     }))
    // }, [pagination.pageIndex, pagination.pageSize]);

    const getBoxesByItemCode = async (itemCode: string) => {
        try {
            console.log('Item code:', itemCode);

            const res = await axios({
                method: 'GET',
                url: `http://163.61.91.173:31131/Track_And_Trace${process.env.NEXT_PUBLIC_GET_BOXES_BY_ITEM_CODE}?itemCode=${itemCode}`,
                headers: {
                    'Authorization': `Bearer ${authenticatedUser?.token}`
                },
                params: {
                    LastCount: lastCount,
                    skipRecord: skipRecord
                }
            });
            console.log('Boxes by Item Code Response:', res);
            const targetData = res?.data?.data?.data;
            const count = res?.data?.data?.totalCount || 0;
            setInventoryData(targetData || []);
            setInventoryDataCount(count);
        }

        catch (error) {
            console.error('Something went wrong while fetching boxes by item code:', error);
            // showNotificationToast('Error', 'Failed to fetch boxes for the selected item code.', 'error');
        };
    };


    useEffect(() => {
        if (selectedItemCode) {
            // console.log('Selected item:', selectedItemCode);
            selectedItemCode && getBoxesByItemCode(selectedItemCode);
        }
    }, [selectedItemCode , pagination.pageIndex, pagination.pageSize]);

    return (
        <Box>
            <Title
                mb={8}
                order={isSmallScreen ? 3 : 2}
                c={customStyles.colors._4D4D4D}
                size={isSmallScreen ? 'h3' : 'h2'}
            >
                Inventory Management
            </Title>
            <Text
                mb={isSmallScreen ? 16 : 24}
                c={customStyles.colors._909090}
                size={isSmallScreen ? 'sm' : 'md'}
            >
                Inventory Management Screen
            </Text>

            {/* Search Bar */}
            <Group
                p={isSmallScreen ? 16 : 24}
                justify={isSmallScreen ? 'flex-start' : customStyles.alignment.spaceBetween}
                align={isSmallScreen ? 'stretch' : 'flex-end'}
                bg={customStyles.colors.white}
                style={{ borderRadius: '16px' }}
                wrap="wrap"
                gap={isSmallScreen ? 16 : 24}
            >
                <Group
                    w={isSmallScreen ? '100%' : 'auto'}
                    justify={isSmallScreen ? 'center' : 'flex-start'}
                    wrap="wrap"
                    gap={isSmallScreen ? 12 : 16}
                >
                    <Stack
                        gap={4}
                        w={
                            isSmallScreen
                                ? "100%"
                                : isMediumScreen
                                    ? "60%"
                                    : 450
                        }
                        maw={500}
                    >
                        <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>Select Item Code</Text>
                        <Select
                            placeholder="Select Item Code"
                            data={
                                itemCodesData.length > 0 ? itemCodesData : [{ value: '', label: 'No item codes available' }]
                            }
                            value={selectedItemCode}
                            onChange={(value) => {
                                if (!value) {
                                    setSelectedItemCode(null);
                                    setInventoryData([]);
                                    return;
                                }

                                setSelectedItemCode(value);
                            }}
                            clearable
                            w='100%'
                            radius={8}
                            size={isSmallScreen ? 'sm' : 'md'}
                        />
                    </Stack>
                </Group>
            </Group>

            {/* Main Content */}
            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Inventories List
                        </Title>
                    </Stack>
                </Group>

                {/* Table */}
                <Box
                    className="show-scroll-bar-overflow"
                    w="100%"
                    mah={700}
                    style={{ overflowX: 'auto' }}
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
                                            padding: '0 10px 10px 10px',
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
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </Group>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
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
                            Showing {skipRecord + 1} to {Math.min(skipRecord + pagination.pageSize, inventoryDataCount)} of {inventoryDataCount} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box>
    )
}

export default memo(InventoryComponent);