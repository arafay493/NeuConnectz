import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import PutAwayOrderUnPosted_Columns from '../columns/PutAwayOrderUnPosted_Columns';
import PickingUnPostedViewDetailsModal from '../modals/picking-unposted-view-details-modal/PickingUnPostedViewDetailsModal';

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

const PickingUnPostedComponent: FC<ApiProp> = ({ apiUrl }) => {
    console.log("API URL Unposted:", apiUrl);

    // Note: Handling states here...!
    const [isLoading, setIsLoading] = useState(false);
    const [isViewLoading, setIsViewLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [paginationViewDetails, setPaginationViewDetails] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Note: Table modal state...!
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

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

    const pickingOrderList = [
        {
            id: 1,
            documentNumber: "DOC-0001",
            materialCode: "MAT-1001",
            materialName: "Steel Rod",
            uom: "KG",
            quantity: 120,
            movementType: "Transfer",
            purchaseOrder: "PO-5001",
            suppliers: "ABC Suppliers",
            reservationNumber: "RES-001",
            inboundDeliveryNumber: "INB-1001",
            sourceBin: "BIN-001",
            date: "2025-11-08T10:30:00Z",
            status: "Unconfirmed",
            actions: null
        },
        {
            id: 2,
            documentNumber: "DOC-0002",
            materialCode: "MAT-1002",
            materialName: "Copper Sheets",
            uom: "PCS",
            quantity: 300,
            movementType: "Transfer",
            purchaseOrder: "PO-5002",
            suppliers: "Global Metals",
            reservationNumber: "RES-002",
            inboundDeliveryNumber: "INB-1002",
            sourceBin: "BIN-003",
            date: "2025-11-07T14:45:00Z",
            status: "Unconfirmed",
            actions: null
        },
        {
            id: 3,
            documentNumber: "DOC-0003",
            materialCode: "MAT-1003",
            materialName: "Plastic Granules",
            uom: "BAG",
            quantity: 50,
            movementType: "Return",
            purchaseOrder: "PO-5003",
            suppliers: "PolyTech",
            reservationNumber: "RES-003",
            inboundDeliveryNumber: "INB-1003",
            sourceBin: "BIN-005",
            date: "2025-11-06T09:20:00Z",
            status: "Unconfirmed",
            actions: null
        },
        {
            id: 4,
            documentNumber: "DOC-0004",
            materialCode: "MAT-1004",
            materialName: "Aluminum Blocks",
            uom: "BOX",
            quantity: 80,
            movementType: "Transfer",
            purchaseOrder: "PO-5004",
            suppliers: "MetalX Industries",
            reservationNumber: "RES-004",
            inboundDeliveryNumber: "INB-1004",
            sourceBin: "BIN-007",
            date: "2025-11-05T16:10:00Z",
            status: "Unconfirmed",
            actions: null
        },
        {
            id: 5,
            documentNumber: "DOC-0005",
            materialCode: "MAT-1005",
            materialName: "Rubber Sheets",
            uom: "ROLL",
            quantity: 40,
            movementType: "Return",
            purchaseOrder: "PO-5005",
            suppliers: "FlexRubber Co.",
            reservationNumber: "RES-005",
            inboundDeliveryNumber: "INB-1005",
            sourceBin: "BIN-009",
            date: "2025-11-04T11:00:00Z",
            status: "Unconfirmed",
            actions: null
        }
    ];

    const handleModalClose = () => {
        setIsConfirmModalOpen(false)
        setIsViewDetailsModalOpen(false)
    }

    const handleConfirm = () => {
        setIsConfirmModalOpen(false)
    }

    const handleConfirmModalOpen = (rowData: any) => {
        setIsConfirmModalOpen(true)
    }

    const handleViewDetailsModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
        setIsViewDetailsModalOpen(true)
    }
    const columns = PutAwayOrderUnPosted_Columns({
        pagination, pickingOrderList, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
        }
    })

    const handleExportToCSV = () => {
        console.log("Export to CSV Running.............")
    }

    return (
        <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
            {/* Confirm Modal */}
            <ConfirmModal description='By Confirming this will be posted.' handleCancel={handleModalClose} handleConfirm={handleConfirm} handleModalClose={handleModalClose} opened={isConfirmModalOpen} />
            {/* View Modal */}
            <PickingUnPostedViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Picking Unposted"}
                skipRecord={skipRecordViewDetails}
                apiUrl={"apiUrlAgainstPO"}
                poNumber={0}
            />

            <TanStackTable
                data={Array.isArray(pickingOrderList) ? pickingOrderList : []}
                dataCount={pickingOrderList?.length}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Unposted Picking Orders"}
                subTitle={"Track and review stock transfer order seemlessly."}
                skipRecord={skipRecord}
                isCsvExport={true}
                handleExportToCSV={handleExportToCSV}
            />
        </Stack>
    );
};

export default memo(PickingUnPostedComponent);