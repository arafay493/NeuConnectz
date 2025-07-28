'use client';

import { routes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { fetchAllUsers } from '@/redux/actions/user-actions/user-actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { UserListProps } from '@/types/redux-types';
import { ActionIcon, Badge, Box, Button, Group, Image, Select, Stack, Text, Title } from '@mantine/core';
import { IconArrowsUpDown, IconBorderCorners, IconChevronDown, IconChevronLeft, IconChevronRight, IconColumns, IconEdit, IconFilter, IconFilterOff, IconPointFilled, IconSearch, IconSearchOff, IconUserPlus } from '@tabler/icons-react';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, PaginationState, SortingState, useReactTable } from '@tanstack/react-table';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { GlobalSearchFilter } from '../table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';

interface UserListComponentProps {
    // data: Array<UserListProps>;
}

const UserListComponent: FC<UserListComponentProps> = ({
    // data
}) => {
    // Note: State for pagination
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10, // Adjusted to a more reasonable default
    });

    // Note: Router for switch page
    const route = useRouter()

    const dispatch = useAppDispatch();

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Note: State for Users List
    const { usersList: {
        users: data,
        totalCount
    } } = useAppSelector(({ userStates }) => userStates);

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

    // Note: Function to Edit any User
    const handleEditUser = (userId: string) => {
        route.push(routes.editUser(userId));
    }

    console.log("fetched Data: ", data)

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
    const columns = useMemo<ColumnDef<UserListProps>[]>(
        () => [
            {
                // accessorKey: 'userId',
                header: 'S.No',
                cell: ({ row }) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {row.index + skipRecord + 1}
                    </Text>
                ),
                size: calculateColumnWidth('S.No', ['99999'], 80, 120), // Assuming max 999 records
            },
            {
                accessorKey: 'userName',
                header: 'Username',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Username', data.map(item => item.userName), 150, 400),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Email', data.map(item => item.email), 180, 450),
            },
            {
                accessorKey: 'department',
                header: 'Department',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Department', data.map(item => item.department), 120, 200),
            },
            {
                accessorKey: 'phone',
                header: 'Phone',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Phone', data.map(item => item.phone), 120, 180),
            },
            {
                accessorKey: 'role',
                header: 'Role',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Role', data.map(item => item.role), 100, 150),
            },
            {
                accessorKey: 'isActive',
                header: 'Status',
                cell: ({ getValue }) => {
                    const isActive = getValue() as boolean === true;

                    return (
                        <Badge
                            leftSection={<IconPointFilled size={18} />}
                            variant='light'
                            size='lg'
                            color={isActive ? customStyles.colors.green : customStyles.colors._909090}
                            styles={{
                                root: {
                                    minWidth: 'fit-content',
                                    width: 'max-content',
                                },
                                label: {
                                    textTransform: 'capitalize',
                                    fontWeight: '500',
                                    fontSize: '1rem',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        >
                            {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    )
                },
                filterFn: (row, columnId, value) => {
                    if (!value) return true;
                    const isActive = row.getValue(columnId) as boolean;
                    const displayText = isActive ? 'Active' : 'Inactive';
                    return displayText.toLowerCase().includes(value.toLowerCase());
                },
                size: calculateColumnWidth('Status', ['Active', 'Inactive'], 130, 160),
            },
            {
                // accessorKey: 'userId',
                header: 'Action',
                cell: ({ getValue }) => {
                    const userId = getValue() as string;
                    return (
                        <ActionIcon
                            variant="light"
                            size="lg"
                            c={customStyles.colors._1B59F8}
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={() => handleEditUser(userId)}
                        >
                            <IconEdit />
                        </ActionIcon>
                    )
                },
                size: calculateColumnWidth('Action', ['Edit'], 100, 120)
            }
        ],
        [data] // Add data as dependency to recalculate when data changes
    );

    // Custom global filter function to handle Status column properly
    const globalFilterFn = (row: any, columnId: string, value: string) => {
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
        if (columnId === 'serialNumber') {
            const serialNumber = row.index + skipRecord + 1;
            return String(serialNumber).includes(value);
        }

        // Handle other columns (convert to string and search)
        if (cellValue != null) {
            return String(cellValue).toLowerCase().includes(searchValue);
        }

        return false;
    };

    const table = useReactTable({
        data: data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Keep client-side filtering and sorting since API doesn't support them yet
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        globalFilterFn: (row, columnId, value) => {
            // Get all column IDs to search across
            const columnIds = ['serialNumber', 'userName', 'email', 'department', 'phone', 'role', 'isActive'];

            // Search across all columns
            return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        },
        // Remove getPaginationRowModel for server-side pagination
        onPaginationChange: setPagination,
        manualPagination: true, // Enable server-side pagination
        pageCount: Math.ceil(totalCount / pagination.pageSize), // Calculate total pages from server data
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
        if (authenticatedUser) {
            setIsLoading(true);

            dispatch(fetchAllUsers({
                authToken: authenticatedUser?.token,
                LastCount: lastCount,
                skipRecord: skipRecord
            })).finally(() => {
                setIsLoading(false);
            });
        };
    }, [lastCount, skipRecord, authenticatedUser, dispatch]);

    // Additional effect to handle pagination state changes
    useEffect(() => {
        // This will trigger the above effect when pagination changes
        // The dependency on pagination state will automatically trigger API calls
    }, [pagination]);

    return (
        <Box p={8}>
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>User List</Title>
                    <Text c={customStyles.colors._909090}>List of users</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                >
                    Add Users
                </Button>
            </Group>
            <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                {/* Header */}
                <Group justify="end" align="center" style={{ flexShrink: 0 }}>
                    {/* <Group gap="xs">
                        <Title order={4} c={customStyles.colors._4D4D4D}>
                            Quantity Difference
                        </Title>
                    </Group> */}
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
                    h={700}
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
                                                        <IconArrowsUpDown size={16} />
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
                            Showing {skipRecord + 1} to {Math.min(skipRecord + pagination.pageSize, totalCount)} of {totalCount} entries
                        </Text>
                    </Group>
                </Group>
            </Box>
        </Box >
    )
}

export default UserListComponent