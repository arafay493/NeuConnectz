import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import React, { useMemo } from 'react';

const UnReconciled_ITs_Columns = ({ list }: any) => {
    const columns = useMemo(
        () => [
            // {
            //     id: 'serialNumber',
            //     header: 'S.No',
            //     minSize: 80,
            //     maxSize: 80,
            //     cell: ({ row }: any) => {
            //         const serialNumber =
            //             pagination.pageIndex * pagination.pageSize + row.index + 1;
            //         return (
            //             <Text fw={500} c={customStyles.colors._909090}>
            //                 {serialNumber}
            //             </Text>
            //         );
            //     },
            //     enableColumnFilter: true,
            // },
            {
                accessorKey: 'itemCode',
                header: () => (
                    <span
                        style={{ whiteSpace: 'nowrap', fontWeight: 600 }}
                    >
                        Item Code
                    </span>
                ),
                size: 120,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() ?? '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'itemName',
                header: 'Item Name',
                minSize: 80,
                cell: ({ getValue }: any) => {
                    const value = getValue() ?? '-';
                    const truncated =
                        value.length > 12 ? `${value.substring(0, 12)}...` : value;
                    return (
                        <Text c={customStyles.colors._909090} fw={500} title={value}>
                            {truncated}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            },
            {
                accessorKey: 'quantity',
                header: () => (
                    <span
                        style={{ whiteSpace: 'nowrap', fontWeight: 600 }}
                    >
                        Total Quantity
                    </span>
                ),
                minSize: 150,
                size: 160,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? Number(getValue()).toFixed(2) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
                muiTableHeadCellProps: {
                    sx: {
                        whiteSpace: 'nowrap',
                    },
                },
            },
            // {
            //     accessorKey: 'recordCount',
            //     header: 'Record Count',
            //     minSize: 140,
            //     cell: ({ getValue }: any) => (
            //         <Text c={customStyles.colors._909090} fw={500}>
            //             {getValue() ?? '-'}
            //         </Text>
            //     ),
            //     enableColumnFilter: true,
            // },
            {
                accessorKey: 'reconciled',
                header: 'Status',
                // minSize: 70, // 👈 fixed size
                // size: 70,
                cell: ({ getValue }: any) => (
                    <Text
                        c={customStyles.colors._909090}
                        fw={500}
                    >
                        {getValue() ?? '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
        ],
        [list]
    );

    return columns;
};

export default UnReconciled_ITs_Columns;
