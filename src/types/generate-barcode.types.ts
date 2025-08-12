type status = 'Code Generated' | 'Send to Printer';

interface GenerateBarcodeTableProps {
    batchId: string;
    quantity: string;
    date: string;
    status: status;
}

export const data: GenerateBarcodeTableProps[] = [
    {
        batchId: 'BATCH-001',
        quantity: '50',
        date: '2025-08-10',
        status: 'Code Generated',
    },
    {
        batchId: 'BATCH-002',
        quantity: '120',
        date: '2025-08-09',
        status: 'Code Generated',
    },
    {
        batchId: 'BATCH-003',
        quantity: '200',
        date: '2025-08-08',
        status: 'Send to Printer',
    },
    {
        batchId: 'BATCH-004',
        quantity: '75',
        date: '2025-08-11',
        status: 'Code Generated',
    },
    {
        batchId: 'BATCH-005',
        quantity: '90',
        date: '2025-08-07',
        status: 'Send to Printer',
    },
];

export type {
    GenerateBarcodeTableProps,
    status
}

