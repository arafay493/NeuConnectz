import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const BinToBinTransferOrderPosted_Columns = ({ pagination, list, actions }: any) => {
    const columns = useMemo(
        () => [
            // ========== SERIAL NUMBER (UNCHANGED) ==========
            {
                id: "reservation_serialNumber",
                header: "S.No",
                maxSize: 80,
                cell: ({ row }: any) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                            {serialNumber}
                        </Text>
                    );
                },
            },

            // ========== NEW API-DATA COLUMNS ==========

            {
                id: "docNum",
                accessorKey: "docNum",
                header: "Doc Number",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "plant",
                accessorKey: "plant",
                header: "Plant",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "warehouseNumber",
                accessorKey: "warehouseNumber",
                header: "Warehouse No",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "storageLocation",
                accessorKey: "storageLocation",
                header: "Storage Location",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "material",
                accessorKey: "material",
                header: "Material",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "sourceStorageType",
                accessorKey: "sourceStorageType",
                header: "Source Storage Type",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "sourceStorageSection",
                accessorKey: "sourceStorageSection",
                header: "Source Section",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "sourceStorageBin",
                accessorKey: "sourceStorageBin",
                header: "Source Bin",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "destinationStorageType",
                accessorKey: "destinationStorageType",
                header: "Destination Type",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "destinationStorageSection",
                accessorKey: "destinationStorageSection",
                header: "Destination Section",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "destinationStorageBin",
                accessorKey: "destinationStorageBin",
                header: "Destination Bin",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "ERPTransferOrderNo",
                accessorKey: "ERPTransferOrderNo",
                header: "ERP Transfer Order No",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
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
                        <Text fw={500} c={customStyles.colors._909090} ta="center">
                            {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
                        </Text>
                    );
                },
            },

            {
                id: "postedDate",
                accessorKey: "postedDate",
                header: "Posted Date",
                cell: ({ getValue }: any) => {
                    const date = getValue();
                    return (
                        <Text fw={500} c={customStyles.colors._909090} ta="center">
                            {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
                        </Text>
                    );
                },
            },

            // ========== STATUS COLUMN (UNCHANGED) ==========
            {
                id: "pickingUnposted_reservation_confirmationStatus",
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

            // ========== ACTIONS COLUMN (UNCHANGED) ==========
            {
                id: "reservation_actions",
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

                        {/* {row.original?.confirmationStatus !== "Confirmed" ? (
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
                        )} */}
                    </Group>
                ),
            },
        ],
        [list, pagination]
    );

    return columns;
};


export default BinToBinTransferOrderPosted_Columns;
