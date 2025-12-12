import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import React, { useMemo } from 'react';

const InBoundSto_View_Columns = ({ pagination, list }: any) => {
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
                        <Text fw={500} c={customStyles.colors._909090} ta="center">
                            {serialNumber}
                        </Text>
                    );
                },
            },

            // =================== MATERIAL NO ===================
            {
                id: "materialNo",
                accessorKey: "materialNo",
                header: "Material No",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            // =================== MATERIAL DESCRIPTION ===================
            {
                id: "materialDescription",
                accessorKey: "materialDescription",
                header: "Material Description",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            // =================== BATCH NO ===================
            {
                id: "batchNo",
                accessorKey: "batchNo",
                header: "Batch",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() || "-"}
                    </Text>
                ),
            },

            // =================== QUANTITY ===================
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

            // =================== UOM ===================
            {
                id: "uom",
                accessorKey: "uom",
                header: "UoM",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            // =================== BIN LOCATION ===================
            {
                id: "binLocation",
                accessorKey: "binLocation",
                header: "Bin Location",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default InBoundSto_View_Columns;
