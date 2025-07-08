import { HistoryTableProps } from "@/types/modules/history-types/history.types";
import { ProductionOrderTableProps } from "@/types/modules/production-order/production-order.types";
import { TableTh, TableTr } from "@mantine/core"

interface TableHeadRowComponentProps<T> {
    row: T;
}

const TableHeadRowComponent = <T extends HistoryTableProps | ProductionOrderTableProps>({ row }: TableHeadRowComponentProps<T>) => {
    return (
        <TableTr>
            {Object.entries(row).map(([key, value]) => (
                <TableTh
                    key={key}
                    style={{
                        color: '#9ca3af',
                        fontWeight: 500,
                        fontSize: '1rem',
                        padding: '12px 16px',
                    }}
                >
                    {value}
                </TableTh>
            ))}
        </TableTr>
    )
}

export default TableHeadRowComponent