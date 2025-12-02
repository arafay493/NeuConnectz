import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const PickingOrderUnPosted_Outbound_Columns = ({ pagination, list, actions }: any) => {
    const columns = useMemo(
        () => [
            // ========== SERIAL NUMBER (UNCHANGED) ==========
            {
                id: "serialNumber",
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

            // ========== NEW API COLUMNS ==========

            {
                id: "delivery",
                accessorKey: "delivery",
                header: "Delivery",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "item",
                accessorKey: "item",
                header: "Item",
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
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "itemDescription",
                accessorKey: "itemDescription",
                header: "Material Name",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() || "-")}
                    </Text>
                ),
            },

            {
                id: "itemCategory",
                accessorKey: "itemCategory",
                header: "Item Category",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "batch",
                accessorKey: "batch",
                header: "Batch",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "plant",
                accessorKey: "plant",
                header: "Plant",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "storageLocation",
                accessorKey: "storageLocation",
                header: "Storage Location",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "deliveryQuantity",
                accessorKey: "deliveryQuantity",
                header: "Delivery Qty",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "baseUom",
                accessorKey: "baseUom",
                header: "Base UOM",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "referenceDocument",
                accessorKey: "referenceDocument",
                header: "Reference Doc",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "movementType",
                accessorKey: "movementType",
                header: "Movement Type",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "precedingDocCateg",
                accessorKey: "precedingDocCateg",
                header: "Preceding Doc Category",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "itemOverallStatus",
                accessorKey: "itemOverallStatus",
                header: "Overall Status",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "itemGoodsMovementSts",
                accessorKey: "itemGoodsMovementSts",
                header: "Goods Movement Status",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} ta="center">
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            // ========== CREATED DATE (UNCHANGED IF NOT IN RESPONSE) ==========
            {
                id: "createdDate",
                accessorKey: "createdDate",
                header: "Created Date",
                cell: ({ getValue }: any) => {
                    const rawDate = getValue();
                    const formatted = rawDate ? dayjs(rawDate).format("DD/MM/YYYY") : "-";
                    return (
                        <Text fw={500} c={customStyles.colors._909090} ta="center">
                            {formatted}
                        </Text>
                    );
                },
            },
            {
                id: "pickingUnposted_outbound_confirmationStatus",
                accessorKey: "confirmationStatus",
                header: "Status",
                cell: ({ getValue }: any) => (
                    getValue() !== "UnConfirmed" ?
                        <Text
                            fw={500}
                            c={customStyles.colors.green}
                            px={20}
                            py={5}
                            bg={customStyles.colors.lightgreen}
                            style={{ borderRadius: 20, textAlign: "center" }}
                        >
                            <IconCircleFilled size={10} />{" "}
                            {/* {String(getValue() ?? "-")} */}
                            {"Confirmed"}
                        </Text> :
                        <Text fw={500} c={customStyles.colors._909090} px={20} py={5} bg={customStyles.colors.evenTableColor} style={{ borderRadius: 20, textAlign: "center" }}>
                            <IconCircleFilled size={10} />
                            {/* {" " + String(getValue() ?? "-")} */}
                            {" " + "Unconfirmed"}
                        </Text>
                ),
                enableColumnFilter: true,
            },

            // ========== ACTIONS COLUMN (UNCHANGED) ==========
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

                        <Button
                            variant="transparent"
                            className="filledButton"
                            radius={8}
                            miw={121}
                            onClick={() => actions.handleConfirmModalOpen(row.original)}
                        >
                            Confirm
                        </Button>
                    </Group>
                ),
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default PickingOrderUnPosted_Outbound_Columns;
