import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

const safeValue = (v: any) =>
    v !== null && v !== undefined && v !== '' ? String(v) : '-';

const PutAwayOrderViewDetails_Columns = ({ pagination, list }: any) => {
    const columns = useMemo(
        () => [
            {
                id: 'serialNumber',
                header: 'S.No',
                minSize: 80,
                maxSize: 80,
                cell: ({ row }: any) => {
                    const serialNumber =
                        pagination.pageIndex * pagination.pageSize + row.index + 1;
                    return (
                        <Text fw={500} c={customStyles.colors._909090}>
                            {serialNumber}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            },

            {
                accessorKey: "docNum",
                header: "Doc No",
                minSize: 140,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "warehouseNumber",
                header: "Warehouse No",
                minSize: 160,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "trNumber",
                header: "TR Number",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "movementType",
                header: "Movement Type",
                minSize: 160,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "sourceStorageType",
                header: "Source Storage Type",
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "sourceStorageBin",
                header: "Source Bin",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "destStorageType",
                header: "Dest Storage Type",
                minSize: 160,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "destStorageBin",
                header: "Dest Bin",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "materialDocYear",
                header: "Doc Year",
                minSize: 140,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },


            {
                accessorKey: "quantity",
                header: "Quantity",
                minSize: 120,
                cell: ({ getValue }: any) => {
                    const v = getValue();
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {v != null ? Number(v).toFixed(2) : "-"}
                        </Text>
                    );
                },
            },

            {
                accessorKey: "baseUOM",
                header: "UOM",
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "purchaseOrder",
                header: "PO Number",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "material",
                header: "Material",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "materialDescription",
                header: "Material Description",
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "plant",
                header: "Plant",
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },

            {
                accessorKey: "storageLocation",
                header: "Storage Location",
                minSize: 170,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {safeValue(getValue())}
                    </Text>
                ),
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default PutAwayOrderViewDetails_Columns;
