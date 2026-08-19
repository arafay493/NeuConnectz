import { customStyles } from '@/styles/custom-theme';
import { Box, Button, Checkbox, Chip, Group, Text } from '@mantine/core';
import { IconCircle, IconCircleDotFilled, IconCircleFilled, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const Columns = ({ pagination, list, selectedRows, actions, isPosted }: any) => {
    const columns = useMemo(
        () => [
            ...[isPosted ? {
                header: "S.No",
                maxSize: 80,
                cell: ({ row }: any) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090} >
                            {serialNumber}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            } :
                {
                    id: "serialNumber",
                    header: ({ table, row }: any) => {
                        const isChecked = selectedRows?.length === list?.length && selectedRows?.length > 0
                        return (
                            <Checkbox
                                checked={isChecked}
                                indeterminate={selectedRows?.length < list?.length && selectedRows?.length > 0}
                                onChange={(event) =>
                                    actions.handleAllCheckbox()
                                }
                                size="sm"
                                label="S.No"
                                color={customStyles.colors._1B59F8}
                                radius="sm"
                                title="Select all on current page"
                            />
                        );
                    },
                    maxSize: 80,
                    cell: ({ row }: any) => {
                        const serialNumber =
                            pagination.pageIndex * pagination.pageSize + row.index + 1;
                        const isChecked = selectedRows?.includes(row?.original)
                        return (
                            <Box display={"flex"}>
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(event) =>
                                        actions.handleSpecificCheckbox(row?.original)
                                    }
                                    size="sm"
                                    color={customStyles.colors._1B59F8}
                                    label={serialNumber}
                                    styles={{
                                        label: {
                                            color: customStyles.colors._909090,
                                        },
                                    }}
                                    radius="sm"
                                />
                            </Box>
                        );
                    },
                }],


            {
                accessorKey: "itemCode",
                header: "Item Code",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },
            {
                accessorKey: "itemName",
                header: "Item Name",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },
            {
                accessorKey: "warehouse",
                header: "Warehouse",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },
            {
                accessorKey: "availableBoxQuantity",
                header: "Available Box Quantity",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },
            {
                accessorKey: "availablePalletQuantity",
                header: "Available Pallet Quantity",
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
            },
            // {
            //     accessorKey: "stockUniqueKey",
            //     header: "Stock Unique Key",
            //     cell: ({ getValue }: any) => (
            //         <Text fw={500} c={customStyles.colors._909090}>
            //             {String(getValue() ?? "-")}
            //         </Text>
            //     ),
            // },

            // {
            //     header: "Actions",
            //     cell: ({ row }: any) => (
            //         <Group
            //             gap="xs"
            //             justify="center"
            //             style={{
            //                 flexWrap: "nowrap",
            //                 display: "flex",
            //                 flexDirection: "row",
            //                 alignItems: "center",
            //             }}
            //         >
            //             <Button
            //                 variant="transparent"
            //                 className="outlineButton"
            //                 radius={8}
            //                 onClick={() =>
            //                     actions.handleViewDetailsModalOpen(row.original)
            //                 }
            //             >
            //                 View Details
            //             </Button>
            //             {/* {row?.original?.confirmationStatus !== "Confirmed" ? <Button
            //                 variant="transparent"
            //                 className={row?.original?.confirmationStatus === "Confirmed" ? "filledDisabledButton" : "filledButton"}
            //                 radius={8}
            //                 miw={121}
            //                 onClick={() =>
            //                     actions.handleConfirmModalOpen(row.original)
            //                 }
            //             >
            //                 Confirm
            //             </Button> : <Button
            //                 variant="transparent"
            //                 className={"filledButton"}
            //                 disabled={row?.original?.confirmationStatus !== "Confirmed"}
            //                 radius={8}
            //                 miw={121}
            //                 onClick={() =>
            //                     actions.handlePost(row.original)
            //                 }
            //             >
            //                 Post
            //             </Button>} */}
            //             {!isPosted && (
            //                 <>
            //                     <Button
            //                         variant="transparent"
            //                         className="filledButton"
            //                         // disabled={
            //                         //     row.original.confirmationStatus !== "Confirmed"
            //                         // }
            //                         radius={8}
            //                         miw={121}
            //                         onClick={() =>
            //                             actions.handlePost(row.original)
            //                         }
            //                     >
            //                         Post
            //                     </Button>

            //                     <Button
            //                         variant="filled"
            //                         color={customStyles.colors.red}
            //                         leftSection={<IconTrash size={18} />}
            //                         radius={8}
            //                         miw={121}
            //                         onClick={() =>
            //                             actions.handleDelete(row.original)
            //                         }
            //                     >
            //                         Delete
            //                     </Button>
            //                 </>
            //             )}
            //         </Group>
            //     ),
            //     enableColumnFilter: false,
            // },
        ],
        [list, selectedRows, pagination, actions.handleAllCheckbox, actions.handleAllCheckbox, isPosted]
    );

    return columns;
};

export default Columns;

