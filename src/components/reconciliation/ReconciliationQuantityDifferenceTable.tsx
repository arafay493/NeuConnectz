'use client';

import { GlobalSearchFilter } from '@/components/table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '@/components/table-filters/TableColumnsFilter';
import { customStyles } from '@/styles/custom-theme';
import { QuantityDifferenceData } from '@/types/redux-types';
import { ActionIcon, Box, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowsUpDown, IconBorderCorners, IconColumns, IconFilter, IconSearch } from '@tabler/icons-react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { FC, useMemo, useState } from 'react';

interface ReconciliationQuantityDifferenceTableProps {
    data: QuantityDifferenceData[]
}

const ReconciliationQuantityDifferenceTable: FC<ReconciliationQuantityDifferenceTableProps> = ({
    data
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

    // Note: Column definitions for the table
    const columns = useMemo<ColumnDef<QuantityDifferenceData>[]>(
        () => [
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {getValue() as string}
                    </Text>
                ),
                size: 120,
            },
            {
                accessorKey: 'itemName',
                header: 'Item Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                size: 250, // Increased from 150 to 250
            },
            {
                accessorKey: 'totalITQuantity',
                header: 'Total IT Quantity',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as number}
                    </Text>
                ),
                size: 120, // Increased from 100 to 120
            },
            {
                accessorKey: 'totalTRQuantity',
                header: 'Total TR Quantity',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as number}
                    </Text>
                ),
                size: 120, // Increased from 100 to 120
            },
            {
                accessorKey: 'quantityDifference',
                header: 'Quantity Difference',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as number}
                    </Text>
                ),
                size: 120, // Increased from 100 to 120
            },
            {
                accessorKey: 'action',
                header: 'Actions',
                cell: ({ getValue }) => (
                    <Box
                        style={{
                            background: '#E8F5E8',
                            color: '#2D8F3F',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'inline-block',
                            cursor: 'pointer',
                            border: '1px solid #A8D5A8',

                        }}
                    >
                        {getValue() as string}
                    </Box>
                ),
                size: 100,
                enableSorting: false,
            }

        ],
        []
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
        <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
            {/* Header */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0 }}>
                <Group gap="xs">
                    <Title order={4} c={customStyles.colors._4D4D4D}>
                        Quantity Difference
                    </Title>
                </Group>
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
                overflow: 'auto'
            }}>
                {/* Sticky Header */}
                <Box style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                }}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Group key={headerGroup.id} gap={0} style={{
                            width: 'max-content',
                            minWidth: '100%'
                        }}>
                            {headerGroup.headers.map(header => (
                                <Box
                                    key={header.id}
                                    style={{
                                        flex: '1',
                                        minWidth: `${header.getSize()}px`,
                                        cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                        padding: '16px 0px',
                                    }}
                                >
                                    <Group gap="xs" wrap="nowrap" onClick={header.column.getToggleSortingHandler()}>
                                        <Text
                                            size="md"
                                            c={customStyles.colors._4D4D4D}
                                            style={{
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer',
                                                width: ['action'].includes(header.column.id) ? '100%' : 'auto',
                                                padding: '4px 10px',
                                            }}
                                            ta={['action'].includes(header.column.id) ? 'center' : 'left'}
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
                        </Group>
                    ))}
                </Box>

                {/* Scrollable Body - Limited to 6 rows height */}
                {
                    data.length === 0 ? (
                        <Group justify='center' h={100} p={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
                            <Text c={customStyles.colors._909090} size="lg">No data available</Text>
                        </Group>
                    ) : (
                        <Stack
                            gap={4}
                            style={{
                                width: '100%',
                                minWidth: '100%',
                                maxHeight: '360px',
                                overflowY: 'auto',
                                backgroundColor: 'white'
                            }}>
                            {table.getRowModel().rows.map((row, index) => (
                                <Group key={row.id} gap={0} style={{
                                    width: 'max-content',
                                    minWidth: '100%',
                                    backgroundColor: index % 2 === 0 ? 'white' : customStyles.colors.evenTableColor,
                                    border: `1px solid ${customStyles.colors.tableRowBorderColor}`,
                                    borderRadius: '4px',
                                    minHeight: '40px',
                                    transition: 'background-color 0.2s ease',
                                }}>
                                    {row.getVisibleCells().map(cell => (
                                        <Box
                                            key={cell.id}
                                            style={{
                                                flex: '1',
                                                // minWidth: `${cell.column.getSize()}px`,
                                                // padding: '4px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: ['action'].includes(cell.column.id) ? 'center' : 'flex-start',
                                            }}
                                        >
                                            <Text
                                                size="md"
                                                c={customStyles.colors._4D4D4D}
                                                style={{
                                                    cursor: 'pointer',
                                                    width: ['action'].includes(cell.column.id) ? '100%' : '100%',
                                                    padding: '4px 10px',
                                                }}
                                                ta={['action'].includes(cell.column.id) ? 'center' : 'left'}
                                                fw={600}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Text>
                                        </Box>
                                    ))}
                                </Group>
                            ))}
                        </Stack>
                    )}
            </Box>
        </Stack>
    )
}

export default ReconciliationQuantityDifferenceTable