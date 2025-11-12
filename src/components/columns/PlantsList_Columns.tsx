"use client";
import { Checkbox, Text } from "@mantine/core";
import { useMemo } from "react";
import { customStyles } from "@/styles/custom-theme";

const PlantsList_Columns = ({
    pagination,
    selectedPlants,
    plantsList,
    handleSelectAllPlants,
    handleSelectSpecificPlant,
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
                accessorKey: "plantCode",
                header: "Plant Code",
                minSize: 160,
                cell: ({ getValue }: any) => (
                    <Text fw={500} c={customStyles.colors._909090}>
                        {String(getValue() ?? "-")}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: "plantName",
                header: "Plant Name",
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
                            checked={selectedPlants?.length === plantsList?.length}
                            indeterminate={selectedPlants?.length < plantsList?.length && selectedPlants?.length > 0}
                            onChange={(event) =>
                                handleSelectAllPlants()
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
                    // const isChecked = selectedPlants.includes(row?.original)
                    const isChecked = row?.original?.allowed
                    return (
                        <Checkbox
                            checked={isChecked}
                            onChange={(event) =>
                                handleSelectSpecificPlant(row?.original)
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
        ],
        [
            pagination,
            selectedPlants,
            plantsList,
            handleSelectAllPlants,
            handleSelectSpecificPlant,
            selectedUser,
        ]
    );

    return columns;
};

export default PlantsList_Columns;
