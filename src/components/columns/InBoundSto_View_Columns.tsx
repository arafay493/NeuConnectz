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

            // =================== MATERIAL ===================
            {
                id: "material",
                accessorKey: "material",
                header: "Material",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            // =================== BATCH ===================
            {
                id: "batch",
                accessorKey: "batch",
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
                accessorKey: "uoM",
                header: "UoM",
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
