'use client';

import TableBodyRowComponent from '@/components/table-components/TableBodyRowComponent';
import TableComponent from '@/components/table-components/TableComponent';
import TableHeadRowComponent from '@/components/table-components/TableHeadRowComponent';
import { HistoryTableProps } from '@/types/modules/history-types/history.types';
import { Box, Button, Group, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

const historyTableData: HistoryTableProps[] = [
    {
        id: '1',
        batchId: 'BATCH123457',
        dateAndTime: '2025-06-01 12:00',
        status: 'Send to Printer',
        quantity: '2000',
        action: {
            label: 'Email',
            onClick: () => { console.log('Action clicked'); }
        }
    },
    {
        id: '2',
        batchId: 'BATCH123456',
        dateAndTime: '2025-06-01 12:00',
        status: 'Code Generated',
        quantity: 1000,
        action: {
            label: 'Email',
            onClick: () => { console.log('Action clicked'); }
        }
    },
]

const History = () => {
    return (
        <Box p={8}>
            <Group justify='space-between'>
                <Title order={3}>
                    History
                </Title>
                <Button
                    variant="filled"
                    size='md'
                    color='#2f80ed'
                    radius='md'
                    leftSection={<IconPlus size={20} />}
                >
                    Generate Barcode
                </Button>
            </Group>
            <Box mt={16}>
                <Box p={20} bg="#fbfbfb" style={{ border: '1px solid #e2e2e2', borderRadius: '8px' }}>
                    <TableComponent
                        title='Batch Printing History'
                        isSeeAll
                        tableHeadRow={
                            <TableHeadRowComponent<HistoryTableProps>
                                row={{
                                    batchId: 'Batch ID',
                                    dateAndTime: 'Date & Time',
                                    status: 'Status',
                                    quantity: 'Quantity',
                                    action: 'Action'
                                }}
                            />}
                        tableBodyRow={<TableBodyRowComponent<HistoryTableProps>
                            row={historyTableData}
                        />}
                    />
                </Box>
            </Box>
        </Box >
    )
}

export default History;