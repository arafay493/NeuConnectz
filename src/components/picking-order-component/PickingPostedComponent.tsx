import React, { memo, useState, FC, useEffect } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import PutAwayOrderUnPosted_Columns from '../columns/PutAwayOrderUnPosted_Columns';
import PickingUnPostedViewDetailsModal from '../modals/picking-unposted-view-details-modal/PickingUnPostedViewDetailsModal';
import PickingOrderUnPosted_Reservation_Columns from '../columns/PickingOrderUnPosted_Reservation_Columns';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchListAllPutAway } from '@/redux/actions/putaway-actions/putaway-actions';
import { fetchListAllReservation } from '@/redux/actions/picking-actions/picking-actions';
import PickingPostedViewDetailsModal from '../modals/picking-posted-view-details-modal/PickingPostedViewDetailsModal';

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
    reservationApiUrl: string
};

const PickingPostedComponent: FC<ApiProp> = ({ apiUrl, reservationApiUrl }) => {
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
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [headerBtnType, setHeaderBtnType] = useState<"Reservation" | "Inbound">("Reservation");

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { ListAllReservation } = useAppSelector(({ pickingStates }) => { return pickingStates });
    // // console.log("productionOrdersList: ", productionOrdersList);

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            // const skipRecord = pagination.pageIndex * pagination.pageSize;

            dispatch(fetchListAllReservation({
                authToken: authenticatedUser?.token || '',
                apiUrl: reservationApiUrl,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        };
    }, [authenticatedUser, dispatch, apiUrl, pagination.pageIndex, pagination.pageSize]);

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

    const reservationColumns = PickingOrderUnPosted_Reservation_Columns({
        pagination, list: ListAllReservation?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            // handlePost: handlePost,
            handlePost: () => { },
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
            <PickingPostedViewDetailsModal
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

            {/* Tabs */}
            <Group
                justify={customStyles.alignment.left}
                // mb="sm"
                // mb={-20}
                gap={0}
                className="tabGroup"
                style={{
                    display: "flex",
                    alignItems: customStyles.alignment.center,
                    border: "1px solid",
                    borderColor: customStyles.colors._1B59F8,
                    borderRadius: "5px"
                }}
            >
                <Button
                    variant="transparent"
                    radius={0}
                    size="md"
                    flex={1}
                    onClick={() => setHeaderBtnType("Reservation")}
                    style={{
                        backgroundColor: headerBtnType === "Reservation" ? "#DEE4F5" : "white"
                    }}
                    color={customStyles.colors._1B59F8}
                >
                    Reservation
                </Button>

                <Button
                    variant="transparent"
                    className={headerBtnType === "Inbound" ? "myFilledButton" : "myOutlineButton"}
                    radius={0}
                    size="md"
                    flex={1}
                    onClick={() => setHeaderBtnType("Inbound")}
                    style={{
                        borderLeftWidth: 1,
                        borderLeftColor: "#228be6",
                        backgroundColor: headerBtnType === "Inbound" ? "#DEE4F5" : "white"
                    }}
                    color={customStyles.colors._1B59F8}
                >
                    Inbound
                </Button>
            </Group>

            {/* <TanStackTable
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
            /> */}


            {/* Table */}
            {headerBtnType === "Reservation" && <TanStackTable
                data={Array.isArray(ListAllReservation?.data) ? ListAllReservation?.data : []}
                dataCount={ListAllReservation?.totalCount}
                columns={reservationColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Posted Picking Orders"}
                subTitle={"Track and review picking order seemlessly."}
                skipRecord={skipRecord}
                isCsvExport={true}
                handleExportToCSV={handleExportToCSV}
            />}


            {/* Table */}
            {headerBtnType === "Inbound" && <TanStackTable
                data={Array.isArray(ListAllReservation?.data) ? ListAllReservation?.data : []}
                dataCount={ListAllReservation?.totalCount}
                columns={reservationColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Posted Picking Orders"}
                subTitle={"Track and review picking order seemlessly."}
                skipRecord={skipRecord}
                isCsvExport={true}
                handleExportToCSV={handleExportToCSV}
            />}
        </Stack>
    );
};

export default memo(PickingPostedComponent);