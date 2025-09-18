'use client';
// Note: Inventory Transfer Table Component using TanStack React Table...!

import { GlobalSearchFilter } from '@/components/table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '@/components/table-filters/TableColumnsFilter';
import { customStyles } from '@/styles/custom-theme';
import { InventoryTransferItems } from '@/types/redux-types';
import {
    ActionIcon,
    Box,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconArrowsUpDown, IconBorderCorners, IconColumns, IconFilter, IconSearch } from '@tabler/icons-react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState
} from '@tanstack/react-table';
import { FC, useMemo, useState } from 'react';

interface InventoryTransferTableProps {
    data: InventoryTransferItems[];
    handleRowClick?: (row: InventoryTransferItems) => void;
    selectedItems?: InventoryTransferItems[];
}

const InventoryTransferTable: FC<InventoryTransferTableProps> = ({ data, handleRowClick, selectedItems = [] }) => {
    // const [data] = useState(() => generateInventoryTransferData());
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Note: State for Input
    const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
    const [areTableFiltersVisible, setAreTableFiltersVisible] = useState(false);

    const handleSearchInputVisibility = () => {
        setIsSearchInputVisible(!isSearchInputVisible);
    };

    const handleTableFiltersVisibility = () => {
        setAreTableFiltersVisible(!areTableFiltersVisible);
    };

    // Note: Column definitions for the table
    const columns = useMemo<ColumnDef<InventoryTransferItems>[]>(
        () => [
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue, }) => {
                    return (
                        <Text fw={500} c={customStyles.colors._909090} style={{ whiteSpace: 'nowrap' }}>
                            {getValue() as string}
                        </Text>
                    );
                },
                size: 150,
            },
            {
                accessorKey: 'itemName',
                header: 'Item Name',
                cell: ({ getValue }) => {
                    return (
                        <Text c={customStyles.colors._909090} fw={500} style={{ whiteSpace: 'nowrap' }}>
                            {getValue() as string}
                        </Text>
                    );
                },
                size: 300,
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
                cell: ({ getValue, }) => {
                    return (
                        <Text c={customStyles.colors._909090} fw={500} style={{ whiteSpace: 'nowrap' }}>
                            {getValue() as number}
                        </Text>
                    );
                },
                size: 120,
            },
        ],
        [selectedItems]
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
        <Stack gap="md">
            {/* Header */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0 }}>
                <Group gap="xs">
                    <Title order={4} c={customStyles.colors._4D4D4D}>
                        Inventory Transfer
                    </Title>
                </Group>
                <Group gap="xs">
                    <GlobalSearchFilter
                        filters={globalFilter}
                        handleGlobalSearch={() => { }}
                        isSearchInputVisible={isSearchInputVisible}
                    />
                    <IconSearch cursor="pointer" onClick={handleSearchInputVisibility} size={24} />
                    <IconFilter cursor="pointer" onClick={handleTableFiltersVisibility} size={24} />
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
                                        width: `${header.getSize()}px`,
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
                                                cursor: 'pointer',
                                                textAlign: ['quantity'].includes(header.column.id) ? 'right' : 'left',
                                                width: ['quantity'].includes(header.column.id) ? '100%' : 'auto',
                                                padding: '4px 10px',
                                                whiteSpace: 'nowrap',
                                            }}
                                            fw={600}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
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
                                        </Text>
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
                                maxHeight: '300px',
                                overflowY: 'auto',
                                backgroundColor: 'white'
                            }}>
                            {table.getRowModel().rows.map((row, index) => {
                                const isSelected = selectedItems.some(item => item.itemCode === row.original.itemCode);
                                return (
                                    <Group key={row.id}
                                        onClick={() => handleRowClick && handleRowClick(row.original)}
                                        style={{
                                            width: 'max-content',
                                            minWidth: '100%',
                                            backgroundColor: isSelected
                                                ? customStyles.colors._1B59F81A
                                                : index % 2 === 0 ? 'white' : customStyles.colors.evenTableColor,
                                            border: `1px solid ${customStyles.colors.tableRowBorderColor}`,
                                            borderRadius: '4px',
                                            minHeight: '40px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease',
                                        }}
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <Box key={cell.id} style={{
                                                width: `${cell.column.getSize()}px`,
                                                minWidth: `${cell.column.getSize()}px`,
                                                padding: '4px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Box>
                                        ))}
                                    </Group>
                                );
                            })}
                        </Stack>
                    )}
            </Box>
        </Stack>
    );
};

export default InventoryTransferTable;
