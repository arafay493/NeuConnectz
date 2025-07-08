export interface ProductionOrderTableProps {
    id?: string;
    docNumber: string;
    date: string;
    itemCode: string;
    productionLine: string;
    itemName: string;
    warehouseName: string;
    warehouseNumber: string;
    planQuantity: number | string;
    actualQuantity: number | string;
}