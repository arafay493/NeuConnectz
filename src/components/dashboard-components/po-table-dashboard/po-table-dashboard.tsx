// Note: This is the production order table component used in the dashboard to display a list of production orders with their details.

'use client';

import { useMemo, useState, useEffect, memo } from "react";
import NextImage from 'next/image';
import { localAssets } from "@/lib/file-paths/file-paths";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { ListProductionOrder } from "@/types/redux-types";
import { Badge, Box, Group, Image, Stack, Text, Title } from "@mantine/core";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { listProductionOrder } from "@/redux/actions/production-order-actions/production-order-actions";

const ProductionOrderTableComponent = () => {

    const dispatch = useAppDispatch();
    const { data } = useAppSelector(({ productionOrderStates }) => productionOrderStates);

    const [isLoading, setIsLoading] = useState(false);

    // Note: Column definitions for the table
    const columns = useMemo<ColumnDef<ListProductionOrder>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Production ID',
                cell: ({ getValue, row }) => {
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {row?.original?.id?.slice(0, 5) as string}
                        </Text>
                    )
                },
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'itemName',
                header: 'Item Name',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'unitOfMeasurement',
                header: 'UOM',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'productionLine',
                header: 'Production Line',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'warehouse',
                header: 'Warehouse',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'qty',
                header: 'Quantity',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'actualQty',
                header: 'Actual Qty',
                cell: ({ getValue }) => (
                    <Text c={customStyles.colors._909090} fw={500} >
                        {getValue() as string}
                    </Text>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ getValue }) => {
                    const status = getValue() as string === 'open';

                    return (
                        <Badge
                            variant="light"
                            size="xl"
                            color={status ? customStyles.colors.green : customStyles.colors._1B59F8}
                            styles={{
                                root: {
                                    width: 120,
                                    display: "flex",
                                    justifyContent: "center",
                                },
                                label: {
                                    textTransform: customStyles.textTransformation.capitalize,
                                    fontWeight: "500",
                                    fontSize: "1rem",
                                    whiteSpace: "nowrap",
                                },
                            }}
                        >
                            {getValue() as string}
                        </Badge>
                    )
                }
            }
        ],
        [data]
    );

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        dispatch(listProductionOrder({ lastCount: 5, skipRecord: 0 }));
    }, []);

    return (
        <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>

            {/* Title */}
            <Title
                order={4}
                style={{
                    color: customStyles.colors._4D4D4D, borderBottom: "0.2px solid lightgray",
                    paddingBottom: customStyles.size.size_2
                }}
            >
                Production Orders
            </Title>

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
                        {table.getHeaderGroups().map(headerGroup =>
                        (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} style={{
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        padding: '0 12px 24px 12px',
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
                                        </Group>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {isLoading ? (null) : table.getRowModel().rows.length > 0 ? (
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
                                    textAlign: customStyles.alignment.center,
                                    padding: '32px 16px',
                                    borderBottom: 'none'
                                }}>
                                    <Stack
                                        justify={customStyles.alignment.center}
                                        align={customStyles.alignment.center}
                                    >
                                        <Image w={180} h={180} radius={16} component={NextImage} src={localAssets.dataNotFound} alt='not-found' />
                                        <Title
                                            order={4}
                                            c={customStyles.colors._4D4D4D}
                                        >
                                            No Data Found
                                        </Title>
                                    </Stack>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>
        </Stack>
    );
};

export default memo(ProductionOrderTableComponent);