'use client';

import { useMemo, memo } from "react";
import {
    Badge,
    Box,
    Group,
    Stack,
    Text,
    Title
} from "@mantine/core";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

interface DispatchOrder {
    orderNo: string;
    customer: string;
    pallets: number;
    status: string;
    eta: string;
    notes: string;
}

const data: DispatchOrder[] = [
    {
        orderNo: "PO-001234",
        customer: "Global Foods Inc.",
        pallets: 15,
        status: "In Transit",
        eta: "2025-06-20 18:00",
        notes: "Driver ETA Confirmed",
    },
    {
        orderNo: "PO-001233",
        customer: "Local Grocers",
        pallets: 8,
        status: "Delayed",
        eta: "2025-06-19 17:00",
        notes: "POD Signed",
    },
    {
        orderNo: "PO-001232",
        customer: "Mega Mart Corp.",
        pallets: 25,
        status: "Delivered",
        eta: "2025-06-18 16:00",
        notes: "Vehicle breakdown",
    },
    {
        orderNo: "PO-001231",
        customer: "Corner Stores Ltd.",
        pallets: 5,
        status: "Loading",
        eta: "2025-06-19 15:00",
        notes: "Waiting for Truck",
    },
];

const DashboardDispatchedOrdersTable = () => {

    const columns = useMemo<ColumnDef<DispatchOrder>[]>(
        () => [
            {
                accessorKey: "orderNo",
                header: "Order No",
                cell: ({ getValue }) => (
                    <Text fw={500}>{getValue() as string}</Text>
                ),
            },
            {
                accessorKey: "customer",
                header: "Customer",
                cell: ({ getValue }) => (
                    <Text fw={500}>{getValue() as string}</Text>
                ),
            },
            {
                accessorKey: "pallets",
                header: "Pallets",
                cell: ({ getValue }) => (
                    <Text fw={500}>{getValue() as number}</Text>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ getValue }) => {

                    const status = getValue() as string;

                    const colorMap: Record<string, string> = {
                        "In Transit": "yellow",
                        "Delayed": "red",
                        "Delivered": "green",
                        "Loading": "blue",
                    };

                    return (
                        <Badge
                            radius="xl"
                            size="lg"
                            variant="light"
                            color={colorMap[status] || "gray"}
                        >
                            {status}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "eta",
                header: "ETA",
                cell: ({ getValue }) => (
                    <Text fw={500}>{getValue() as string}</Text>
                ),
            },
            {
                accessorKey: "notes",
                header: "Notes",
                cell: ({ getValue }) => (
                    <Text fw={500} c="dimmed">
                        {getValue() as string}
                    </Text>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Stack
            p={24}
            bg="white"
            style={{
                borderRadius: "16px",
                width: "100%",
                margin: "15px 0px",
            }}
        >
            <Title order={4} style={{ color: "#4D4D4D", borderBottom: "0.2px solid lightgray", paddingBottom: '2px' }}>Running Dispatched Orders</Title>

            <Box
                style={{
                    overflowX: "auto",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        color: "#4D4D4D",
                    }}
                >
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                            borderBottom: "1px solid #E5E5E5",
                                        }}
                                    >
                                        <Text fw={600}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </Text>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                style={{ borderBottom: "1px solid #F0F0F0" }}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        style={{ padding: "14px 12px" }}
                                    >
                                        {
                                            flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Stack>
    );
};

export default memo(DashboardDispatchedOrdersTable);