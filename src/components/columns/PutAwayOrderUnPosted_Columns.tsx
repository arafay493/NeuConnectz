import { customStyles } from '@/styles/custom-theme';
import { Button, Chip, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleDotFilled, IconCircleFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const PutAwayOrderUnPosted_Columns = ({ pagination, list, actions }: any) => {
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
                accessorKey: "documentNumber",
                header: "Document Number",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "materialCode",
                header: "Material Code",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "materialName",
                header: "Material Name",
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "uom",
                header: "UOM",
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "quantity",
                header: "Quantity",
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "movementType",
                header: "Movement Type",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "purchaseOrder",
                header: "Purchase Order",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "suppliers",
                header: "Suppliers",
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "reservationNumber",
                header: "Reservation Number",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "inboundDeliveryNumber",
                header: "Inbound Delivery #",
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "sourceBin",
                header: "Source Bin",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "status",
                header: "Status",
                minSize: 140,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} px={20} py={5} bg={customStyles.colors.evenTableColor} style={{ borderRadius: 20, textAlign: "center" }}>
                        <IconCircleFilled size={10} />
                        {" " + String(getValue() ?? "-")}
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
                        ? dayjs(rawDate).format("DD/MM/YYYY")
                        : "-";
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
                minSize: 150,
                cell: ({ row }: any) => (
                    <Group
                        gap="xs"
                        justify="center"
                        style={{
                            flexWrap: "nowrap",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="transparent"
                            className="outlineButton"
                            radius={8}
                            onClick={() =>
                                actions.handleViewDetailsModalOpen(row.original)
                            }
                        >
                            View Details
                        </Button>
                        <Button
                            variant="transparent"
                            className="filledButton"
                            radius={8}
                            onClick={() =>
                                actions.handleConfirmModalOpen(row.original)
                            }
                        >
                            Confirm
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

export default PutAwayOrderUnPosted_Columns;

