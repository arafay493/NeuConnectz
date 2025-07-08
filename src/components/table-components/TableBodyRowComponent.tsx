'use client';

import { HistoryTableProps } from "@/types/modules/history-types/history.types";
import { ProductionOrderTableProps } from "@/types/modules/production-order/production-order.types";
import { Badge, Button, TableTd, TableTr, Text } from "@mantine/core"
import { useRouter } from "next/navigation";



interface TableBodyRowComponentProps<T> {
    row: Array<T>;
}

const TableBodyRowComponent = <T extends HistoryTableProps | ProductionOrderTableProps>({ row }: TableBodyRowComponentProps<T>) => {
    const router = useRouter();

    const handleRowClick = (rowData: Record<string, any>, event: React.MouseEvent) => {
        // Don't navigate if clicking on action buttons or other interactive elements
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('[role="button"]')) {
            return;
        }

        // Navigate to linkTo URL if it exists
        router.push(rowData.docNumber);
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Code Generated':
                return '#4caf50';
            case 'Send to Printer':
                return '#ffc107';
            default:
                return 'gray';
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Code Generated':
                return '#4CAF5033';
            case 'Send to Printer':
                return '#FFC10733';
            default:
                return '#9CA3AF33';
        }
    };

    const TableRow = ({ row }: { row: Record<string, any> }) => {
        return (
            <>
                {Object.entries(row).map(([key, value]) => {
                    if (key === 'status') {
                        return (
                            <TableTd
                                key={key}
                                style={{
                                    color: '#9ca3af',
                                    fontWeight: 500,
                                    fontSize: '1.125rem',
                                    padding: '12px 16px',
                                }}
                            >
                                <Text
                                    c={getStatusColor(value)}
                                    variant={getStatusVariant(value)}
                                    size="xl"
                                    style={{ width: 'fit-content', fontSize: '1.125rem', fontWeight: 500, backgroundColor: getStatusVariant(value), padding: '4px 12px', borderRadius: '12px', textTransform: 'uppercase' }}
                                >
                                    {value}
                                </Text>
                            </TableTd>
                        );
                    } else if (key === 'action') {
                        return (
                            <TableTd
                                key={key}
                                style={{
                                    color: '#9ca3af',
                                    fontWeight: 500,
                                    fontSize: '1.125rem',
                                    padding: '12px 16px',
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    variant="filled"
                                    color="blue"
                                    size="xs"
                                    radius="md"
                                    onClick={value.onClick}
                                    style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 500,
                                        padding: '6px 14px'
                                    }}
                                >
                                    {value.label}
                                </Button>
                            </TableTd>
                        );
                    } else if (key === 'id') {
                        return;
                    } else {
                        return (
                            <TableTd
                                key={key}
                                style={{
                                    color: '#9ca3af',
                                    fontSize: '1.125rem',
                                    fontWeight: 500,
                                    padding: '12px 16px',
                                }}
                            >
                                {value}
                            </TableTd>
                        );
                    }
                })}
            </>
        );
    };

    return (
        <>
            {row.map((rowData) => (
                <TableTr
                    key={rowData.id}
                    onClick={(e) => handleRowClick(rowData, e)}
                    style={{
                        cursor: 'docNumber' in rowData ? 'pointer' : 'default',
                    }}
                >
                    <TableRow row={rowData} />
                </TableTr>
            ))}
        </>
    )
}

export default TableBodyRowComponent