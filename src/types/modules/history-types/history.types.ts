export interface HistoryTableProps {
    id?: string;
    batchId: string;
    quantity: number | string;
    dateAndTime: string;
    status: 'Code Generated' | 'Send to Printer' | "Status";
    action: historyActionProps | 'Action';
}

type historyActionProps = {
    label: "Email";
    onClick?: () => void;
}