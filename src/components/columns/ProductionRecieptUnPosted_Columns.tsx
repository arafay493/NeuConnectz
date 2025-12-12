import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import { IconCircleFilled, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const ProductionRecieptUnPosted_Columns = ({ pagination, list, actions }: any) => {
    const columns = useMemo(
        () => [
            // ================= SERIAL NUMBER =================
            {
                id: "serialNumber",
                header: "S.No",
                maxSize: 80,
                cell: ({ row }: any) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090} ta="center">
                            {serialNumber}
                        </Text>
                    );
                },
            },

            // ================= ACTUAL API FIELDS =================

            {
                id: "docNum",
                accessorKey: "docNum",
                header: "Document Number",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "trNumber",
                accessorKey: "trNumber",
                header: "TR Number",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "requirementNumber",
                accessorKey: "requirementNumber",
                header: "Requirement Number",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() || "-"}
                    </Text>
                ),
            },

            {
                id: "materialDocument",
                accessorKey: "materialDocument",
                header: "Material Document",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "plant",
                accessorKey: "plant",
                header: "Plant",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "warehouse",
                accessorKey: "warehouse",
                header: "Warehouse",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "storageLocation",
                accessorKey: "storageLocation",
                header: "Storage Location",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "totalItems",
                accessorKey: "totalItems",
                header: "Total Items",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "totalQuantity",
                accessorKey: "totalQuantity",
                header: "Total Quantity",
                cell: ({ getValue }: any) => (
                    <Text ta="center" fw={500} c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "createdDate",
                accessorKey: "createdDate",
                header: "Created Date",
                cell: ({ getValue }: any) => {
                    const date = getValue();
                    return (
                        <Text ta="center" fw={500} c={customStyles.colors._909090}>
                            {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
                        </Text>
                    );
                },
            },

            // ================= STATUS =================
            {
                id: "status",
                accessorKey: "confirmationStatus",
                header: "Status",
                cell: ({ getValue }: any) =>
                    getValue() !== "UnConfirmed" ? (
                        <Text
                            fw={500}
                            c={customStyles.colors.green}
                            px={20}
                            py={5}
                            bg={customStyles.colors.lightgreen}
                            style={{ borderRadius: 20, textAlign: "center" }}
                        >
                            <IconCircleFilled size={10} /> Confirmed
                        </Text>
                    ) : (
                        <Text
                            fw={500}
                            c={customStyles.colors._909090}
                            px={20}
                            py={5}
                            bg={customStyles.colors.evenTableColor}
                            style={{ borderRadius: 20, textAlign: "center" }}
                        >
                            <IconCircleFilled size={10} /> Unconfirmed
                        </Text>
                    ),
            },

            // ================= ACTIONS =================
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: any) => (
                    <Group gap="xs" justify="center" style={{ flexWrap: "nowrap" }}>
                        <Button
                            variant="transparent"
                            className="outlineButton"
                            radius={8}
                            onClick={() => actions.handleViewDetailsModalOpen(row.original)}
                        >
                            View Details
                        </Button>

                        {row.original?.confirmationStatus !== "Confirmed" ? (
                            <Button
                                variant="transparent"
                                className="filledButton"
                                radius={8}
                                miw={121}
                                onClick={() => actions.handleConfirmModalOpen(row.original)}
                            >
                                Confirm
                            </Button>
                        ) : (
                            <Button
                                variant="transparent"
                                className="filledButton"
                                radius={8}
                                miw={121}
                                onClick={() => actions.handlePost(row.original)}
                            >
                                Post
                            </Button>
                        )}

                        <Button
                            variant="filled"
                            color={customStyles.colors.red}
                            leftSection={<IconTrash size={18} />}
                            radius={8}
                            miw={121}
                            onClick={() => actions.handleDelete(row.original)}
                        >
                            Delete
                        </Button>
                    </Group>
                ),
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default ProductionRecieptUnPosted_Columns;
