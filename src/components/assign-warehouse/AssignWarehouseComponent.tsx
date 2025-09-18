'use client'

import { localAssets } from "@/lib/file-paths/file-paths"
import showNotificationToast from "@/lib/notification-toast/notification-toast"
import { fetchAllUsers } from "@/redux/actions/user-actions/user-actions"
import { assignWareHouseToUser, fetchAllWareHouses, fetchWarehousesListByUserId } from "@/redux/actions/warehouse-actions/warehouse-actions"
import { CLEAR_ALL_WAREHOUSE_STATES } from "@/redux/reducers/warehouse-reducer/warehouse-reducer"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { customStyles } from "@/styles/custom-theme"
import { AccessWareHouseDataType } from "@/types/modules/warehouse-types/warehouse-types"
import { WarehousesListData } from "@/types/redux-types"
import { ActionIcon, Box, Button, Checkbox, Group, Image, Select, Stack, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconArrowNarrowDown, IconArrowNarrowUp, IconArrowsUpDown, IconBorderCorners, IconBuildingWarehouse, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconFilter, IconFilterOff, IconSearch, IconSearchOff } from "@tabler/icons-react"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from "@tanstack/react-table"
import NextImage from 'next/image'
import { useCallback, useEffect, useMemo, useState } from "react"
import { GlobalSearchFilter } from "../table-filters/GlobalSearchFilter"
import { TableColumnsFilter } from "../table-filters/TableColumnsFilter"
import classes from "../production-order-section-component/po.module.css";

