import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import React, { useMemo } from 'react';

const IT_Columns = ({ pagination, list }: any) => {
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
                accessorKey: 'docNum',
                header: 'Doc Num',
                minSize: 120,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'uniqueId',
                header: 'Base Doc Num',
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {String(getValue())}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'fromWarehouseId',
                header: 'From WH Code',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'toWarehouseId',
                header: 'To WH Code',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'docStatus',
                header: 'Doc Status',
                minSize: 150,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'itemCode',
                header: 'Item Code',
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'itemName',
                header: 'Item Description',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'groupCode',
                header: 'Group Code',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'groupName',
                header: 'Group Name',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'receivedQuantity',
                header: 'Quantity',
                minSize: 120,
                cell: ({ row }: any) => {
                    const { receivedQuantity } = row?.original;
                    return (
                        <Text c={customStyles.colors._909090} fw={500}>
                            {receivedQuantity != null
                                ? Number(receivedQuantity).toFixed(2)
                                : '-'}
                        </Text>
                    );
                },
                enableColumnFilter: true,
            },
            {
                accessorKey: 'erpDocEntry',
                header: 'ERP Doc Entry',
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'erpObjectType',
                header: 'ERP Object Type',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'erpDocLine',
                header: 'ERP Doc Line',
                minSize: 200,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() != null ? String(getValue()) : '-'}
                    </Text>
                ),
                enableColumnFilter: true,
            },
            {
                accessorKey: 'sapStatus',
                header: 'SAP Status',
                minSize: 180,
                cell: ({ getValue }: any) => (
                    <Text c={customStyles.colors._909090} fw={500}>
                        {getValue() as string}
                    </Text>
                ),
                enableColumnFilter: true,
            },
        ],
        [list, pagination]
    );

    return columns;
};

export default IT_Columns;
