import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import PickingUnPostedViewDetailsModal from '../modals/picking-unposted-view-details-modal/PickingUnPostedViewDetailsModal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { confirmBinToBinTransferOrders, confirmPickingOutBoundOrders, confirmPickingSalesOrders, deleteBinToBinTransferOrders, fetchListAllBinToBin, fetchListAllOutbounds, fetchListAllSalesOrder, postBinToBinTransferOrders, postPickingOutBoundOrders, postPickingSalesOrders } from '@/redux/actions/bin-to-bin-actions/bin-to-bin-actions';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '../loader/loader';
import { ToastMessage } from '@/utils/ToastMessage';
import PickingOrderUnPosted_Outbound_Columns from '../columns/PickingOrderUnPosted_Outbound_Columns';
import PickingOrderUnPosted_Sales_Order_Columns from '../columns/PickingOrderUnPosted_Sales_Order_Columns';
import { useMediaQuery } from '@mantine/hooks';
import BinToBinTransferOrderUnPosted_Columns from '../columns/BinToBinTransferOrderUnPosted_Columns';
import DeleteModal from '../modals/delete-modal/DeleteModal';
import BinToBinViewDetailsModal from '../modals/bin-to-bin-view-details-modal/BinToBinViewDetailsModal';

type ApiProp = {
    apiUrl: string;
    reservationApiUrl: string
    outboundApiUrl: string,
    salesOrderApiUrl: string,
};