const AssignWarehouseComponent = () => {
    // Note: media query for responsive design
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1200px)');

    // Note: State for selected user and search input
    const [usersData, setUsersData] = useState([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // Note: State for warehouse permissions
    const [warehousePermissions, setWarehousePermissions] = useState<Array<AccessWareHouseDataType>>([]);

    // Note: Dispatcher for all Actions
    const dispatch = useAppDispatch();

    // Note: State for authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Note: State for User List
    const { usersList: {
        users
    } } = useAppSelector(({ userStates }) => userStates);

    // Note: State for warehouse Data
    const { wareHousesList: {
        data: warehouses,
        totalCount: warehousesTotalCount
    }, warehousesListByUserId } = useAppSelector(({ wareHouseStates }) => wareHouseStates);

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
        setGlobalFilter("");
    };

    const handleTableFiltersVisibility = () => {
        setAreTableFiltersVisible(!areTableFiltersVisible);
        // Reset all filters
        table.getAllColumns().forEach((col) => {
            if (col.getCanFilter()) {
                col.setFilterValue(undefined); // ya ''
            }
        });
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

    // Handle checkbox changes
    const handlePermissionChange = useCallback((warehouseId: string, permission: 'allow' | 'receive', checked: boolean) => {
        setWarehousePermissions(prev => {
            const existingIndex = prev.findIndex(item => item.whsCode === warehouseId);
            const existingPermission = existingIndex !== -1 ? prev[existingIndex] : { allow: false, receive: false, whsCode: warehouseId };

            // Create updated permission object
            const updatedPermission = {
                ...existingPermission,
                whsCode: warehouseId,
                [permission]: checked,
                // If unchecking 'allow', also uncheck 'receive'
                ...(permission === 'allow' && !checked && { receive: false })
            };

            // If the warehouse doesn't exist in the array, add it
            if (existingIndex === -1) {
                return [...prev, updatedPermission];
            } else {
                // If the warehouse exists, update it
                const updated = [...prev];
                updated[existingIndex] = updatedPermission;

                // If both allow and receive are false, remove the item from array (deselect completely)
                if (!updatedPermission.allow && !updatedPermission.receive) {
                    return updated.filter(item => item.whsCode !== warehouseId);
                }

                return updated;
            }
        });
    }, []);

    // Note: Handle Select All for current page
    const handleSelectAllCurrentPage = useCallback((checked: boolean, permission: 'allow' | 'receive', currentPageData: WarehousesListData[]) => {
        if (!selectedUser) return;

        const currentPageWarehouseCodes = currentPageData.map((item: WarehousesListData) => String(item.whsCode));

        setWarehousePermissions(prev => {
            let updatedPermissions = [...prev];

            currentPageWarehouseCodes.forEach((whsCode: string) => {
                const existingIndex = updatedPermissions.findIndex(item => item.whsCode === whsCode);
                const existingPermission = existingIndex !== -1 ? updatedPermissions[existingIndex] : { allow: false, receive: false, whsCode };

                let updatedPermission = { ...existingPermission };

                if (permission === 'allow') {
                    updatedPermission.allow = checked;
                    // If unchecking 'allow', also uncheck 'receive'
                    if (!checked) {
                        updatedPermission.receive = false;
                    }
                } else if (permission === 'receive') {
                    // Can only check 'receive' if 'allow' is already checked
                    if (checked && !existingPermission.allow) {
                        // First enable 'allow', then 'receive'
                        updatedPermission.allow = true;
                        updatedPermission.receive = true;
                    } else {
                        updatedPermission.receive = checked;
                    }
                }

                if (existingIndex === -1) {
                    // Add new permission if it doesn't exist and has some permission
                    if (updatedPermission.allow || updatedPermission.receive) {
                        updatedPermissions.push(updatedPermission);
                    }
                } else {
                    // Update existing permission
                    if (updatedPermission.allow || updatedPermission.receive) {
                        updatedPermissions[existingIndex] = updatedPermission;
                    } else {
                        // Remove if both permissions are false
                        updatedPermissions = updatedPermissions.filter(item => item.whsCode !== whsCode);
                    }
                }
            });

            return updatedPermissions;
        });
    }, [selectedUser]);

    const columns = useMemo<ColumnDef<WarehousesListData>[]>(
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
                accessorKey: 'whsCode',
                header: 'Warehouse Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Warehouse Code', warehouses.map(item => item.whsCode), 150, 400),
            },
            {
                accessorKey: 'whsName',
                header: 'Warehouse Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Warehouse Name', warehouses.map(item => item.whsName), 180, 450),
            },
            {
                id: 'allow', // Add id for display column
                header: ({ table }) => {
                    // Calculate select all state inside the header component
                    const currentPageRows = table.getRowModel().rows;
                    const currentPageData = currentPageRows.map((row: any) => row.original);
                    const currentPageWarehouseCodes = currentPageData.map((item: WarehousesListData) => String(item.whsCode));
                    const allCurrentPageAllowSelected = currentPageRows.length > 0 &&
                        currentPageWarehouseCodes.every((code: string) =>
                            warehousePermissions.find(item => item.whsCode === code)?.allow || false
                        );
                    const someCurrentPageAllowSelected = currentPageWarehouseCodes.some((code: string) =>
                        warehousePermissions.find(item => item.whsCode === code)?.allow || false
                    );

                    return (
                        <Group gap={8} align="center">
                            <Checkbox
                                checked={allCurrentPageAllowSelected}
                                indeterminate={!allCurrentPageAllowSelected && someCurrentPageAllowSelected}
                                onChange={(event) => handleSelectAllCurrentPage(event.currentTarget.checked, 'allow', currentPageData)}
                                size="sm"
                                color={customStyles.colors._1B59F8}
                                radius="xl"
                                disabled={!selectedUser || currentPageRows.length === 0}
                                title="Select all on current page"
                            />
                            <span>Allow</span>
                        </Group>
                    );
                },
                cell: ({ row }) => {
                    const warehouseId = row.original.whsCode; // Using whsCode as unique identifier
                    const isChecked = warehousePermissions.find(item => item.whsCode === warehouseId)?.allow || false;

                    return (
                        <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                                handlePermissionChange(warehouseId, 'allow', event.currentTarget.checked)
                            }
                            size="sm"
                            color={customStyles.colors._1B59F8}
                            label='Allow access'
                            radius="xl"
                            w={200}
                            disabled={!selectedUser} // Disable when no user is selected
                            styles={
                                {
                                    root: {
                                        padding: '10px 16px',
                                        border: isChecked ? `1px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._E1E7EC}`,
                                        background: isChecked ? customStyles.colors._1B59F81A : '',
                                        borderRadius: '6px',
                                        opacity: !selectedUser ? 0.5 : 1 // Add visual feedback when disabled
                                    },
                                    label: {
                                        color: isChecked ? customStyles.colors._1B59F8 : customStyles.colors._909090,
                                    }
                                }
                            }
                        />
                    );
                },
                size: 120, // Increased size to accommodate header checkbox
            },
            {
                id: 'receive', // Add id for display column
                header: ({ table }) => {
                    // Calculate select all state inside the header component
                    const currentPageRows = table.getRowModel().rows;
                    const currentPageData = currentPageRows.map((row: any) => row.original);
                    const currentPageWarehouseCodes = currentPageData.map((item: WarehousesListData) => String(item.whsCode));
                    const allCurrentPageReceiveSelected = currentPageRows.length > 0 &&
                        currentPageWarehouseCodes.every((code: string) =>
                            warehousePermissions.find(item => item.whsCode === code)?.receive || false
                        );
                    const someCurrentPageReceiveSelected = currentPageWarehouseCodes.some((code: string) =>
                        warehousePermissions.find(item => item.whsCode === code)?.receive || false
                    );

                    return (
                        <Group gap={8} align="center">
                            <Checkbox
                                checked={allCurrentPageReceiveSelected}
                                indeterminate={!allCurrentPageReceiveSelected && someCurrentPageReceiveSelected}
                                onChange={(event) => handleSelectAllCurrentPage(event.currentTarget.checked, 'receive', currentPageData)}
                                size="sm"
                                color={customStyles.colors._1B59F8}
                                radius="xl"
                                disabled={!selectedUser || currentPageRows.length === 0}
                                title="Select all on current page"
                            />
                            <span>Receiver</span>
                        </Group>
                    );
                },
                cell: ({ row }) => {
                    const warehouseId = row.original.whsCode; // Using whsCode as unique identifier
                    const isChecked = warehousePermissions.find(item => item.whsCode === warehouseId)?.receive || false;
                    const isAllowChecked = warehousePermissions.find(item => item.whsCode === warehouseId)?.allow || false;
                    const isDisabled = !selectedUser || !isAllowChecked; // Disable if no user selected OR allow is not checked

                    return (
                        <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                                handlePermissionChange(warehouseId, 'receive', event.currentTarget.checked)
                            }
                            size="sm"
                            color={customStyles.colors._1B59F8}
                            label='Allow access'
                            radius="xl"
                            w={200}
                            disabled={isDisabled}
                            styles={
                                {
                                    root: {
                                        padding: '10px 16px',
                                        border: isChecked ? `1px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._E1E7EC}`,
                                        background: isChecked ? customStyles.colors._1B59F81A : '',
                                        borderRadius: '6px',
                                        opacity: isDisabled ? 0.5 : 1 // Add visual feedback when disabled
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
            }
        ],
        [warehouses, warehousePermissions, handlePermissionChange, selectedUser, handleSelectAllCurrentPage] // Updated dependencies
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

    const table = useReactTable({
        data: warehouses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Remove client-side filtering and sorting for server-side pagination
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        globalFilterFn: (row, columnId, value) => {
            // Get all column IDs to search across
            const columnIds = ['S.No', 'whsCode', 'whsName'];

            // Search across all columns
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        onPaginationChange: setPagination,
        manualPagination: true, // Enable server-side pagination
        pageCount: Math.ceil(warehousesTotalCount / pagination.pageSize), // Calculate total pages from server data
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
            dispatch(fetchAllUsers({
                authToken: authenticatedUser?.token as string,
            }))
        }
    }, [authenticatedUser?.token, dispatch])

    // Note: warehouse list call with server-side pagination
    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            const skipRecord = pagination.pageIndex * pagination.pageSize;

            dispatch(fetchAllWareHouses({
                authToken: authenticatedUser?.token as string,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false);
            });
        }
    }, [authenticatedUser, dispatch, pagination.pageIndex, pagination.pageSize]) // Add pagination dependencies

    // Reset warehouse permissions when user changes
    useEffect(() => {
        setWarehousePermissions([]);
        // Also clear the Redux state for warehousesListByUserId when user changes
        if (selectedUser === null) {
            dispatch(CLEAR_ALL_WAREHOUSE_STATES());
        }
    }, [selectedUser, dispatch]);

    // Reset warehouse permissions on component mount/unmount to ensure clean state
    useEffect(() => {
        // Reset on mount if no user is selected
        if (!selectedUser) {
            setWarehousePermissions([]);
        }

        // Cleanup function to reset permissions when component unmounts
        return () => {
            setWarehousePermissions([]);
            // Also clear Redux state on component unmount
            dispatch(CLEAR_ALL_WAREHOUSE_STATES());
        };
    }, [dispatch]);

    // Transform users data for Select component
    const activeUsersData = users
        ?.filter(user => user.isActive)
        ?.map(user => ({
            value: user.userId,
            label: user.userName
        })) || [];

    // Note: Fetch warehouse when user is selected
    useEffect(() => {
        if (selectedUser && authenticatedUser?.token) {
            dispatch(fetchWarehousesListByUserId({
                authToken: authenticatedUser?.token as string,
                userId: selectedUser!
            }))
        }
    }, [selectedUser, authenticatedUser?.token, dispatch]);

    // Update warehouse permissions when warehousesListByUserId changes
    useEffect(() => {
        if (selectedUser) {
            if (warehousesListByUserId && warehousesListByUserId.length > 0) {
                const newPermissions: Array<AccessWareHouseDataType> = [];

                warehousesListByUserId.forEach(userWarehouse => {
                    newPermissions.push({
                        allow: userWarehouse.isActive, // Use isActive for allow permission
                        receive: userWarehouse.isReceiver, // Use isReceiver for receive permission
                        whsCode: userWarehouse.whsCode // Store the whsCode
                    });
                });

                setWarehousePermissions(newPermissions);
            } else {
                // Reset to empty array if no warehouses assigned to this user
                setWarehousePermissions([]);
            }
        }
    }, [warehousesListByUserId, selectedUser]);

    // Note: Assign warehouse to user api response handler...!
    const handleResponse = (response: any): void => {

        if (response && response.status == 201) {
            showNotificationToast("Warehouse Assigned Successfully", "Requested warehouses has been assigned to the requested user", customStyles.colors._408CCE);
            return;
        };

        if (response && response.status != 201) {
            showNotificationToast("Warehouse Assignment Failed", "Requested warehouses could not be assigned to the requested user", customStyles.colors.red);

            return;
        };
    };

    const handleAssignWareHouse = () => {
        const allowedWareHouseCodes = warehousePermissions
            .filter(permission => permission.allow && !permission.receive)
            .map(permission => permission.whsCode);

        const receiverWarehouseCodes = warehousePermissions
            .filter(permission => permission.receive)
            .map(permission => permission.whsCode);

        const wareHouseDataObj = {
            normalWarehouseCodes: allowedWareHouseCodes,
            receiverWarehouseCodes,
            userId: selectedUser as string
        }

        dispatch(assignWareHouseToUser({
            token: authenticatedUser?.token as string,
            wareHouseData: wareHouseDataObj,
            resHandler: handleResponse
        }))
    }

    const handleGlobalSearch = (value: string) => {
        table.setGlobalFilter(String(value));
    };

    return (
        <Box>
            <Title
                mb={8}
                order={isSmallScreen ? 3 : 2}
                c={customStyles.colors._4D4D4D}
                size={isSmallScreen ? 'h3' : 'h2'}
            >
                Assign Warehouse
            </Title>
            <Text
                mb={isSmallScreen ? 16 : 24}
                c={customStyles.colors._909090}
                size={isSmallScreen ? 'sm' : 'md'}
            >
                Select user & assign single or multiple warehouse to user
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
                        <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>Select User</Text>
                        <Select
                            placeholder="Select User"
                            data={activeUsersData}
                            value={selectedUser}
                            onChange={(value) => setSelectedUser(value ?? '')}
                            clearable
                            w='100%'
                            radius={8}
                            size={isSmallScreen ? 'sm' : 'md'}
                        />
                    </Stack>

                    {/* Note: Search by warehouse name secion */}
                    {/* <Stack
                        gap={4}
                        w={isSmallScreen ? '100%' : isMediumScreen ? '48%' : isLargeScreen ? 300 : 250}
                        maw={isSmallScreen ? '100%' : 350}
                    >
                        <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>Search Warehouse Name:</Text>
                        <TextInput
                            placeholder="Search by warehouse"
                            leftSection={<IconSearch size={isSmallScreen ? 16 : 18} />}
                            //   value={search}
                            //   onChange={(e) => {
                            //     setSearch(e.currentTarget.value);
                            //     setPage(1);
                            //   }}
                            w='100%'
                            size={isSmallScreen ? 'sm' : 'md'}
                            radius={8}
                        />
                    </Stack> */}
                </Group>
                <Button
                    variant='transparent'
                    className={!selectedUser ? 'filledDisabledButton' : 'filledButton'}
                    radius={8}
                    size={isSmallScreen ? 'sm' : 'md'}
                    leftSection={<IconBuildingWarehouse size={isSmallScreen ? 20 : 24} />}
                    onClick={handleAssignWareHouse}
                    disabled={!selectedUser}
                    w={isSmallScreen ? '100%' : 'auto'}
                    mt={isSmallScreen ? 16 : 0}
                >
                    {isSmallScreen ? 'Assign' : 'Assign Warehouse'}
                </Button>
            </Group>

            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                    <Stack gap={0}>
                        <Title order={3} mb={8} c={customStyles.colors._4D4D4D}>
                            Warehouse List
                        </Title>
                        <Text c={customStyles.colors._909090}>
                            Select user to assign warehouse
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

                {/* Table */}
                <Box
                    maw="100%"
                    mah={700}
                    className={classes.scrollOnHover}
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
                                            padding: '0 16px 16px 11px',
                                            borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#E5E5E5'} `,
                                            verticalAlign: 'top',
                                            width: `${header.getSize()} px`,
                                            minWidth: `${header.getSize()} px`,
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
                                    <tr key={`loading - ${index} `} style={{
                                        borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'} `,
                                    }}>
                                        {columns.map((_, colIndex) => (
                                            <td key={`loading - cell - ${colIndex} `} style={{
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
                                        borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'} `,
                                    }}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} style={{
                                                textAlign: 'left',
                                                padding: '10px',
                                                width: `${cell.column.getSize()} px`,
                                                minWidth: `${cell.column.getSize()} px`,
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
                                rightSection={<IconChevronDown
                                    size={18} />}
                                data={numbersArray.map(num => ({ value: String(num), label: String(num) }))}
                                styles={{
                                    input: {
                                        border: `1px solid ${customStyles.colors._E1E7EC} `
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
                                        border: `1px solid ${customStyles.colors._E1E7EC} `
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
                            Showing {skipRecord + 1} to {Math.min(skipRecord + pagination.pageSize, warehousesTotalCount)} of {warehousesTotalCount} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box>
    )
}

export default AssignWarehouseComponent