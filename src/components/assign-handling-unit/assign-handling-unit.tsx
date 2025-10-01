'use client';

import { localAssets } from "@/lib/file-paths/file-paths";
import showNotificationToast from "@/lib/notification-toast/notification-toast";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { ActionIcon, Box, Button, Checkbox, Group, Image, Select, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsUpDown, IconBorderCorners, IconBuildingWarehouse, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconFilter, IconFilterOff, IconPackage, IconSearch, IconSearchOff } from "@tabler/icons-react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table";
import NextImage from 'next/image';
import { useCallback, useEffect, useMemo, useState } from "react";
import { GlobalSearchFilter } from "../table-filters/GlobalSearchFilter";
import { TableColumnsFilter } from "../table-filters/TableColumnsFilter";
import { getItemByGroupId, listItemCodes } from "@/redux/actions/sap-actions/sap-actions";
import { ItemDataByHandlingUnitId, ItemDataProps } from "@/types/redux-types";
import { assignHandlingUnitToItems, fetchHandlingUnits } from "@/redux/actions/handling-unit-actions/handling-unit-actions";
import { stringFilterFn } from "@/constants/table-filteration";

const AssignHandlingUnitComponent = () => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1200px)');

    const [selectedHandlingUnit, setSelectedHandlingUnit] = useState<string | null>(null);

    // Note: Item Permission
    const [itemPermission, setItemPermission] = useState<ItemDataByHandlingUnitId>();

    // Note: Dispatcher for all Actions
    const dispatch = useAppDispatch();

    // Item Code List State
    const { list_Item_Code_Data, totalItemCodeCount, list_item_Code_Data_By_Group_Id } = useAppSelector(({ sapStates }) => sapStates);

    console.log("List Item By Handling Unit Id:", list_item_Code_Data_By_Group_Id);
    const { handlingUnit } = useAppSelector(({ handlingUnitStates }) => handlingUnitStates);

    // Transform users data for Select component
    const selectHandlingUnitData = handlingUnit
        ?.map(user => ({
            value: user.groupId,
            label: user.groupName
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

    // Note: State for Table Filters
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);

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

    // Note: Handle Permission Change
    const handlePermissionChange = useCallback((groupId: string, permission: 'allow', checked: boolean) => {
        setItemPermission(prev => {
            // Initialize if undefined
            if (!prev) {
                return {
                    groupId: selectedHandlingUnit || '',
                    itemIds: [groupId]
                };
            }

            // Check if groupId already exists in the array
            const existingIndex = prev.itemIds.findIndex(code => code === groupId);

            if (existingIndex === -1) {
                // Group code doesn't exist, add it
                return {
                    ...prev,
                    groupId: selectedHandlingUnit || prev.groupId,
                    itemIds: [...prev.itemIds, groupId]
                };
            } else {
                // Group code exists, remove it
                return {
                    ...prev,
                    groupId: selectedHandlingUnit || prev.groupId,
                    itemIds: prev.itemIds.filter(code => code !== groupId)
                };
            }
        });
    }, [selectedHandlingUnit]);

    // Note: Handle Select All for current page
    const handleSelectAllCurrentPage = useCallback((checked: boolean, currentPageData: ItemDataProps[]) => {
        if (!selectedHandlingUnit) return;

        const currentPageItemIds = currentPageData.map((item: ItemDataProps) => String(item.id));

        setItemPermission(prev => {
            const existingItemIds = prev?.itemIds || [];

            if (checked) {
                // Add all current page item IDs that aren't already selected
                const newItemIds = [...existingItemIds];
                currentPageItemIds.forEach((code: string) => {
                    if (!newItemIds.includes(code)) {
                        newItemIds.push(code);
                    }
                });

                return {
                    groupId: selectedHandlingUnit,
                    itemIds: newItemIds
                };
            } else {
                // Remove all current page item IDs
                const filteredItemIds = existingItemIds.filter((code: string | number) =>
                    !currentPageItemIds.includes(String(code))
                );

                return {
                    groupId: selectedHandlingUnit,
                    itemIds: filteredItemIds
                };
            }
        });
    }, [selectedHandlingUnit]);

    // Note: Columns Data for Assign Groups
    const columns = useMemo<ColumnDef<ItemDataProps>[]>(
        () => [
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
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Code', list_Item_Code_Data?.map(item => String(item.itemCode)) || [], 150, 400),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                enableSorting: true,
            },
            {
                accessorKey: 'itemName',
                header: 'Item Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Item Name', list_Item_Code_Data?.map(item => item.itemName) || [], 180, 450),
                filterFn: stringFilterFn,
                enableColumnFilter: true,
                enableSorting: true,
            },
            {
                id: 'allow', // Add id for display column
                header: ({ table }) => {
                    // Calculate select all state inside the header component
                    const currentPageRows = table.getRowModel().rows;
                    const currentPageData = currentPageRows.map((row: any) => row.original);
                    const currentPageGroupCodes = currentPageData.map((item: ItemDataProps) => String(item.id));
                    const allCurrentPageSelected = currentPageRows.length > 0 &&
                        currentPageGroupCodes.every((code: string) => itemPermission?.itemIds?.includes(code));
                    const someCurrentPageSelected = currentPageGroupCodes.some((code: string) => itemPermission?.itemIds?.includes(code));

                    return (
                        <Group gap={8} align="center">
                            <Checkbox
                                checked={allCurrentPageSelected}
                                indeterminate={!allCurrentPageSelected && someCurrentPageSelected}
                                onChange={(event) => handleSelectAllCurrentPage(event.currentTarget.checked, currentPageData)}
                                size="sm"
                                color={customStyles.colors._1B59F8}
                                radius="xl"
                                disabled={!selectedHandlingUnit || currentPageRows.length === 0}
                                title="Select all on current page"
                            />
                            <span>Allow</span>
                        </Group>
                    );
                },
                cell: ({ row }) => {
                    const itemId = row.original.id; // Using id as unique identifier
                    const isChecked = itemPermission?.itemIds?.includes(String(itemId)) || false;

                    return (
                        <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                                handlePermissionChange(String(itemId), 'allow', event.currentTarget.checked)
                            }
                            size="sm"
                            color={customStyles.colors._1B59F8}
                            label='Allow access'
                            radius="xl"
                            disabled={!selectedHandlingUnit} // Disable when no user is selected
                            w={200}
                            styles={
                                {
                                    root: {
                                        padding: '10px 16px',
                                        border: isChecked ? `1px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._E1E7EC}`,
                                        background: isChecked ? customStyles.colors._1B59F81A : '',
                                        borderRadius: '6px',
                                        opacity: !selectedHandlingUnit ? 0.5 : 1 // Add visual feedback when disabled
                                    },
                                    label: {
                                        color: isChecked ? customStyles.colors._1B59F8 : customStyles.colors._909090,
                                    }
                                }
                            }
                        />
                    );
                },
                size: 120,
            },
        ],
        [list_Item_Code_Data, itemPermission, handlePermissionChange, selectedHandlingUnit, handleSelectAllCurrentPage] // Remove circular dependencies
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
        data: list_Item_Code_Data || [],
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
        pageCount: Math.ceil(totalItemCodeCount / pagination.pageSize), // Calculate total pages from server data
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
        dispatch(fetchHandlingUnits({}))
    }, [dispatch])

    useEffect(() => {
        dispatch(listItemCodes({
            lastCount: pagination.pageSize,
            skipRecords: pagination.pageIndex * pagination.pageSize
        }))
    }, [pagination.pageIndex, pagination.pageSize, dispatch]);

    // Reset warehouse permissions when user changes
    // useEffect(() => {
    //     setItemPermission(undefined);
    // }, [selectedHandlingUnit]);

    // Update group permissions when list_item_Code_Data_By_Group_Id changes
    useEffect(() => {
        if (selectedHandlingUnit) {
            if (list_item_Code_Data_By_Group_Id) {
                setItemPermission({
                    groupId: selectedHandlingUnit,
                    itemIds: list_item_Code_Data_By_Group_Id.itemIds
                });
            } else {
                // Reset to empty array if no groups assigned to this user
                setItemPermission(undefined);
            }
        }
    }, [list_item_Code_Data_By_Group_Id, selectedHandlingUnit]);

    useEffect(() => {
        if (selectedHandlingUnit) {
            dispatch(getItemByGroupId({ groupId: selectedHandlingUnit }));
        }
    }, [dispatch, selectedHandlingUnit]);

    // Handle response from API
    const handleResponse = (status: number) => {
        const errorResponseCodes = {
            400: "Bad Request - Invalid data provided",
            500: "Server Error - Please try again later",
            409: "Conflict - Handling Unit with this name already exists"
        }

        if (status === 200 || status === 201) {
            showNotificationToast("Handling Unit Added", "Handling Unit added successfully", customStyles.colors._408CCE);
            // setItemPermission(undefined);
            return;
        }

        if (errorResponseCodes[status as keyof typeof errorResponseCodes]) {
            showNotificationToast("Error Adding Handling Unit", errorResponseCodes[status as keyof typeof errorResponseCodes], customStyles.colors.red);
            return;
        }
    }


    const handleAssignHandlingUnitToItems = () => {
        dispatch(assignHandlingUnitToItems({
            body: itemPermission!,
            resHandler: handleResponse
        }))
    }

    return (
        <Box>
            <Title
                mb={8}
                order={isSmallScreen ? 3 : 2}
                c={customStyles.colors._4D4D4D}
                size={isSmallScreen ? 'h3' : 'h2'}
            >
                Assign Handling Unit
            </Title>
            <Text
                mb={isSmallScreen ? 16 : 24}
                c={customStyles.colors._909090}
                size={isSmallScreen ? 'sm' : 'md'}
            >
                Select assign Handling Units to Items
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
                        w={isSmallScreen ? '100%' : isMediumScreen ? '48%' : isLargeScreen ? 300 : 250}
                        maw={isSmallScreen ? '100%' : 350}
                    >
                        <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>Select Handling Unit</Text>
                        <Select
                            placeholder="Select Handling Unit"
                            data={selectHandlingUnitData}
                            value={selectedHandlingUnit}
                            onChange={(value) => setSelectedHandlingUnit(value ?? '')}
                            clearable
                            w='100%'
                            radius={8}
                            size={isSmallScreen ? 'sm' : 'md'}
                        />
                    </Stack>
                </Group>
                <Button
                    variant='transparent'
                    className={!selectedHandlingUnit ? 'filledDisabledButton' : 'filledButton'}
                    radius={8}
                    size={isSmallScreen ? 'sm' : 'md'}
                    leftSection={<IconPackage size={isSmallScreen ? 20 : 24} />}
                    onClick={handleAssignHandlingUnitToItems}
                    disabled={!selectedHandlingUnit}
                    w={isSmallScreen ? '100%' : 'auto'}
                    mt={isSmallScreen ? 16 : 0}
                >
                    {isSmallScreen ? 'Assign' : 'Assign Handling Units'}
                </Button>
            </Group>

            {/* Main Content */}
            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Items List
                        </Title>
                        <Text c={customStyles.colors._909090}>
                            Select handling unit to assign items
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
                                                {/* <Text style={{ whiteSpace: 'nowrap' }} fw={600} c={customStyles.colors._4D4D4D}> */}
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {/* </Text> */}
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
                            Showing {skipRecord + 1} to {Math.min(skipRecord + pagination.pageSize, totalItemCodeCount)} of {totalItemCodeCount} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box>
    )
}

export default AssignHandlingUnitComponent;