import React, { memo, useState, FC, useEffect } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchListAllReservation } from '@/redux/actions/picking-actions/picking-actions';
import PickingPostedViewDetailsModal from '../modals/picking-posted-view-details-modal/PickingPostedViewDetailsModal';
import PickingOrderPosted_Reservation_Columns from '../columns/PickingOrderPosted_Reservation_Columns';
import { IconFileImport } from '@tabler/icons-react';
import PickingOrderPosted_Outbound_Columns from '../columns/PickingOrderPosted_Outbound_Columns';

const listOutbound = [
    {
        delivery: "881000109",
        item: 20,
        material: "1400000049",
        itemDescription: "MELAMINE GLAZING POWDER - 20",
        itemCategory: "NLN",
        batch: "",
        plant: "1200",
        storageLocation: "FG20",
        deliveryQuantity: 200000,
        baseUom: "KG",
        referenceDocument: "4800003525",
        movementType: "641",
        precedingDocCateg: "V",
        itemOverallStatus: "A",
        itemGoodsMovementSts: "A"
    }
]

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
    const [headerBtnType, setHeaderBtnType] = useState<"Reservation" | "Outbound">("Reservation");

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

    const reservationColumns = PickingOrderPosted_Reservation_Columns({
        pagination, list: ListAllReservation?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            // handlePost: handlePost,
            handlePost: () => { },
        }
    })

    const outboundColumns = PickingOrderPosted_Outbound_Columns({
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
            <Group justify='space-between'>
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
                        borderRadius: "5px",
                        overflow: 'hidden',
                    }}
                >
                    <Button
                        variant="transparent"
                        radius={0}
                        size="md"
                        w={250}
                        onClick={() => setHeaderBtnType("Reservation")}
                        style={{
                            backgroundColor: headerBtnType === "Reservation" ? "#DEE4F5" : "white",
                            overflow: "hidden"
                        }}
                        color={customStyles.colors._1B59F8}
                    >
                        Reservation
                    </Button>

                    <Button
                        variant="transparent"
                        className={headerBtnType === "Outbound" ? "myFilledButton" : "myOutlineButton"}
                        radius={0}
                        size="md"
                        w={250}
                        onClick={() => setHeaderBtnType("Outbound")}
                        style={{
                            borderLeftWidth: 1,
                            borderLeftColor: "#228be6",
                            backgroundColor: headerBtnType === "Outbound" ? "#DEE4F5" : "white",
                            overflow: "hidden"
                        }}
                        color={customStyles.colors._1B59F8}
                    >
                        Outbound
                    </Button>
                </Group>
                <Group gap={0}>
                    <Button
                        variant='transparent'
                        className='filledButton'
                        radius={8}
                        size='md'
                        leftSection={<IconFileImport size={24} />}
                        onClick={handleExportToCSV}
                    >
                        Export To CSV
                    </Button>
                </Group>
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
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />}


            {/* Table */}
            {headerBtnType === "Outbound" && <TanStackTable
                data={Array.isArray(listOutbound) ? listOutbound : []}
                dataCount={listOutbound?.length}
                columns={outboundColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Posted Picking Orders"}
                subTitle={"Track and review picking order seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />}
        </Stack>
    );
};

export default memo(PickingPostedComponent);