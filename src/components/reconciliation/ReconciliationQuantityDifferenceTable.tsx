'use client';

import React, { FC, useMemo, useState } from 'react';
import { GlobalSearchFilter } from '@/components/table-filters/GlobalSearchFilter';
import { TableColumnsFilter } from '@/components/table-filters/TableColumnsFilter';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';
import { QuantityDifferenceData } from '@/types/redux-types';
import { ActionIcon, Box, Button, Group, Image, Stack, Text, Title } from '@mantine/core';
import { IconArrowsUpDown, IconBorderCorners, IconColumns, IconFilter, IconSearch } from '@tabler/icons-react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import NextImage from 'next/image';

interface ReconciliationQuantityDifferenceTableProps {
    data: QuantityDifferenceData[]
}

const ReconciliationQuantityDifferenceTable = ({
    data,
    handleQuantityDifferenceViewModalOpened
}: any) => {
    // const [data] = useState(() => generateQuantityDifferenceData());
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false)

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

    // Note: Column definitions for the table
    const columns = useMemo<ColumnDef<QuantityDifferenceData>[]>(
        () => [
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {getValue() as string || "-"}
                    </Text>
                ),
                size: calculateColumnWidth("Item Code", data.map((item: any) => item.itemCode), 160, 200),
            },
            {
                accessorKey: 'itemName',
                header: 'Item Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string || "-"}
                    </Text>
                ),
                size: calculateColumnWidth("Item Name", data.map((item: any) => item.itemName), 200, 250),
            },
            {
                accessorKey: 'itsQuantity',
                header: 'Total IT Quantity',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as number || "-"}
                    </Text>
                ),
                size: calculateColumnWidth("Total IT Quantity", data.map((item: any) => String(item.totalITQuantity)), 200, 220),
            },
            {
                accessorKey: 'trsQuantity',
                header: 'Total TR Quantity',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as number || "-"}
                    </Text>
                ),
                size: calculateColumnWidth("Total TR Quantity", data.map((item: any) => String(item.totalTRQuantity)), 200, 220),
            },
            {
                // accessorKey: 'quantityDifference',
                header: 'Quantity Difference',
                cell: ({ row }: any) => {
                    const its = row.original.itsQuantity ?? 0;
                    const trs = row.original.trsQuantity ?? 0;
                    const diff = its - trs;
                    return (
                        <Text c={customStyles.colors._909090} fw={500} >
                            {diff as number || "-"}
                        </Text >
                    )
                },
                size: calculateColumnWidth("Quantity Difference", data.map((item: any) => String(item.quantityDifference)), 200, 220),
            },
            {
                accessorKey: 'action',
                header: 'Actions',
                cell: ({ getValue }) => (
                    <Button
                        style={{
                            background: '#E8F5E8',
                            color: '#2D8F3F',
                            padding: '4px 24px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'inline-block',
                            cursor: 'pointer',
                            border: '1px solid #A8D5A8',

                        }}
                        onClick={handleQuantityDifferenceViewModalOpened}
                    >
                        {/* {getValue() as string} */}
                        View
                    </Button>
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
                        filters={globalFilter}
                        handleGlobalSearch={() => { }}
                        isSearchInputVisible={isSearchInputVisible}
                    />
                    <IconSearch cursor="pointer" size={24} onClick={handleSearchInputVisibility} />
                    <IconFilter cursor="pointer" size={24} onClick={handleTableFiltersVisibility} />
                    <IconColumns cursor="pointer" size={24} />
                    <IconBorderCorners cursor="pointer" size={24} />
                </Group>
            </Group>

            {/* Table */}
            <Box
                w="100%"
                // h={700}
                style={{
                    overflowX: 'auto',
                    overflowY: 'auto',
                }}
            >
                <table style={{
                    width: '100%',
                    borderCollapse: 'separate',
                    borderSpacing: '0',
                    minWidth: 'max-content'
                }}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} style={{
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        padding: '16px',
                                        // borderBottom: `1px solid ${customStyles.colors._E1E7EC || '#E5E5E5'}`,
                                        width: `${header.getSize()}px`,
                                        minWidth: `${header.getSize()}px`,
                                        maxWidth: 'max-content',
                                        verticalAlign: 'top',
                                    }}>
                                        <Group
                                            wrap="nowrap"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <Text style={{ whiteSpace: 'nowrap' }} fw={600} c={customStyles.colors._4D4D4D}>
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
                            Array.from({ length: data.length }).map((_, index) => (
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
                            table.getRowModel().rows.map((row, index) => (
                                <React.Fragment key={row.id}>
                                    <tr style={{
                                        border: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                        borderRadius: '8px',
                                    }}>
                                        {row.getVisibleCells().map((cell, cellIndex) => (
                                            <td key={cell.id} style={{
                                                textAlign: 'left',
                                                padding: '8px 12px',
                                                width: `${cell.column.getSize()}px`,
                                                minWidth: `${cell.column.getSize()}px`,
                                                maxWidth: cell.column.id === 'isActive' ? 'fit-content' : 'max-content',
                                                overflow: cell.column.id === 'isActive' ? 'visible' : 'hidden',
                                                textOverflow: cell.column.id === 'isActive' ? 'initial' : 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                verticalAlign: 'middle',
                                                border: `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}`,
                                                borderLeft: cellIndex === 0 ? `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}` : 'none',
                                                borderRight: cellIndex === row.getVisibleCells().length - 1 ? `1px solid ${customStyles.colors._E1E7EC || '#F0F0F0'}` : 'none',
                                                borderTopLeftRadius: cellIndex === 0 ? '8px' : '0',
                                                borderBottomLeftRadius: cellIndex === 0 ? '8px' : '0',
                                                borderTopRightRadius: cellIndex === row.getVisibleCells().length - 1 ? '8px' : '0',
                                                borderBottomRightRadius: cellIndex === row.getVisibleCells().length - 1 ? '8px' : '0',
                                            }}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                    {/* Add spacing row between data rows, but not after the last row */}
                                    {index < table.getRowModel().rows.length - 1 && (
                                        <tr style={{ height: '6px' }}>
                                            <td colSpan={columns.length} style={{
                                                padding: 0,
                                                border: 'none',
                                                backgroundColor: 'transparent'
                                            }}></td>
                                        </tr>
                                    )}
                                </React.Fragment>
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
    )
}

export default ReconciliationQuantityDifferenceTable