import { customStyles } from '@/styles/custom-theme';
import { Text } from '@mantine/core';
import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';

interface RecieptFromProductionDataType {
  id: string;
  documentNumber: number;
  itemCode: string;
  itemName: string;
  quantity: number;
  wareHouseCode: string;
  baseQuantiy?: number;
  postedDate: string;
}

const RFP_Columns = ({ pagination, recieptFromProductionList }: any) => {
  const columns = useMemo<ColumnDef<RecieptFromProductionDataType>[]>(
    () => [
      {
        id: 'serialNumber',
        header: 'S.No',
        minSize: 80,
        maxSize: 80,
        cell: ({ row }) => {
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
        cell: ({ getValue }) => (
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
        cell: ({ getValue }) => (
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
        cell: ({ getValue }) => (
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
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {String(getValue())}
          </Text>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: 'wareHouseCode',
        header: 'WHS',
        minSize: 150,
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {String(getValue())}
          </Text>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: 'baseQuantiy',
        header: 'Base Qty',
        minSize: 150,
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue() != null ? String(getValue()) : '-'}
          </Text>
        ),
        enableColumnFilter: true,
      },
      {
        accessorKey: 'postedDate',
        header: 'Posting Date',
        minSize: 200,
        cell: ({ getValue }) => (
          <Text c={customStyles.colors._909090} fw={500}>
            {getValue()
              ? new Date(getValue() as string).toLocaleDateString()
              : '-'}
          </Text>
        ),
        enableColumnFilter: true,
      },
      {
        id: 'transcType',
        header: 'Transc Type',
        minSize: 150,
        cell: () => (
          <Text c={customStyles.colors._909090} fw={500}>
            -
          </Text>
        ),
        enableColumnFilter: true,
      },
    ],
    [recieptFromProductionList, pagination]
  );

  return columns;
};

export default RFP_Columns;
