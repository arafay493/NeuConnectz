import { customStyles } from '@/styles/custom-theme';
import { Button, Group, Text } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import React, { useMemo } from 'react';

const PickingOrderUnPosted_Outbound_View_Columns = ({ pagination, list, actions }: any) => {
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

            // =================== NEW API COLUMNS ===================

            {
                id: "sourceStorageBin",
                accessorKey: "sourceStorageBin",
                header: "Storage Bin",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "sourceStorageSection",
                accessorKey: "sourceStorageSection",
                header: "Storage Section",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "sourceStorageType",
                accessorKey: "sourceStorageType",
                header: "Storage Type",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
                    </Text>
                ),
            },

            {
                id: "batchNumber",
                accessorKey: "batchNumber",
                header: "Batch Number",
                cell: ({ getValue }: any) => (
                    <Text fw={500} ta="center" c={customStyles.colors._909090}>
                        {getValue() ?? "-"}
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
        ],
        [list, pagination]
    );

    return columns;
};

export default PickingOrderUnPosted_Outbound_View_Columns;
