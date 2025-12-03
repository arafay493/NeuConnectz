import React, { memo, useState, FC, useEffect } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import PickingUnPostedViewDetailsModal from '../modals/picking-unposted-view-details-modal/PickingUnPostedViewDetailsModal';
import PickingOrderUnPosted_Reservation_Columns from '../columns/PickingOrderUnPosted_Reservation_Columns';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { confirmPickingReservationOrders, fetchListAllOutbounds, fetchListAllReservation, postPickingReservationOrders } from '@/redux/actions/picking-actions/picking-actions';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '../loader/loader';
import { ToastMessage } from '@/utils/ToastMessage';
import { IconFileImport } from '@tabler/icons-react';
import PickingOrderUnPosted_Outbound_Columns from '../columns/PickingOrderUnPosted_Outbound_Columns';

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
    outboundApiUrl: string
};

const PickingUnPostedComponent: FC<ApiProp> = ({ apiUrl, reservationApiUrl, outboundApiUrl }) => {
    console.log("API URL Unposted:", apiUrl);

    // Note: Handling states here...!
    const [isLoading, setIsLoading] = useState(false);
    const [isFullPageLoading, setIsFullPageLoading] = useState(false);
    const [isViewLoading, setIsViewLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [paginationOutbound, setPaginationOutbound] = useState<PaginationState>({
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
    const skipRecordOutbound = paginationOutbound.pageIndex * paginationOutbound.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { ListAllReservation, ListAllOutbound } = useAppSelector(({ pickingStates }) => { return pickingStates });
    // // console.log("productionOrdersList: ", productionOrdersList);

    useEffect(() => {
        if (authenticatedUser?.token && headerBtnType === "Reservation") {
            // Reservation
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
        }
        else if (authenticatedUser?.token && headerBtnType === "Outbound") {
            // Outbound
            setIsLoading(true);
            // const skipRecord = pagination.pageIndex * pagination.pageSize;

            dispatch(fetchListAllOutbounds({
                authToken: authenticatedUser?.token || '',
                apiUrl: outboundApiUrl,
                lastCount: paginationOutbound.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecordOutbound
            })).finally(() => {
                setIsLoading(false)
            });
        };
    }, [authenticatedUser, dispatch, apiUrl, pagination.pageIndex, pagination.pageSize, paginationOutbound.pageSize, paginationOutbound.pageIndex, headerBtnType]);

    const handleModalClose = () => {
        setIsConfirmModalOpen(false)
        setIsViewDetailsModalOpen(false)
    }

    const handleConfirm = () => {
        setIsFullPageLoading(true)
        dispatch(confirmPickingReservationOrders({
            payload: {
                reservationNumber: String(selectedRow?.reservationNumber)
            },
            token: authenticatedUser?.token || '',
            resHandler: handleReservationResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllReservation({
                authToken: authenticatedUser?.token || '',
                apiUrl: reservationApiUrl,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        })
        setIsConfirmModalOpen(false)
    }

    const handlePostReservation = (rowData: any) => {
        handleModalClose()
        setIsFullPageLoading(true)
        dispatch(postPickingReservationOrders({
            payload: {
                docNums: [String(rowData?.docNum)]
            },
            token: authenticatedUser?.token || '',
            resHandler: handlePostReservationResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllReservation({
                authToken: authenticatedUser?.token || '',
                apiUrl: reservationApiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        })
    }

    const handleConfirmModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
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
            handlePost: handlePostReservation,
            // handlePost: () => { },
        }
    })

    const outboundColumns = PickingOrderUnPosted_Outbound_Columns({
        pagination, list: ListAllOutbound?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            // handlePost: handlePostReservation,
            handlePost: () => { },
        }
    })

    const handleReservationResponse = (status: number, data: any, error: string) => {
        if (status === 200) {
            showNotificationToast("Confirm Reservation", data.message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
        }
    }

    const handlePostReservationResponse = (status: number, message: string, error: string) => {
        if (status === 201) {
            ToastMessage("Reservation Post", message, status, error)
            // showNotificationToast("Reservation Post", message, customStyles.colors._408CCE);
        } else {
            ToastMessage("Error", message, status, error)
        }
    }

    const handleExportToCSV = () => {
        console.log("Export to CSV Running.............")
    }

    if (isFullPageLoading) {
        return <Loader loadingState={isFullPageLoading} />
    }


    return (
        <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
            {/* Confirm Modal */}
            <ConfirmModal description='Are you sure you want to proceed? This action cannot be undone.' handleCancel={handleModalClose} handleConfirm={handleConfirm} handleModalClose={handleModalClose} opened={isConfirmModalOpen} />
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

            {/* Table */}
            {headerBtnType === "Reservation" && <TanStackTable
                data={Array.isArray(ListAllReservation?.data) ? ListAllReservation?.data : []}
                dataCount={ListAllReservation?.totalCount}
                columns={reservationColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Unposted Picking Orders"}
                subTitle={"Track and review picking order seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />}


            {/* Table */}
            {headerBtnType === "Outbound" && <TanStackTable
                data={Array.isArray(ListAllOutbound?.data) ? ListAllOutbound?.data : []}
                dataCount={ListAllOutbound?.totalCount}
                columns={outboundColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPaginationOutbound}
                title={" Unposted Picking Orders"}
                subTitle={"Track and review picking order seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />}
        </Stack>
    );
};

export default memo(PickingUnPostedComponent);