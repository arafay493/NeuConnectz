'use client';

import { customStyles } from '@/styles/custom-theme';
import { UserListProps } from '@/types/redux-types';
import { ActionIcon, Box, Button, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowsUpDown, IconBorderCorners, IconColumns, IconFilter, IconSearch, IconUserPlus } from '@tabler/icons-react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { FC, useMemo, useState } from 'react';
import { GlobalSearchFilter } from '../table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '../table-filters/TableColumnsFilter';

interface UserListComponentProps {
    // data: Array<UserListProps>;
}

const UserListComponent: FC<UserListComponentProps> = ({
    // data
}) => {
    // const [data] = useState(() => generateQuantityDifferenceData());
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

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

    const data: Array<UserListProps> = useMemo(() => {
        return [
            {
                userId: '1',
                userName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
                department: 'Engineering',
                role: 'Developer',
                createdBy: 'admin',
                updatedBy: 'admin',
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString(),
                isActive: true
            },
            {
                userId: '2',
                userName: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '987-654-3210',
                department: 'Marketing',
                role: 'Manager',
                createdBy: 'admin',
                updatedBy: 'admin',
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString(),
                isActive: true
            }
        ];
    }, []);

    // Note: Column definitions for the table
    const columns = useMemo<ColumnDef<UserListProps>[]>(
        () => [
            {
                // accessorKey: 'userId',
                header: 'S.No',
                cell: ({ row }) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {row.index + 1}
                    </Text>
                ),
                size: calculateColumnWidth('S.No', ['999'], 80, 120), // Assuming max 999 records
            },
            {
                accessorKey: 'userName',
                header: 'Username',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Username', data.map(item => item.userName), 150, 300),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
                size: calculateColumnWidth('Email', data.map(item => item.email), 180, 350),
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
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as boolean === true ? 'Active' : 'Inactive'}
                    </Text>
                ),
                size: calculateColumnWidth('Status', ['Active', 'Inactive'], 100, 130),
            }
        ],
        [data] // Add data as dependency to recalculate when data changes
    );



    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
    });

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
                            columnFilters={globalFilter}
                            setColumnFilters={setGlobalFilter}
                            isSearchInputVisible={isSearchInputVisible}
                        />
                        <IconSearch cursor="pointer" size={24} onClick={handleSearchInputVisibility} />
                        <IconFilter cursor="pointer" size={24} onClick={handleTableFiltersVisibility} />
                        <IconColumns cursor="pointer" size={24} />
                        <IconBorderCorners cursor="pointer" size={24} />
                    </Group>
                </Group>

                {/* Table */}
                <Box style={{
                    width: '100%',
                    borderRadius: '8px',
                    minHeight: '600px',
                    maxHeight: '600px',
                    overflow: 'auto',
                    border: `1px solid ${customStyles.colors.tableRowBorderColor}`,
                    backgroundColor: 'white'
                }}>
                    {/* Sticky Header */}
                    <Box style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        backgroundColor: customStyles.colors.white,
                        borderBottom: `2px solid ${customStyles.colors.tableRowBorderColor}`
                    }}>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Grid key={headerGroup.id} gutter="sm" style={{
                                width: 'max-content',
                                minWidth: '100%'
                            }}>
                                {headerGroup.headers.map((header, index) => (
                                    <Box
                                        key={header.id}
                                        style={{
                                            minWidth: `${header.getSize()}px`,
                                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                            padding: '16px 12px',
                                            borderRight: index < headerGroup.headers.length - 1 ? `1px solid ${customStyles.colors.tableRowBorderColor}` : 'none',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                    >
                                        <Group gap="xs" wrap="nowrap" onClick={header.column.getToggleSortingHandler()}>
                                            <Text
                                                size="md"
                                                c={customStyles.colors._4D4D4D}
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    cursor: 'pointer',
                                                }}
                                                fw={600}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
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
                                            )}
                                    </Box>
                                ))}
                            </Grid>
                        ))}
                    </Box>

                    {/* Scrollable Body */}
                    {
                        data.length === 0 ? (
                            <Group justify='center' h={100} p={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                                <Text c={customStyles.colors._909090} size="lg">No data available</Text>
                            </Group>
                        ) : (
                            <Box
                                style={{
                                    minWidth: '100%',
                                    maxHeight: '600px',
                                    overflowY: 'auto',
                                    backgroundColor: 'white'
                                }}>
                                {table.getRowModel().rows.map((row, rowIndex) => (
                                    <Grid key={row.id} gutter="sm" style={{
                                        width: 'max-content',
                                        minWidth: '100%',
                                        backgroundColor: rowIndex % 2 === 0 ? 'white' : customStyles.colors.evenTableColor,
                                        borderBottom: `1px solid ${customStyles.colors.tableRowBorderColor}`,
                                        minHeight: '48px',
                                        transition: 'background-color 0.2s ease',
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f0f7ff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? 'white' : customStyles.colors.evenTableColor;
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell, cellIndex) => (
                                            <Box
                                                key={cell.id}
                                                style={{
                                                    minWidth: `${cell.column.getSize()}px`,
                                                    padding: '16px 12px',
                                                    borderRight: cellIndex < row.getVisibleCells().length - 1 ? `1px solid ${customStyles.colors.tableRowBorderColor}` : 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: ['action'].includes(cell.column.id) ? 'center' : 'flex-start',
                                                    height: '48px'
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Box>
                                        ))}
                                    </Grid>
                                ))}
                            </Box>
                        )}
                </Box>
            </Stack>
        </Box>
    )
}

export default UserListComponent