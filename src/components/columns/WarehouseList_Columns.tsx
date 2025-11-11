"use client";
import { Checkbox, Text } from "@mantine/core";
import { useMemo } from "react";
import { customStyles } from "@/styles/custom-theme";

const WarehouseList_Columns = ({
    pagination,
    selectedWarehousesAllow,
    selectedWarehousesReceive,
    warehouseList,
    handleSelectAllWarehousesAllow,
    handleSelectSpecificWarehouseAllow,
    handleSelectAllWarehousesReciever,
    handleSelectSpecificWarehouseReciever,
    selectedUser,
}: any) => {
    const columns = useMemo(
        () => [
            {
                id: "serialNumber",
                header: "S.No",
                minSize: 100,
                maxSize: 120,
                cell: ({ row }: any) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
                enableColumnFilter: false,
            },
            {
                accessorKey: "whsCode",
                header: "Warehouse Code",
                minSize: 160,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "whsName",
                header: "Warehouse Name",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "pCode",
                header: "Plant Code",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "slcCode",
                header: "Storage Location",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                id: "allow",
                header: ({ table }: any) => {
                    return (
                        <Checkbox
                            checked={selectedWarehousesAllow?.length === warehouseList?.length}
                            indeterminate={selectedWarehousesAllow?.length < warehouseList?.length && selectedWarehousesAllow?.length > 0}
                            onChange={(event) =>
                                handleSelectAllWarehousesAllow()
                            }
                            size="sm"
                            label="Allow"
                            color={customStyles.colors._1B59F8}
                            radius="xl"
                            disabled={!selectedUser}
                            title="Select all on current page"
                        />
                    );
                },
                minSize: 180,
                cell: ({ row }: any) => {
                    const isChecked = selectedWarehousesAllow.includes(row?.original)
                    return (
                        <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                                handleSelectSpecificWarehouseAllow(row?.original)
                            }
                            size="sm"
                            color={customStyles.colors._1B59F8}
                            label="Allow access"
                            radius="xl"
                            disabled={!selectedUser}
                            w={200}
                            styles={{
                                root: {
                                    padding: "10px 16px",
                                    border: isChecked
                                        ? `1px solid ${customStyles.colors._1B59F8}`
                                        : `1px solid ${customStyles.colors._E1E7EC}`,
                                    background: isChecked ? customStyles.colors._1B59F81A : "",
                                    borderRadius: "6px",
                                    opacity: !selectedUser ? 0.5 : 1,
                                },
                                label: {
                                    color: isChecked
                                        ? customStyles.colors._1B59F8
                                        : customStyles.colors._909090,
                                },
                            }}
                        />
                    );
                },
                enableColumnFilter: true,
            },
            {
                id: "receiver",
                header: ({ row }: any) => {
                    // const isAllowed = selectedWarehousesAllow.includes(row?.original)
                    // const isRecieved = selectedWarehousesReceive.includes(row?.original)
                    // const isChecked = isAllowed && isRecieved
                    // const isChecked = selectedWarehousesReceive.includes(row?.original)
                    return (
                        <Checkbox
                            checked={(selectedWarehousesReceive?.length === warehouseList?.length)}
                            indeterminate={selectedWarehousesReceive?.length < warehouseList?.length && selectedWarehousesReceive?.length > 0}
                            onChange={(event) =>
                                handleSelectAllWarehousesReciever()
                            }
                            size="sm"
                            label="Recevier"
                            color={customStyles.colors._1B59F8}
                            radius="xl"
                            disabled={!(selectedWarehousesAllow?.length === warehouseList?.length)}
                            title="Select all on current page"
                        />
                    );
                },
                minSize: 180,
                cell: ({ row }: any) => {
                    const isAllowed = selectedWarehousesAllow.includes(row?.original)
                    // const isRecieved = selectedWarehousesReceive.includes(row?.original)
                    // const isChecked = isAllowed && isRecieved
                    const isChecked = selectedWarehousesReceive.includes(row?.original)
                    return (
                        <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                                handleSelectSpecificWarehouseReciever(row?.original)
                            }
                            size="sm"
                            color={customStyles.colors._1B59F8}
                            label="Allow access"
                            radius="xl"
                            disabled={!isAllowed}
                            w={200}
                            styles={{
                                root: {
                                    padding: "10px 16px",
                                    border: isChecked
                                        ? `1px solid ${customStyles.colors._1B59F8}`
                                        : `1px solid ${customStyles.colors._E1E7EC}`,
                                    background: isChecked ? customStyles.colors._1B59F81A : "",
                                    borderRadius: "6px",
                                    opacity: !selectedUser ? 0.5 : 1,
                                },
                                label: {
                                    color: isChecked
                                        ? customStyles.colors._1B59F8
                                        : customStyles.colors._909090,
                                },
                            }}
                        />
                    );
                },
                enableColumnFilter: true,
            },
        ],
        [
            pagination,
            selectedWarehousesAllow,
            selectedWarehousesReceive,
            warehouseList,
            handleSelectAllWarehousesAllow,
            handleSelectSpecificWarehouseAllow,
            handleSelectAllWarehousesReciever,
            handleSelectSpecificWarehouseReciever,
            selectedUser,
        ]
    );

    return columns;
};

export default WarehouseList_Columns;
