'use client';

import { fetchReconciliationData } from '@/redux/actions/reconciliation-action/reconciliation-action';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { InventoryTransferItems, QuantityDifferenceData, TransferReceiptItems } from '@/types/redux-types';
import { Box, Image, Stack, Text, Title } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import InventoryTransferTable from './inventory-transfer-table/inventory-transfer-table';
import InventoryTransferReceiptTables from './InventoryTransferReceiptTables';
import ReconciliationActionBar from './reconciliation-action-bar/ReconciliationActionBar';
import ReconciliationFilterBar from './reconciliation-filter-bar/ReconciliationFilterBar';
import ReconciliationQuantityDifferenceTable from './ReconciliationQuantityDifferenceTable';
import TransferReceiptTable from './transfer-receipt-table/transfer-receipt-table';
import { localAssets } from '@/lib/file-paths/file-paths';
import NextImage from 'next/image';

const ReconciliationComponent = () => {
    // Note: Reconciliation Filter Bar States
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [toWarehouse, setToWarehouse] = useState<string | null>(null);
    const [fromWarehouse, setFromWarehouse] = useState<string | null>(null);

    // Note: Reconciliation Data States
    const [inventoryTransferData, setInventoryTransferData] = useState<Array<InventoryTransferItems>>([]);
    const [transferReceiptData, setTransferReceiptData] = useState<Array<TransferReceiptItems>>([]);

    // Note: Quantity Difference Data
    const [quantityDifferenceData, setQuantityDifferenceData] = useState<Array<QuantityDifferenceData>>([]);

    const dispatch = useDispatch<AppDispatch>();

    const handleGetReconciliationData = () => {
        dispatch(fetchReconciliationData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))
    }

    // Note: Auth Selector for Api Call
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
    const { inventoryTransferItems, transferReceiptItems } = useAppSelector(({ reconciliationStates }) => { return reconciliationStates });

    useEffect(() => {
        dispatch(fetchAllWareHouses(authenticatedUser?.token as string))
    }, [])

    const handleInventoryTransferDataChange = (row: InventoryTransferItems) => {
        setInventoryTransferData(prevData => {
            const existingIndex = prevData.findIndex(item => item.itemCode === row.itemCode);
            if (existingIndex !== -1) {
                // Item already selected, remove it (toggle off)
                const updatedData = [...prevData];
                updatedData.splice(existingIndex, 1);
                return updatedData;
            }
            // Item not selected, add it (toggle on)
            return [...prevData, row];
        });
    }

    const handleTransferReceiptDataChange = (row: TransferReceiptItems) => {
        setTransferReceiptData(prevData => {
            const existingIndex = prevData.findIndex(item => item.itemCode === row.itemCode);
            if (existingIndex !== -1) {
                // Item already selected, remove it (toggle off)
                const updatedData = [...prevData];
                updatedData.splice(existingIndex, 1);
                return updatedData;
            }
            // Item not selected, add it (toggle on)
            return [...prevData, row];
        });
    }

    const handleCalculateQuantityDifference = useCallback(() => {
        const quantityDifference: QuantityDifferenceData[] = [];

        // Create a map to track all unique item codes from both tables
        const itemCodeMap = new Map<string, {
            itemName: string;
            itQuantity: number;
            trQuantity: number;
        }>();

        // Add inventory transfer data to the map
        inventoryTransferData.forEach(item => {
            itemCodeMap.set(item.itemCode, {
                itemName: item.itemName,
                itQuantity: item.quantity,
                trQuantity: 0
            });
        });

        // Add or update with transfer receipt data
        transferReceiptData.forEach(item => {
            const existing = itemCodeMap.get(item.itemCode);
            if (existing) {
                // Update existing entry with TR quantity
                existing.trQuantity = item.quantity;
            } else {
                // Create new entry with only TR quantity
                itemCodeMap.set(item.itemCode, {
                    itemName: item.itemName,
                    itQuantity: 0,
                    trQuantity: item.quantity
                });
            }
        });

        // Convert map to array and calculate differences
        itemCodeMap.forEach((value, itemCode) => {
            const difference = value.itQuantity - value.trQuantity;
            quantityDifference.push({
                itemCode,
                itemName: value.itemName,
                totalITQuantity: value.itQuantity,
                totalTRQuantity: value.trQuantity,
                quantityDifference: difference,
                action: 'View'
            });
        });

        setQuantityDifferenceData(quantityDifference);
    }, [inventoryTransferData, transferReceiptData]);

    useEffect(() => {
        // Calculate quantity difference whenever inventory transfer or transfer receipt data changes
        handleCalculateQuantityDifference();
    }, [handleCalculateQuantityDifference])
    return (
        <Box p={8}>
            <Title order={2} mb={8} c={customStyles.colors._4D4D4D}>Reconciliation</Title>
            <Text c={customStyles.colors._909090}>Match Inventory Transfers to Transfer Receipts for accurate stock and quantity tracking.</Text>

            {/* Reconciliation Get Data Filter Bar */}
            <ReconciliationFilterBar
                fromWarehouse={fromWarehouse}
                setFromWarehouse={setFromWarehouse}
                toWarehouse={toWarehouse}
                setToWarehouse={setToWarehouse}
                selectDate={selectDate}
                setSelectDate={setSelectDate}
                warehouseData={wareHousesList.data}
                handleGetData={handleGetReconciliationData}
            />


            {/* Reconciliation Not Found Component */}
            {(!inventoryTransferItems.length && !transferReceiptItems.length) ? (
                <Stack h={550} align='center' justify='center' mt={24} p={24} style={{ backgroundColor: customStyles.colors.white, borderRadius: '16px' }}>
                    <Image w={250} h={250} radius={16} component={NextImage} src={localAssets.reconciliationNotFoundImage} alt="Not Found" />
                    <Title order={2} c={customStyles.colors._4D4D4D}>No Data Found</Title>
                    <Stack align='center' gap={0}>
                        <Text c={customStyles.colors._909090} size="md">There are no Inventory Transfers or Transfer Receipts to show right now.</Text>
                        <Text c={customStyles.colors._909090} size="md">Try adjusting your filters or date range to view records.</Text>
                    </Stack>
                </Stack>
            ) : (
                <>
                    {/* Reconciliation Inventory Transfer And Transfer Receipt Tables */}
                    <InventoryTransferReceiptTables
                        inventoryTransfer={<InventoryTransferTable
                            data={inventoryTransferItems}
                            handleRowClick={handleInventoryTransferDataChange}
                            selectedItems={inventoryTransferData}
                        />}
                        transferReceipt={<TransferReceiptTable
                            data={transferReceiptItems}
                            handleRowClick={handleTransferReceiptDataChange}
                            selectedItems={transferReceiptData}
                        />}
                    />

                    {/* Reconciliation Action Bar */}
                    <ReconciliationActionBar />

                    {/* Reconciliation Quantity Difference Table */}
                    <ReconciliationQuantityDifferenceTable
                        data={quantityDifferenceData}
                    />
                </>
            )}
        </Box>
    )
}

export default ReconciliationComponent