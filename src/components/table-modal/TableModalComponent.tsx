// Note: Table modal component...!

"use client";

import React, { memo, FC, useMemo, useState, useEffect } from "react";
import NextImage from 'next/image';
import { Modal, Table, Text, Group, Divider, ScrollArea, Box, ActionIcon, SimpleGrid, Stack, Title, Image, Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    PaginationState,
    SortingState,
    useReactTable
} from '@tanstack/react-table';
import { useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { localAssets } from "@/lib/file-paths/file-paths";
import { IconArrowNarrowDown, IconChevronLeft, IconChevronDown, IconChevronRight, IconArrowNarrowUp, IconArrowsUpDown, IconBorderCorners, IconColumns, IconFilter, IconFilterOff, IconSearch, IconSearchOff } from '@tabler/icons-react';

interface ProductionOrderLinesDataType {
    documentAbsoluteEntry: number,
    lineNumber: number,
    itemNo: string,
    productDescription: string,
    productionOrderIssueType: string,
    warehouse: string,
    remainingQuantity: number,
    baseQuantity: number,
    plannedQuantity: number,
    issuedQuantity: number,
    stageID: number,
    stageName: string,
    uomName: string,
}

interface RowDataType {
    absoluteEntry: number,
    documentNumber: number,
    itemNo: string,
    originNo: number,
    plannedDate: string,
    productDescription: string,
    productionOrderStatus: string,
    project: string,
    quantity: number,
    remainingQuantity: number,
    uom: string,
    warehouse: string
}

type TableModalProp = {
    open: boolean,
    onClose: () => void,
    rowData: RowDataType
};

// Sub-component for displaying a label-value pair...!
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Group gap="xs">
            <Text fw={500} size="sm" c="dark.6">
                {label}:
            </Text>
            <Text size="sm" c="dimmed">
                {value}
            </Text>
        </Group>
    );
}

