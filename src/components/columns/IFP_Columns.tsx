import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import React, { useMemo } from 'react';

const IFP_Columns = ({ pagination, list }: any) => {
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
                accessorKey: 'documentNumber',
                header: 'Doc No',
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'itemName',
                header: 'Item Description',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text
                        c={customStyles.colors._909090}
                        fw={500}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'quantity',
                header: 'Quantity',
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {Number(getValue())?.toFixed(2)}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'wareHouseCode',
                header: 'WHS',
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'baseQuantity',
                header: 'Base Qty',
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'plannedQuantity',
                header: 'Plan Qty',
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'postedDate',
                header: 'Post Date',
                minSize: 160,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue
                            ? new Date(getValue as string).toLocaleDateString()
                            : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default IFP_Columns;
