import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const PickingOrderUnPosted_Sales_Order_Columns = ({ pagination, list, actions }: any) => {
    const columns = useMemo(
        () => [
            // =================== SERIAL NUMBER (UNCHANGED) ===================
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

            // =================== API MAPPED COLUMNS ===================

            {
                id: "docNum",
                accessorKey: "docNum",
                header: "Doc Num",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "deliveryNo",
                accessorKey: "deliveryNo",
                header: "Delivery No",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "itemNo",
                accessorKey: "itemNo",
                header: "Item No",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "material",
                accessorKey: "material",
                header: "Material",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "itemDescription",
                accessorKey: "itemDescription",
                header: "Description",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() || "-"}
                    </Text>
                ),
            },

            {
                id: "plant",
                accessorKey: "plant",
                header: "Plant",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "warehouse",
                accessorKey: "warehouse",
                header: "Warehouse",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "quantity",
                accessorKey: "quantity",
                header: "Quantity",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "uom",
                accessorKey: "uom",
                header: "UOM",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "referenceDocument",
                accessorKey: "referenceDocument",
                header: "Reference Doc",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "createdDate",
                accessorKey: "createdDate",
                header: "Created Date",
                cell: ({ getValue }: any) => {
                    const rawDate = getValue();
                    const formatted = rawDate ? dayjs(rawDate).format("DD/MM/YYYY") : "-";
                    return (
                        <Text fw={500} ta="center" c={customStyles.colors._909090}>
                            {formatted}
                        </Text>
                    );
                },
            },

            // =================== CONFIRMATION STATUS (UNCHANGED) ===================
            {
                id: "pickingUnposted_outbound_confirmationStatus",
                accessorKey: "confirmationStatus",
                header: "Status",
                cell: ({ getValue }: any) =>
                    getValue() === "Confirmed" ? (
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
                enableColumnFilter: true,
            },

            // =================== ACTIONS COLUMN (UNCHANGED) ===================
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

                        {row?.original?.confirmationStatus !== "Confirmed" ? (
                            <Button
                                variant="transparent"
                                className={row?.original?.confirmationStatus === "Confirmed" ? "filledDisabledButton" : "filledButton"}
                                disabled={row?.original?.confirmationStatus === "Confirmed"}
                                radius={8}
                                miw={121}
                                onClick={() => actions.handleConfirmModalOpen(row.original)}
                            >
                                Confirm
                            </Button>
                        ) : (
                            <Button
                                variant="transparent"
                                className={"filledButton"}
                                disabled={row?.original?.confirmationStatus !== "Confirmed"}
                                radius={8}
                                miw={121}
                                onClick={() => actions.handlePost(row.original)}
                            >
                                Post
                            </Button>
                        )}
                    </Group>
                ),
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default PickingOrderUnPosted_Sales_Order_Columns;