const TableModal: FC<TableModalProp> = ({ open, onClose, rowData }) => {
    // console.log("Table modal props: ", rowData);

    // Note: Handling states here...!
    const [isLoading, setIsLoading] = useState(false);

    const { listOfProductionOrderLines, productionOrderLinesCount } = useAppSelector(({ sapStates }) => { return sapStates });
    // console.log("listOfProductionOrderLines: ", listOfProductionOrderLines);

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
    const columns = useMemo<ColumnDef<ProductionOrderLinesDataType>[]>(
        () => [
            {
                accessorKey: 'itemNo',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
                size: calculateColumnWidth('Item Code', (listOfProductionOrderLines || []).map(item => item.itemNo), 150, 220),
            },
            {
                accessorKey: 'productDescription',
                header: 'Item Description',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
                size: calculateColumnWidth('Item Description', (listOfProductionOrderLines || []).map(item => item?.productDescription), 150, 220),
            },
            {
                accessorKey: 'baseQuantity',
                header: 'Base Qty',
                cell: ({ getValue, row }) => {
                    const val = row.original.uom != null ? row.original.uom : 'N/A';
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {val as string}
                        </Text>
                    )
                },
                enableColumnFilter: true,
                size: calculateColumnWidth('Base Qty', (listOfProductionOrderLines || []).map(item => String(item.baseQuantity)), 150, 220),
            },
            {
                accessorKey: 'plannedQuantity',
                header: 'Plan Qty',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
                size: calculateColumnWidth('Planned Qty', (listOfProductionOrderLines || []).map(item => String(item.plannedQuantity)), 120, 150),
            },
            {
                accessorKey: 'issuedQuantity',
                header: 'Issued',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
                size: calculateColumnWidth('Issued', (listOfProductionOrderLines || []).map(item => String(item.issuedQuantity)), 150, 220),
            },
            {
                accessorKey: 'uomName',
                header: 'UOM Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
                size: calculateColumnWidth('UOM Name', (listOfProductionOrderLines || []).map(item => item.uomName), 150, 220),
            },
            {
                accessorKey: 'warehouse',
                header: 'Warehpouse',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
                size: calculateColumnWidth('Warehpouse', (listOfProductionOrderLines || []).map(item => item?.warehouse), 150, 220),
            }
        ],
        [listOfProductionOrderLines]
    );

    // Note: Table columns...!
    const table = useReactTable({
        data: listOfProductionOrderLines || [], // Handle undefined/null case
        columns,
        getCoreRowModel: getCoreRowModel(),
        // onSortingChange: setSorting,
        // onGlobalFilterChange: (value) => {
        //     setGlobalFilter(value);
        //     // Reset to first page when global filter changes
        //     setPagination(prev => ({ ...prev, pageIndex: 0 }));
        // },
        // onColumnFiltersChange: (filters) => {
        //     setColumnFilters(filters);
        //     // Reset to first page when column filters change
        //     setPagination(prev => ({ ...prev, pageIndex: 0 }));
        // },
        // globalFilterFn: (row, columnId, value) => {
        //     // Handle S.No column separately for global search
        //     if (row.index + 1 && String(row.index + 1).includes(value)) {
        //         return true;
        //     }

        //     const columnIds = ['serialNumber', 'documentNumber', 'itemNo', 'productDescription', 'uom', 'quantity', 'remainingQuantity', 'plannedDate', 'originNo', 'warehouse', 'productionOrderStatus'];
        //     return columnIds.some((colId: string) => globalFilterFn(row, colId, value));
        // },
        // onPaginationChange: setPagination,
        // manualPagination: true, // Enable server-side pagination
        // pageCount: Math.ceil(productionOrdersCount / pagination.pageSize), // Calculate total pages from server data
        // state: {
        //     sorting,
        //     globalFilter,
        //     columnFilters,
        //     pagination,
        // },
    });

    useEffect(() => {
        setIsLoading(true);
        if (listOfProductionOrderLines?.length > 0) {
            setIsLoading(false);
        };
    }, [listOfProductionOrderLines]);

    return (
        <>
            <Modal
                opened={open}
                onClose={onClose}
                centered
                size="75%"
                radius="md"
                withCloseButton={false}
                overlayProps={{ blur: 3 }}
                styles={{
                    content: {
                        // height: "60vh", // make modal 80% of viewport height
                    },
                }}
            >
                {/* Header with close button */}
                <Group justify="space-between" align="flex-start">
                    <Text fw={600} size="md">Preview</Text>
                    <ActionIcon onClick={onClose} variant="subtle" color="red" size="lg">
                        <IconX />
                    </ActionIcon>
                </Group>

                <Divider my="sm" />

                {/* Document details */}
                <Box mb="md">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" verticalSpacing="sm">
                        <InfoRow label="Document No" value={String(rowData?.documentNumber)} />
                        <InfoRow label="Item Code" value={rowData?.itemNo} />
                        <InfoRow label="Item Description" value={rowData?.productDescription.length < 20 ? rowData?.productDescription : rowData?.productDescription?.slice(0, 20)} />
                        <InfoRow label="UOM" value={rowData?.uom} />
                        <InfoRow label="Quantity" value={String(rowData?.quantity)} />
                        <InfoRow label="Remaining Qty" value={String(rowData?.remainingQuantity)} />
                        <InfoRow label="Planned Date" value={new Date(rowData?.plannedDate as string).toLocaleDateString()} />
                        <InfoRow label="Origin No" value={String(rowData?.originNo)} />
                        <InfoRow label="Warehouse" value={rowData?.warehouse} />
                    </SimpleGrid>
                </Box>

                <Divider my="sm" />

                {/* Table Section */}
                <Box
                    w="100%"
                    mah={700}
                    mt={'5%'}
                // className={classes.scrollOnHover}
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
                                                {/* {header.column.getCanSort() && (
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
                                                )} */}
                                            </Group>

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
                                Array.from({ length: 5 }).map((_, index) => (
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
                                            <Image w={180} h={180} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
                                            <Title order={4} c={customStyles.colors._4D4D4D}>No Data Found</Title>
                                        </Stack>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Box>

                <Box
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        paddingTop: '2%',
                    }}
                >
                    <Button
                        variant="transparent"
                        className={'filledButton'}
                        radius={8}
                        size="md"
                        w={300}
                    // onClick={viewStockMovementData}
                    >
                        Close Production Order
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default memo(TableModal);