import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import React, { useMemo } from 'react';

const UnReconciled_TRs_Columns = ({ list }: any) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                minSize: 160,
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
                header: 'Total Quantity',
                minSize: 150,
                size: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? Number(getValue()).toFixed(2) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'reconciled',
                header: 'Status',
                // minSize: 50, // 👈 fixed size
                // size: 50,
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

export default UnReconciled_TRs_Columns;
