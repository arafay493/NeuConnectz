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
            {
                accessorKey: "docNum",
                header: "Doc Number",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                id: "putawayUnposted_transferReceiptNumber",
                accessorKey: "transferReceiptNumber",
                header: "TR Number",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "material",
                header: "Material Code",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "materialDescription",
                header: "Material Name",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "materialDocument",
                header: "Material Doc",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "baseUOM",
                header: "UOM",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "totalQuantity",
                header: "Quantity",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {getValue() ?? "-"}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "movementType",
                header: "Movement Type",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "purchaseOrder",
                header: "Purchase Order",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },

            {
                accessorKey: "supplierName",
                header: "Suppliers",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            // {
            //     accessorKey: "inboundDeliveryNumber",
            //     header: "Inbound Delivery #",
            //     minSize: 200,
            //     cell: ({ getValue }: any) => (
            //         <Text fw={500} c={customStyles.colors._909090}>
            //             {String(getValue() ?? "-")}
            //         </Text>
            //     ),
            //     enableColumnFilter: true,
            // },

            {
                accessorKey: "sourceStorageBin",
                header: "Source Bin",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090} style={{ textAlign: "center" }}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
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
                id: "actions",
                header: "Actions",
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
                        {row?.original?.confirmationStatus !== "Confirmed" ? <Button
                            variant="transparent"
                            className={row?.original?.confirmationStatus === "Confirmed" ? "filledDisabledButton" : "filledButton"}
                            disabled={row?.original?.confirmationStatus === "Confirmed"}
                            radius={8}
                            miw={121}
                            onClick={() =>
                                actions.handleConfirmModalOpen(row.original)
                            }
                        >
                            Confirm
                        </Button> : <Button
                            variant="transparent"
                            className={"filledButton"}
                            disabled={row?.original?.confirmationStatus !== "Confirmed"}
                            radius={8}
                            miw={121}
                            onClick={() =>
                                actions.handlePost(row.original)
                            }
                        >
                            Post
                        </Button>}
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