const BinToBinTransferOrderUnPostedComponent: FC<ApiProp> = ({ apiUrl, reservationApiUrl, outboundApiUrl, salesOrderApiUrl }) => {
    const isTabletView = useMediaQuery('(max-width: 968px)'); // TRUE below 968px
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
    const [paginationSalesOrder, setPaginationSalesOrder] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [paginationViewDetails, setPaginationViewDetails] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Note: Table modal state...!
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [headerBtnType, setHeaderBtnType] = useState<"Reservation" | "Outbound" | "SalesOrder">("Reservation");

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordOutbound = paginationOutbound.pageIndex * paginationOutbound.pageSize;
    const skipRecordSalesOrder = paginationSalesOrder.pageIndex * paginationSalesOrder.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    // const { ListAllReservation, ListAllOutbound, ListAllSalesOrder } = useAppSelector(({ pickingStates }) => { return pickingStates });
    const { ListAllBinToBin, ListAllOutbound, ListAllSalesOrder } = useAppSelector(({ binToBinStates }) => { return binToBinStates });
    // // console.log("productionOrdersList: ", productionOrdersList);

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            dispatch(fetchListAllBinToBin({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        }
        // else if (authenticatedUser?.token && headerBtnType === "Outbound") {
        //     // Outbound
        //     setIsLoading(true);
        //     // const skipRecord = pagination.pageIndex * pagination.pageSize;

        //     dispatch(fetchListAllOutbounds({
        //         authToken: authenticatedUser?.token || '',
        //         apiUrl: outboundApiUrl,
        //         lastCount: paginationOutbound.pageSize, // Use page size for server-side pagination
        //         skipRecords: skipRecordOutbound
        //     })).finally(() => {
        //         setIsLoading(false)
        //     });
        // }
        // else if (authenticatedUser?.token && headerBtnType === "SalesOrder") {
        //     // Outbound
        //     setIsLoading(true);
        //     // const skipRecord = pagination.pageIndex * pagination.pageSize;

        //     dispatch(fetchListAllSalesOrder({
        //         authToken: authenticatedUser?.token || '',
        //         apiUrl: salesOrderApiUrl,
        //         lastCount: paginationSalesOrder.pageSize, // Use page size for server-side pagination
        //         skipRecords: skipRecordSalesOrder
        //     })).finally(() => {
        //         setIsLoading(false)
        //     });
        // }
    }, [authenticatedUser, dispatch, apiUrl, pagination.pageIndex, pagination.pageSize, paginationOutbound.pageSize, paginationOutbound.pageIndex, paginationSalesOrder.pageSize, paginationSalesOrder.pageIndex, headerBtnType]);

    const handleModalClose = () => {
        setIsConfirmModalOpen(false)
        setIsViewDetailsModalOpen(false)
        setIsDeleteModalOpen(false)
    }

    const handleConfirm = () => {
        // if (headerBtnType === "Reservation") {
        setIsFullPageLoading(true)
        dispatch(confirmBinToBinTransferOrders({
            payload: {
                docNum: Number(selectedRow?.docNum)
            },
            token: authenticatedUser?.token || '',
            resHandler: handleBinToBinResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllBinToBin({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        })
        setIsConfirmModalOpen(false)
        // } 
        // else if (headerBtnType === "Outbound") {
        //     setIsFullPageLoading(true)
        //     dispatch(confirmPickingOutBoundOrders({
        //         payload: {
        //             docNum: selectedRow?.docNum
        //         },
        //         token: authenticatedUser?.token || '',
        //         resHandler: handleOutboundResponse
        //     })).finally(() => {
        //         setIsFullPageLoading(false)
        //         setIsLoading(true);
        //         dispatch(fetchListAllOutbounds({
        //             authToken: authenticatedUser?.token || '',
        //             apiUrl: outboundApiUrl,
        //             lastCount: paginationOutbound.pageSize,
        //             skipRecords: skipRecordOutbound
        //         })).finally(() => {
        //             setIsLoading(false)
        //         });
        //     })
        //     setIsConfirmModalOpen(false)
        // } else if (headerBtnType === "SalesOrder") {
        //     setIsFullPageLoading(true)
        //     dispatch(confirmPickingSalesOrders({
        //         payload: {
        //             docNum: selectedRow?.docNum
        //         },
        //         token: authenticatedUser?.token || '',
        //         resHandler: handleSalesOrderResponse
        //     })).finally(() => {
        //         setIsFullPageLoading(false)
        //         setIsLoading(true);
        //         dispatch(fetchListAllSalesOrder({
        //             authToken: authenticatedUser?.token || '',
        //             apiUrl: salesOrderApiUrl,
        //             lastCount: paginationSalesOrder.pageSize,
        //             skipRecords: skipRecordSalesOrder
        //         })).finally(() => {
        //             setIsLoading(false)
        //         });
        //     })
        //     setIsConfirmModalOpen(false)
        // }
    }

    const handlePostBinToBin = (rowData: any) => {
        handleModalClose()
        setIsFullPageLoading(true)
        dispatch(postBinToBinTransferOrders({
            payload: {
                id: String(rowData?.id)
            },
            token: authenticatedUser?.token || '',
            resHandler: handlePostBinToBinResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllBinToBin({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        })
    }

    const handleDelete = () => {
        if (headerBtnType === "Reservation") {
            handleModalClose()
            setIsFullPageLoading(true)
            dispatch(deleteBinToBinTransferOrders({
                apiUrl: `/IBinManagementFeature/DeleteBinRecord?docNum=${selectedRow?.docNum}`,
                token: authenticatedUser?.token || '',
                resHandler: handleDeleteResponse
            })).finally(() => {
                setIsFullPageLoading(false)
                setIsLoading(true);
                dispatch(fetchListAllBinToBin({
                    authToken: authenticatedUser?.token || '',
                    apiUrl: apiUrl,
                    lastCount: pagination.pageSize,
                    skipRecords: skipRecord
                })).finally(() => {
                    setIsLoading(false)
                });
            })
        }
        // else if (headerBtnType === "Outbound") {
        //     handleModalClose()
        //     setIsFullPageLoading(true)
        //     dispatch(deletePickingOrders({
        //         apiUrl: `/IStockTransferOrderFeature/DeleteSto?docNum=${selectedRow?.docNum}`,
        //         token: authenticatedUser?.token || '',
        //         resHandler: handleDeleteResponse
        //     })).finally(() => {
        //         setIsFullPageLoading(false)
        //         setIsLoading(true);
        //         dispatch(fetchListAllOutbounds({
        //             authToken: authenticatedUser?.token || '',
        //             apiUrl: outboundApiUrl,
        //             lastCount: paginationOutbound.pageSize,
        //             skipRecords: skipRecordOutbound
        //         })).finally(() => {
        //             setIsLoading(false)
        //         });
        //     })
        // } else if (headerBtnType === "SalesOrder") {
        //     handleModalClose()
        //     setIsFullPageLoading(true)
        //     dispatch(deletePickingOrders({
        //         apiUrl: `/ISalesOrderFeature/DeleteSalesOrder?docNum=${selectedRow?.docNum}`,
        //         token: authenticatedUser?.token || '',
        //         resHandler: handleDeleteResponse
        //     })).finally(() => {
        //         setIsFullPageLoading(false)
        //         setIsLoading(true);
        //         dispatch(fetchListAllSalesOrder({
        //             authToken: authenticatedUser?.token || '',
        //             apiUrl: salesOrderApiUrl,
        //             lastCount: paginationSalesOrder.pageSize, // Use page size for server-side pagination
        //             skipRecords: skipRecordSalesOrder
        //         })).finally(() => {
        //             setIsLoading(false)
        //         });
        //     })
        // }
    }

    const handlePostOutbound = (rowData: any) => {
        handleModalClose()
        setIsFullPageLoading(true)
        dispatch(postPickingOutBoundOrders({
            payload: {
                docNum: rowData?.docNum
            },
            token: authenticatedUser?.token || '',
            resHandler: handlePostOutboundResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllOutbounds({
                authToken: authenticatedUser?.token || '',
                apiUrl: outboundApiUrl,
                lastCount: paginationOutbound.pageSize,
                skipRecords: skipRecordOutbound
            })).finally(() => {
                setIsLoading(false)
            });
        })
    }

    const handlePostSalesOrder = (rowData: any) => {
        handleModalClose()
        setIsFullPageLoading(true)
        dispatch(postPickingSalesOrders({
            payload: {
                docNum: rowData?.docNum
            },
            token: authenticatedUser?.token || '',
            resHandler: handlePostSalesOrderResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllSalesOrder({
                authToken: authenticatedUser?.token || '',
                apiUrl: salesOrderApiUrl,
                lastCount: paginationSalesOrder.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecordSalesOrder
            })).finally(() => {
                setIsLoading(false)
            });
        })
    }

    const handleDeleteModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
        setIsConfirmModalOpen(true)
    }

    const handleViewDetailsModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
        setIsViewDetailsModalOpen(true)
    }

    const columns = BinToBinTransferOrderUnPosted_Columns({
        pagination, list: ListAllBinToBin?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            handlePost: handlePostBinToBin,
            handleDelete: handleDeleteModalOpen
            // handlePost: () => { },
        }
    })

    const outboundColumns = PickingOrderUnPosted_Outbound_Columns({
        pagination, list: ListAllOutbound?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            handlePost: handlePostOutbound,
            // handlePost: () => { },
        }
    })

    const salesOrderColumns = PickingOrderUnPosted_Sales_Order_Columns({
        pagination, list: ListAllSalesOrder?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            handlePost: handlePostSalesOrder,
            // handlePost: () => { },
        }
    })

    const handleBinToBinResponse = (status: number, data: any, error: string) => {
        if (status === 200) {
            showNotificationToast("Confirm Bin To Bin Transfer", data.message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
        }
    }

    const handleOutboundResponse = (status: number, data: any, error: string) => {
        if (status === 200) {
            showNotificationToast("Confirm Outbound", data.message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
        }
    }

    const handleSalesOrderResponse = (status: number, data: any, error: string) => {
        if (status === 200) {
            showNotificationToast("Confirm Sale Order", data.message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
        }
    }

    const handlePostBinToBinResponse = (status: number, message: string, error: string) => {
        if (status === 201) {
            if (!error) {
                ToastMessage("Bin To Bin Transfer Post", message, status, "")
            } else {
                ToastMessage("Bin To Bin Transfer Post", message, status, error)
            }
            // showNotificationToast("Reservation Post", message, customStyles.colors._408CCE);
        } else {
            ToastMessage("Error", message, status, error)
        }
    }

    const handlePostOutboundResponse = (status: number, message: string, error: string) => {
        if (status === 201) {
            ToastMessage("Outbound Post", message, status, error)
            // showNotificationToast("Reservation Post", message, customStyles.colors._408CCE);
        } else {
            ToastMessage("Error", message, status, error)
        }
    }

    const handlePostSalesOrderResponse = (status: number, message: string, error: string) => {
        if (status === 201) {
            ToastMessage("Sale Order Post", message, status, error)
            // showNotificationToast("Reservation Post", message, customStyles.colors._408CCE);
        } else {
            ToastMessage("Error", message, status, error)
        }
    }

    const handleDeleteResponse = (status: number, message: string, error: string) => {
        if (status === 200) {
            ToastMessage("Bin To Bin Transfer Delete", message, status, error)
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
        // <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
        <Stack>
            {/* Confirm Modal */}
            <ConfirmModal description='Are you sure you want to proceed? This action cannot be undone.' handleCancel={handleModalClose} handleConfirm={handleConfirm} handleModalClose={handleModalClose} opened={isConfirmModalOpen} />
            {/* Delete Modal */}
            <DeleteModal description='Are you sure you want to proceed? This action cannot be undone.' opened={isDeleteModalOpen} handleCancel={handleModalClose} handleConfirm={handleDelete} handleModalClose={handleModalClose} />
            {/* View Modal */}
            <BinToBinViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Bin To Bin Transfer Unposted"}
                subTitle={"Confirm transfer orders for bin to bin transfer."}
                skipRecord={skipRecordViewDetails}
                apiUrl={headerBtnType === "Outbound" ? "/IStockTransferOrderFeature/GetDetailsOfSto" : headerBtnType === "SalesOrder" ? "/ISalesOrderFeature/GetDetailsOfSalesOrder" : "/IBinManagementFeature/GetDetailsofBinTransfer"}
                docNumber={selectedRow?.docNum}
                isPosted={false}
                isReservation={headerBtnType === "Reservation"}
            />

            {/* Tabs */}
            {/* <Group justify='space-between'>
                <Group
                    justify={customStyles.alignment.left}
                    // mb="sm"
                    // mb={-20}
                    gap={0}
                    className="tabGroup"
                    style={{
                        display: "flex",
                        flexDirection: isTabletView ? "column" : "row",
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
                            borderLeftWidth: !isTabletView ? 1 : 0,
                            borderLeftColor: "#228be6",
                            backgroundColor: headerBtnType === "Outbound" ? "#DEE4F5" : "white",
                            overflow: "hidden"
                        }}
                        color={customStyles.colors._1B59F8}
                    >
                        Outbound
                    </Button>

                    <Button
                        variant="transparent"
                        className={headerBtnType === "SalesOrder" ? "myFilledButton" : "myOutlineButton"}
                        radius={0}
                        size="md"
                        w={250}
                        onClick={() => setHeaderBtnType("SalesOrder")}
                        style={{
                            borderLeftWidth: !isTabletView ? 1 : 0,
                            borderLeftColor: "#228be6",
                            backgroundColor: headerBtnType === "SalesOrder" ? "#DEE4F5" : "white",
                            overflow: "hidden"
                        }}
                        color={customStyles.colors._1B59F8}
                    >
                        Sales Order
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
            </Group> */}

            {/* Table */}
            {headerBtnType === "Reservation" && <TanStackTable
                data={Array.isArray(ListAllBinToBin?.data) ? ListAllBinToBin?.data : []}
                dataCount={ListAllBinToBin?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Unposted bin to bin transfer orders"}
                subTitle={"Track and review bin to bin transfer orders seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />}


            {/* Table */}
            {/* {headerBtnType === "Outbound" && <TanStackTable
                data={Array.isArray(ListAllOutbound?.data) ? ListAllOutbound?.data : []}
                dataCount={ListAllOutbound?.totalCount}
                columns={outboundColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={paginationOutbound}
                setPagination={setPaginationOutbound}
                title={" Unposted Picking Orders"}
                subTitle={"Track and review picking orders seemlessly."}
                skipRecord={skipRecordOutbound}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />} */}


            {/* Table */}
            {/* {headerBtnType === "SalesOrder" && <TanStackTable
                data={Array.isArray(ListAllSalesOrder?.data) ? ListAllSalesOrder?.data : []}
                dataCount={ListAllSalesOrder?.totalCount}
                columns={salesOrderColumns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={paginationSalesOrder}
                setPagination={setPaginationSalesOrder}
                title={" Unposted Picking Orders"}
                subTitle={"Track and review picking orders seemlessly."}
                skipRecord={skipRecordSalesOrder}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />} */}
        </Stack>
    );
};

export default memo(BinToBinTransferOrderUnPostedComponent);