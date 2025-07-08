'use client';

import React from 'react'
import { Box, Button, Group, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import TableComponent from '@/components/table-components/TableComponent'
import TableHeadRowComponent from '@/components/table-components/TableHeadRowComponent'
import TableBodyRowComponent from '@/components/table-components/TableBodyRowComponent'
import { ProductionOrderTableProps } from '@/types/modules/production-order/production-order.types';
import Link from 'next/link';

const productionOrderData: ProductionOrderTableProps[] = [
    {
        docNumber: "PO123456",
        date: "2025-06-01",
        itemCode: "ITEM001",
        productionLine: "Line 1",
        itemName: "Widget A",
        warehouseName: "Warehouse A",
        warehouseNumber: "WH001",
        planQuantity: 1200,
        actualQuantity: 1000,
        id: "1",
    },
    {
        docNumber: "PO123456",
        date: "2025-06-01",
        itemCode: "ITEM001",
        productionLine: "Line 1",
        itemName: "Widget A",
        warehouseName: "Warehouse A",
        warehouseNumber: "WH001",
        planQuantity: 1200,
        actualQuantity: 1000,
        id: "2",
    },
    {
        docNumber: "PO123456",
        date: "2025-06-01",
        itemCode: "ITEM001",
        productionLine: "Line 1",
        itemName: "Widget A",
        warehouseName: "Warehouse A",
        warehouseNumber: "WH001",
        planQuantity: 1200,
        actualQuantity: 1000,
        id: "3",
    },
]

const ProductionOrder = () => {
    return (
        <Box p={8}>
            <Group justify='space-between'>
                <Title order={3} fw={500}>
                    Production Order Details
                </Title>
                <Link href="/production-order/add" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="filled"
                        size='md'
                        color='#2f80ed'
                        radius='md'
                        leftSection={<IconPlus size={20} />}
                    >
                        Add Production Order
                    </Button>
                </Link>
            </Group>
            <Box mt={16}>
                <Box p={20} bg="#fbfbfb" style={{ border: '1px solid #e2e2e2', borderRadius: '8px' }}>
                    <TableComponent
                        tableHeadRow={
                            <TableHeadRowComponent<ProductionOrderTableProps>
                                row={{
                                    docNumber: "Doc No",
                                    date: "Date",
                                    itemCode: "Item Code",
                                    productionLine: "Production Line",
                                    itemName: "Item Name",
                                    warehouseName: "Warehouse Name",
                                    warehouseNumber: "Warehouse No",
                                    planQuantity: "Plan Quantity",
                                    actualQuantity: "Actual Quantity",
                                    // id: "ID",
                                }} />}
                        tableBodyRow={
                            <TableBodyRowComponent<ProductionOrderTableProps>
                                row={productionOrderData}
                            />}
                    />
                </Box>
            </Box>
        </Box >
    )
}

export default ProductionOrder;