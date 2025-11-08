import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const StockTransferOrderPosted_Columns = ({ pagination, list, actions }: any) => {
    const columns = useMemo(
        () => [
            {
                id: "serialNumber",
                header: "Serial No",
                minSize: 180,
                maxSize: 180,
                cell: ({ row }: any) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            },
            {
                accessorKey: "type",
                header: "Type",
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "number",
                header: "Number",
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "itemCode",
                header: "Item Code",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "fromPlantCode",
                header: "From Plant Code",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "fromWarehouse",
                header: "From Warehouse",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "fromStorageLocation",
                header: "From Storage Location",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "fromStorageType",
                header: "From Storage Type",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "fromStorageSection",
                header: "From Storage Section",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "fromBin",
                header: "From Bin",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "toPlantCode",
                header: "To Plant Code",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "toWarehouse",
                header: "To Warehouse",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "toStorageLocation",
                header: "To Storage Location",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "toStorageType",
                header: "To Storage Type",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "toStorageSection",
                header: "To Storage Section",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "toBin",
                header: "To Bin",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "username",
                header: "Username",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "erpDocEntry",
                header: "ERP Doc Entry",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "erpLineId",
                header: "ERP Line Id",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "date",
                header: "Date",
                minSize: 140,
                cell: ({ getValue }: any) => {
                    const rawDate = getValue();
                    const formatted = rawDate
                        ? dayjs(rawDate).format('DD/MM/YYYY')
                        : '-';
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {formatted}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: any) => (
                    <Group gap="xs" justify="center" style={{
                        flexWrap: "nowrap",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                        <Button
                            variant="transparent"
                            className="outlineButton"
                            radius={8}
                            onClick={() => actions.handleViewDetailsModalOpen(row.original)}
                        >
                            View Details
                        </Button>
                    </Group>
                ),
                enableColumnFilter: false,
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default StockTransferOrderPosted_Columns;
