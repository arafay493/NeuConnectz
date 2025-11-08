import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import StockTransferOrderUnPosted_Columns from '../columns/StockTransferOrderUnposted_Columns';
import StockTransferOrderPosted_Columns from '../columns/StockTransferOrderPosted_Columsn';

// export interface GoodsIssueDataType {
//     docNum: number,
//     whsCode: string,
//     itemCode: string,
//     itemName: string,
//     binCode: string,
//     quantity: number,
//     resource: string,
//     uoM: string,
//     barCode: string
// }

type ApiProp = {
    apiUrl: string;
};

const StockTransferPostedComponent: FC<ApiProp> = ({ apiUrl }) => {
    console.log("API URL Unposted:", apiUrl);

    // Note: Handling states here...!
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Note: Table modal state...!
    // const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    // const [isClosePOModalOpen, setIsClosePOModalOpen] = useState(false);
    // const [rowData, setRowData] = useState<GoodsIssueDataType | null>(null);

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;

    // Note: Handeling redux here...!
    // const dispatch = useAppDispatch();
    // const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    // const { listGoodIssue, totalCount } = useAppSelector(({ gIStates }) => { return gIStates });
    // // console.log("productionOrdersList: ", productionOrdersList);

    // useEffect(() => {
    //     if (authenticatedUser?.token) {
    //         setIsLoading(true);
    //         const skipRecord = pagination.pageIndex * pagination.pageSize;

    //         dispatch(fetchAllGoodsIssue({
    //             token: authenticatedUser?.token || '',
    //             apiUrl: apiUrl,
    //             lastCount: pagination.pageSize, // Use page size for server-side pagination
    //             skipRecords: skipRecord
    //         })).finally(() => {
    //             setIsLoading(false)
    //         });
    //     };
    // }, [authenticatedUser, dispatch, apiUrl, pagination.pageIndex, pagination.pageSize]);

    const stockTransferOrderList = [
        {
            id: 1,
            type: "Transfer",
            number: "STO-0001",
            itemCode: "ITM-1001",
            fromPlantCode: "PLT-01",
            fromWarehouse: "WH-A1",
            fromStorageLocation: "LOC-01",
            fromStorageType: "TYPE-A",
            fromStorageSection: "SEC-01",
            fromBin: "BIN-001",
            toPlantCode: "PLT-02",
            toWarehouse: "WH-B1",
            toStorageLocation: "LOC-02",
            toStorageType: "TYPE-B",
            toStorageSection: "SEC-02",
            toBin: "BIN-002",
            username: "rafay.k",
            erpDocEntry: "ERP-1001",
            erpLineId: "LINE-01",
            date: "2025-11-08T10:30:00Z",
        },
        {
            id: 2,
            type: "Transfer",
            number: "STO-0002",
            itemCode: "ITM-1002",
            fromPlantCode: "PLT-01",
            fromWarehouse: "WH-A2",
            fromStorageLocation: "LOC-03",
            fromStorageType: "TYPE-A",
            fromStorageSection: "SEC-03",
            fromBin: "BIN-003",
            toPlantCode: "PLT-03",
            toWarehouse: "WH-C1",
            toStorageLocation: "LOC-04",
            toStorageType: "TYPE-C",
            toStorageSection: "SEC-04",
            toBin: "BIN-004",
            username: "ali.h",
            erpDocEntry: "ERP-1002",
            erpLineId: "LINE-02",
            date: "2025-11-07T14:45:00Z",
        },
        {
            id: 3,
            type: "Return",
            number: "STO-0003",
            itemCode: "ITM-1003",
            fromPlantCode: "PLT-02",
            fromWarehouse: "WH-B1",
            fromStorageLocation: "LOC-05",
            fromStorageType: "TYPE-B",
            fromStorageSection: "SEC-05",
            fromBin: "BIN-005",
            toPlantCode: "PLT-01",
            toWarehouse: "WH-A1",
            toStorageLocation: "LOC-06",
            toStorageType: "TYPE-A",
            toStorageSection: "SEC-06",
            toBin: "BIN-006",
            username: "fatima.s",
            erpDocEntry: "ERP-1003",
            erpLineId: "LINE-03",
            date: "2025-11-06T09:20:00Z",
        },
        {
            id: 4,
            type: "Transfer",
            number: "STO-0004",
            itemCode: "ITM-1004",
            fromPlantCode: "PLT-03",
            fromWarehouse: "WH-C1",
            fromStorageLocation: "LOC-07",
            fromStorageType: "TYPE-C",
            fromStorageSection: "SEC-07",
            fromBin: "BIN-007",
            toPlantCode: "PLT-04",
            toWarehouse: "WH-D1",
            toStorageLocation: "LOC-08",
            toStorageType: "TYPE-D",
            toStorageSection: "SEC-08",
            toBin: "BIN-008",
            username: "umar.q",
            erpDocEntry: "ERP-1004",
            erpLineId: "LINE-04",
            date: "2025-11-05T16:10:00Z",
        },
        {
            id: 5,
            type: "Return",
            number: "STO-0005",
            itemCode: "ITM-1005",
            fromPlantCode: "PLT-04",
            fromWarehouse: "WH-D1",
            fromStorageLocation: "LOC-09",
            fromStorageType: "TYPE-D",
            fromStorageSection: "SEC-09",
            fromBin: "BIN-009",
            toPlantCode: "PLT-01",
            toWarehouse: "WH-A1",
            toStorageLocation: "LOC-10",
            toStorageType: "TYPE-A",
            toStorageSection: "SEC-10",
            toBin: "BIN-010",
            username: "hassan.t",
            erpDocEntry: "ERP-1005",
            erpLineId: "LINE-05",
            date: "2025-11-04T11:00:00Z",
        },
    ];

    const columns = StockTransferOrderPosted_Columns({ pagination, stockTransferOrderList })

    return (
        <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
            <TanStackTable
                data={Array.isArray(stockTransferOrderList) ? stockTransferOrderList : []}
                dataCount={stockTransferOrderList?.length}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Posted Stock Transfer"}
                subTitle={"Track and review stock transfer order seemlessly."}
                skipRecord={skipRecord}
            />
        </Stack>
    );
};

export default memo(StockTransferPostedComponent);