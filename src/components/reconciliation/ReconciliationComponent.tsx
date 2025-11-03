'use client';

import { fetchItemCodesData, fetchReconciliationData, fetchUnReconciledITSData, fetchUnReconciledTRSData, postAutoReconcile, postCreateAdjustedITRInReconciliation, postCreateRemainingAdjustedTR, postReverseITofTRInReconciliation, postTransferToLostWarehouse } from '@/redux/actions/reconciliation-action/reconciliation-action';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import { AppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { InventoryTransferItems, QuantityDifferenceData, TransferReceiptItems } from '@/types/redux-types';
import { Box, Button, Group, Image, Select, Stack, Text, Title } from '@mantine/core';
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
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { IconCopyCheck } from '@tabler/icons-react';
import QuantityDifferenceViewModal from '../modals/quantity-difference-view-modal/QuantityDifferenceViewModal';
import QuantityDifferenceView2Modal from '../modals/quantity-difference-view2-modal/QuantityDifferenceView2Modal';
import Loader from '../loader/loader';
import { FadeLoader } from 'react-spinners';

type SelectedDataTypes = {
    itemCode?: string;
    itemName?: string;
    itsQuantity?: number;
    trsQuantity?: number;
    itIds?: any
    trIds?: any
};

type mergedDataTypes = {
    itemCode?: string;
    itemName?: string;
    quantity?: number;
}[];

const ReconciliationComponent = () => {
    // Note: Reconciliation Filter Bar States
    const [selectDate, setSelectDate] = useState<string | null>(null);
    const [toWarehouse, setToWarehouse] = useState<string | null>(null);
    const [fromWarehouse, setFromWarehouse] = useState<string | null>(null);
    const [itemCode, setItemCode] = useState<string | null>(null);
    const [searchItemCode, setSearchItemCode] = useState<string | null>(null);
    const [selectedData, setSelectedData] = useState<SelectedDataTypes>({});
    const [quantityDifferenceViewModalOpened, setQuantityDifferenceViewModalOpened] = useState<boolean>(false)

    // Note: Reconciliation Data States
    const [inventoryTransferData, setInventoryTransferData] = useState<Array<InventoryTransferItems>>([]);
    const [transferReceiptData, setTransferReceiptData] = useState<Array<TransferReceiptItems>>([]);

    // Note: Quantity Difference Data
    const [quantityDifferenceData, setQuantityDifferenceData] = useState<Array<QuantityDifferenceData>>([]);

    const dispatch = useDispatch<AppDispatch>();
    // Note: Auth Selector for Api Call
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { wareHousesList } = useAppSelector(({ wareHouseStates }) => { return wareHouseStates });
    const { inventoryTransferItems, transferReceiptItems, unReconciledITs, unReconciledTRs, itemCodes } = useAppSelector(({ reconciliationStates }) => { return reconciliationStates });

    // Loading
    const [loading, setLoading] = useState<boolean>(false)
    const [scrollFromWarehouseLoading, setScrollFromWarehouseLoading] = useState<boolean>(false)
    const [scrollToWarehouseLoading, setScrollToWarehouseLoading] = useState<boolean>(false)

    // Pagination States
    const [wareHouseListPagination, setWareHouseListPagination] = useState({
        pageIndex: 0,
        pageSize: 0,
    });

    const handleGetReconciliationData = () => {
        if (toWarehouse === fromWarehouse) {
            showNotificationToast('Cannot Reconcile', 'From and To Warehouses cannot be the same.', customStyles.colors.red);
        }

        // dispatch(fetchReconciliationData({
        //     authToken: authenticatedUser?.token as string,
        //     fromWarehouseCode: fromWarehouse ?? '',
        //     toWarehouseCode: toWarehouse ?? '',
        //     date: selectDate ?? ''
        // }))

        dispatch(fetchUnReconciledITSData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))

        dispatch(fetchUnReconciledTRSData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))

        dispatch(fetchItemCodesData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))
    }

    const handleResponse = (res: any) => {
        dispatch(fetchUnReconciledITSData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))

        dispatch(fetchUnReconciledTRSData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))

        dispatch(fetchItemCodesData({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? ''
        }))
        setSelectDate(null)
        setToWarehouse(null)
        setFromWarehouse(null)
        setItemCode(null)
        setSelectedData({})
    }

    const handleAutoReconcile = () => {
        if (toWarehouse === fromWarehouse) {
            showNotificationToast('Cannot Reconcile', 'From and To Warehouses cannot be the same.', customStyles.colors.red);
        }

        dispatch(postAutoReconcile({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse ?? '',
            toWarehouseCode: toWarehouse ?? '',
            date: selectDate ?? '',
            resHandler: handleResponse
        }))
    }

    useEffect(() => {
        // dispatch(fetchAllWareHouses({ authToken: authenticatedUser?.token as string }))
        dispatch(fetchAllWareHouses({
            authToken: authenticatedUser?.token as string,
            lastCount: wareHouseListPagination.pageSize + 5,
            skipRecords: 0,
        }))
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

    // const handleCalculateQuantityDifference = useCallback(() => {
    //     const quantityDifference: QuantityDifferenceData[] = [];

    //     // Create a map to track all unique item codes from both tables
    //     const itemCodeMap = new Map<string, {
    //         itemName: string;
    //         itQuantity: number;
    //         trQuantity: number;
    //     }>();

    //     // Add inventory transfer data to the map
    //     inventoryTransferData.forEach(item => {
    //         itemCodeMap.set(item.itemCode, {
    //             itemName: item.itemName,
    //             itQuantity: item.quantity,
    //             trQuantity: 0
    //         });
    //     });

    //     // Add or update with transfer receipt data
    //     transferReceiptData.forEach(item => {
    //         const existing = itemCodeMap.get(item.itemCode);
    //         if (existing) {
    //             // Update existing entry with TR quantity
    //             existing.trQuantity = item.quantity;
    //         } else {
    //             // Create new entry with only TR quantity
    //             itemCodeMap.set(item.itemCode, {
    //                 itemName: item.itemName,
    //                 itQuantity: 0,
    //                 trQuantity: item.quantity
    //             });
    //         }
    //     });

    //     // Convert map to array and calculate differences
    //     itemCodeMap.forEach((value, itemCode) => {
    //         const difference = value.itQuantity - value.trQuantity;
    //         quantityDifference.push({
    //             itemCode,
    //             itemName: value.itemName,
    //             totalITQuantity: value.itQuantity,
    //             totalTRQuantity: value.trQuantity,
    //             quantityDifference: difference,
    //             action: 'View'
    //         });
    //     });

    //     setQuantityDifferenceData(quantityDifference);
    // }, [inventoryTransferData, transferReceiptData]);

    const handleCalculateQuantityDifference = () => {

    }

    // useEffect(() => {
    //     // Calculate quantity difference whenever inventory transfer or transfer receipt data changes
    //     handleCalculateQuantityDifference();
    // }, [handleCalculateQuantityDifference])

    // Transform itemcode data for Select component
    const selectItemCodesData = itemCodes?.map((data: any) => ({
        value: data?.itemCode,
        label: data?.itemName + " ( " + data?.itemCode + " )"
    }));

    const handleSetItemCode = (val: string) => {
        setItemCode(val ?? '')
        setLoading(true)
        Promise.all([
            dispatch(fetchUnReconciledITSData({
                authToken: authenticatedUser?.token as string,
                fromWarehouseCode: fromWarehouse ?? '',
                toWarehouseCode: toWarehouse ?? '',
                date: selectDate ?? '',
                itemCode: val ?? null,
            })),
            dispatch(fetchUnReconciledTRSData({
                authToken: authenticatedUser?.token as string,
                fromWarehouseCode: fromWarehouse ?? '',
                toWarehouseCode: toWarehouse ?? '',
                date: selectDate ?? '',
                itemCode: val ?? "",
            }))
        ]).then(() => {
            setLoading(false)
        }).catch((err) => {
            console.log("Fetching Error: ", err)
            setLoading(false)
            setItemCode('')
        })
    }

    const handleSelectITS = (data: any) => {
        const merged: mergedDataTypes = Object.values(
            data.reduce((acc: any, curr: any) => {
                const key = curr.itemCode;
                if (!acc[key]) {
                    acc[key] = { ...curr };
                } else {
                    acc[key].quantity += curr.quantity;
                }
                return acc;
            }, {})
        );

        const itIds: any = data.map((item: any) => item.id)
        const objectedData: SelectedDataTypes = {
            itemCode: merged?.[0]?.itemCode,
            itemName: merged?.[0]?.itemName,
            itsQuantity: merged?.[0]?.quantity,
            itIds: itIds
        };
        setSelectedData((prev: any) => ({
            ...prev,
            ...objectedData
        }));
    }

    const handleSelectTRS = (data: any) => {
        const merged: mergedDataTypes = Object.values(
            data.reduce((acc: any, curr: any) => {
                const key = curr.itemCode;
                if (!acc[key]) {
                    acc[key] = { ...curr };
                } else {
                    acc[key].quantity += curr.quantity;
                }
                return acc;
            }, {})
        );

        const trIds: any = data.map((item: any) => item.id)
        const objectedData: SelectedDataTypes = {
            itemCode: merged?.[0]?.itemCode,
            itemName: merged?.[0]?.itemName,
            trsQuantity: merged?.[0]?.quantity,
            trIds: trIds
        };
        setSelectedData((prev: any) => ({
            ...prev,
            ...objectedData
        }));
    }

    const handleModalClose = () => {
        setQuantityDifferenceViewModalOpened(false)
    }

    const handleCreateRemainingTranferReciept = () => {
        dispatch(postCreateRemainingAdjustedTR({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse,
            toWareHouseCode: toWarehouse,
            itemCode: itemCode,
            quantity: (selectedData?.itsQuantity || 0) - (selectedData?.trsQuantity || 0),
            itIds: selectedData?.itIds,
            trIds: selectedData?.trIds,
            resHandler: handleResponse
        })).finally(() => {
            handleModalClose()
        })
    }

    const handleReverseITofTRInReconciliation = () => {
        dispatch(postReverseITofTRInReconciliation({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse,
            toWareHouseCode: toWarehouse,
            itemCode: itemCode,
            quantity: (selectedData?.itsQuantity || 0) - (selectedData?.trsQuantity || 0),
            itIds: selectedData?.itIds,
            trIds: selectedData?.trIds,
            resHandler: handleResponse
        })).finally(() => {
            handleModalClose()
        })
    }

    const handleTransferToLostWarehouse = () => {
        dispatch(postTransferToLostWarehouse({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse,
            toWareHouseCode: toWarehouse,
            itemCode: itemCode,
            quantity: (selectedData?.itsQuantity || 0) - (selectedData?.trsQuantity || 0),
            itIds: selectedData?.itIds,
            trIds: selectedData?.trIds,
            resHandler: handleResponse
        })).finally(() => {
            handleModalClose()
        })
    }

    const handleCreateAdjustedITRInReconciliation = () => {
        dispatch(postCreateAdjustedITRInReconciliation({
            authToken: authenticatedUser?.token as string,
            fromWarehouseCode: fromWarehouse,
            toWareHouseCode: toWarehouse,
            itemCode: itemCode,
            quantity: (selectedData?.trsQuantity || 0) - (selectedData?.itsQuantity || 0),
            itIds: selectedData?.itIds,
            trIds: selectedData?.trIds,
            resHandler: handleResponse
        })).finally(() => {
            handleModalClose()
        })
    }

    // Debouncing For the Search Item Code
    useEffect(() => {
        if (searchItemCode !== null) {
            const interval = setTimeout(() => {
                // dispatch(fetchUnReconciledITSData({
                //     authToken: authenticatedUser?.token as string,
                //     fromWarehouseCode: fromWarehouse ?? '',
                //     toWarehouseCode: toWarehouse ?? '',
                //     date: selectDate ?? '',
                //     itemCode: searchItemCode ?? null,
                // }))

                // dispatch(fetchUnReconciledTRSData({
                //     authToken: authenticatedUser?.token as string,
                //     fromWarehouseCode: fromWarehouse ?? '',
                //     toWarehouseCode: toWarehouse ?? '',
                //     date: selectDate ?? '',
                //     itemCode: searchItemCode ?? "",
                // }))
                dispatch(fetchItemCodesData({
                    authToken: authenticatedUser?.token as string,
                    fromWarehouseCode: fromWarehouse ?? '',
                    toWarehouseCode: toWarehouse ?? '',
                    date: selectDate ?? '',
                    itemCode: searchItemCode
                }))
            }, 2000);
            return () => clearInterval(interval)
        }
    }, [searchItemCode])

    const OnScrollEndPaginateListAllFromWarehouse = (e: any) => {
        const target = e.currentTarget;
        const hasMore = wareHousesList?.data?.length < wareHousesList?.totalCount;
        const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
        if (hasMore && reachedBottom) {
            // const newSkip = (pagination.pageIndex + 1) * pagination.pageSize;
            setScrollFromWarehouseLoading(true)
            const newSkip = 0;
            setWareHouseListPagination((prev) => ({
                pageSize: prev.pageSize + 5,
                pageIndex: prev.pageIndex + 1,
            }));
            dispatch(fetchAllWareHouses({
                authToken: authenticatedUser?.token as string,
                lastCount: wareHouseListPagination.pageSize + 5,
                skipRecords: newSkip,
            })).finally(() => {
                setScrollFromWarehouseLoading(false)
            });
        }
    }

    const OnScrollEndPaginateListAllToWarehouse = (e: any) => {
        const target = e.currentTarget;
        const hasMore = wareHousesList?.data?.length < wareHousesList?.totalCount;
        const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 5;
        if (hasMore && reachedBottom) {
            // const newSkip = (pagination.pageIndex + 1) * pagination.pageSize;
            setScrollToWarehouseLoading(true)
            const newSkip = 0;
            setWareHouseListPagination((prev) => ({
                pageSize: prev.pageSize + 5,
                pageIndex: prev.pageIndex + 1,
            }));
            dispatch(fetchAllWareHouses({
                authToken: authenticatedUser?.token as string,
                lastCount: wareHouseListPagination.pageSize + 5,
                skipRecords: newSkip,
            })).finally(() => {
                setScrollToWarehouseLoading(false)
            });
        }
    }

    if (loading) {
        return <Loader loadingState={loading} />
    }
    return (
        <Box>
            {/* Modals */}
            {(((selectedData?.itsQuantity || 0) - (selectedData?.trsQuantity || 0)) > 0) && <QuantityDifferenceViewModal opened={quantityDifferenceViewModalOpened} handleModalClose={handleModalClose} handleCreateRemainingTranferReciept={handleCreateRemainingTranferReciept} handleReverseITofTRInReconciliation={handleReverseITofTRInReconciliation} handleTransferToLostWarehouse={handleTransferToLostWarehouse} />}
            {(((selectedData?.itsQuantity || 0) - (selectedData?.trsQuantity || 0)) < 0) && <QuantityDifferenceView2Modal opened={quantityDifferenceViewModalOpened} handleModalClose={handleModalClose} handleCreateAdjustedITRInReconciliation={handleCreateAdjustedITRInReconciliation} />}
            {/* Modals End */}
            <Group justify='space-between'>
                <Stack gap={4}>
                    <Title
                        order={2}
                        c={customStyles.colors._4D4D4D}
                        style={{ fontWeight: 700, fontSize: 24 }}
                    >
                        Reconciliation
                    </Title>
                    <Text
                        c={customStyles.colors._909090}
                        style={{ fontWeight: 500, fontSize: 16 }}
                    >
                        Match Inventory Transfers to Transfer Receipts for accurate stock and quantity tracking.
                    </Text>
                </Stack>
                <Group>
                    <Button
                        className="filledButton"
                        variant="transparent"
                        size="md"
                        radius={8}
                        leftSection={<IconCopyCheck size={24} />}
                        onClick={handleAutoReconcile}
                    >
                        Auto Reconcile
                    </Button>
                </Group>
            </Group>

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
                scrollFromWarehouseLoading={scrollFromWarehouseLoading}
                scrollToWarehouseLoading={scrollToWarehouseLoading}
                OnScrollEndPaginateListAllFromWarehouse={OnScrollEndPaginateListAllFromWarehouse}
                OnScrollEndPaginateListAllToWarehouse={OnScrollEndPaginateListAllToWarehouse}
            />


            {/* Reconciliation Not Found Component */}
            {
                (!unReconciledITs?.length && !unReconciledTRs?.length) ? (
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
                        <Stack>
                            <Text m={4} fw={500}>Search By Item Code</Text>
                            <Select
                                placeholder="Select Itemcode"
                                data={selectItemCodesData}
                                value={itemCode}
                                onChange={(value: any) => handleSetItemCode(value)}
                                clearable
                                radius={8}
                                size='md'
                                searchable
                                onSearchChange={setSearchItemCode}
                                width={"100%"}
                            // rightSection={scrollLoading ? <FadeLoader
                            //     height={15}
                            //     width={3}
                            //     margin={1}
                            //     radius={1}
                            //     color="#1b59f8" /> : null}
                            // scrollAreaProps={{
                            //     onScrollEndCapture: (e) => OnScrollEndPaginateListAllWarehouse(e),
                            // }}
                            />
                        </Stack>
                        {/* Reconciliation Inventory Transfer And Transfer Receipt Tables */}
                        <InventoryTransferReceiptTables
                            inventoryTransfer={<InventoryTransferTable
                                data={unReconciledITs}
                                // handleRowClick={handleInventoryTransferDataChange}
                                handleRowClick={() => { }}
                                selectedItems={inventoryTransferData}
                                handleSelectITS={handleSelectITS}
                                itemCode={itemCode}
                            />}
                            transferReceipt={<TransferReceiptTable
                                data={unReconciledTRs}
                                // handleRowClick={handleTransferReceiptDataChange}
                                handleRowClick={() => { }}
                                selectedItems={transferReceiptData}
                                handleSelectTRS={handleSelectTRS}
                                itemCode={itemCode}
                            />}
                        />

                        {/* Reconciliation Action Bar */}
                        {/* <ReconciliationActionBar handleAutoReconcile={handleAutoReconcile} /> */}

                        {/* Reconciliation Quantity Difference Table */}
                        <ReconciliationQuantityDifferenceTable
                            data={[selectedData]}
                            handleQuantityDifferenceViewModalOpened={() => setQuantityDifferenceViewModalOpened(true)}
                        />
                    </>
                )
            }
        </Box >
    )
}

export default ReconciliationComponent