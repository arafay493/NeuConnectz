import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const PickingOrderUnPosted_Reservation_Columns = ({ pagination, list, actions }: any) => {
    const columns = useMemo(
        () => [
            // ========== SERIAL NUMBER ==========
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
                enableColumnFilter: true,
            },

            // ========== API DATA COLUMNS ==========

            {
                id: "docNum",
                accessorKey: "docNum",
                header: "Doc Number",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "reservationNumber",
                accessorKey: "reservationNumber",
                header: "Reservation No",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "material",
                accessorKey: "material",
                header: "Material",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "materialDescription",
                accessorKey: "materialDescription",
                header: "Material Description",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() || "-")}
                    </Text>
                ),
            },

            {
                id: "baseUnitOfMeasure",
                accessorKey: "baseUnitOfMeasure",
                header: "Base UOM",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "selectedMovementType",
                accessorKey: "selectedMovementType",
                header: "Movement Type",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "receivingPlant",
                accessorKey: "receivingPlant",
                header: "Receiving Plant",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "receivingStorageLocation",
                accessorKey: "receivingStorageLocation",
                header: "Receiving Storage Loc",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "sourceStorageBin",
                accessorKey: "sourceStorageBin",
                header: "Source Bin",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },

            {
                id: "pickingUnposted_reservation_createdOn",
                accessorKey: "createdOn",
                header: "Date",
                cell: ({ getValue }: any) => {
                    const rawDate = getValue();
                    const formatted = rawDate
                        ? dayjs(rawDate).format("DD/MM/YYYY")
                        : "-";
                    return (
                        <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                            {formatted}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            },

            {
                id: "totalQuantity",
                accessorKey: "totalQuantity",
                header: "Total Qty",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "pickingUnposted_reservation_confirmationStatus",
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

            {
                id: "erpMaterialDocument",
                accessorKey: "erpMaterialDocument",
                header: "ERP Material Doc",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() || "-")}
                    </Text>
                ),
            },

            {
                id: "erpTransferOrder",
                accessorKey: "erpTransferOrder",
                header: "ERP Transfer Order",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() || "-")}
                    </Text>
                ),
            },

            // ========== ACTIONS COLUMN ==========
            {
                id: "reservation_actions",
                header: "Actions",
                cell: ({ row }: any) => (
                    <Group gap="xs" justify="center" style={{ flexWrap: "nowrap", display: "flex", flexDirection: "row", alignItems: "center" }}>
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
                enableColumnFilter: false,
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default PickingOrderUnPosted_Reservation_Columns;
