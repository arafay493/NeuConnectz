import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchListAllInboundSto, confirmInBoundSto, postInBoundSto, deleteInBoundSto} from '@/redux/actions/inbound-sto-actions/inbound-sto-actions';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '../loader/loader';
import { ToastMessage } from '@/utils/ToastMessage';
import { useMediaQuery } from '@mantine/hooks';
import DeleteModal from '../modals/delete-modal/DeleteModal';
import InBoundStoViewDetailsModal from '../modals/inbound-sto-view-details-modal/InBoundStoViewDetailsModal';
import InBoundStoUnPosted_Columns from '../columns/InBoundStoUnPosted_Columns';

type ApiProp = {
    apiUrl: string;
};

const InBoundStoUnPostedComponent: FC<ApiProp> = ({ apiUrl }) => {
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
    const [paginationViewDetails, setPaginationViewDetails] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Note: Table modal state...!
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { ListAllInBoundSto } = useAppSelector(({ inboundStoStates }) => { return inboundStoStates });

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            dispatch(fetchListAllInboundSto({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        }
    }, [authenticatedUser, dispatch, apiUrl, pagination.pageIndex, pagination.pageSize]);

    const handleModalClose = () => {
        setIsConfirmModalOpen(false)
        setIsViewDetailsModalOpen(false)
        setIsDeleteModalOpen(false)
    }

    const handleConfirm = () => {
        setIsFullPageLoading(true)
        dispatch(confirmInBoundSto({
            payload: {
                docNum: Number(selectedRow?.docNum)
            },
            token: authenticatedUser?.token || '',
            resHandler: handleInBoundStoResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllInboundSto({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        })
        setIsConfirmModalOpen(false)
    }

    const handlePost = (rowData: any) => {
        handleModalClose()
        setIsFullPageLoading(true)
        dispatch(postInBoundSto({
            payload: {
                docNum: Number(rowData?.docNum)
            },
            token: authenticatedUser?.token || '',
            resHandler: handlePostInBoundStoResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllInboundSto({
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
        handleModalClose()
        setIsFullPageLoading(true)
        dispatch(deleteInBoundSto({
            apiUrl: `/IInboundDeliveryStoFeature/DeleteInBoundSto?docNum=${selectedRow?.docNum}`,
            token: authenticatedUser?.token || '',
            resHandler: handleDeleteResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllInboundSto({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize,
                skipRecords: skipRecord
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

    const columns = InBoundStoUnPosted_Columns({
        pagination, list: ListAllInBoundSto?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            handlePost: handlePost,
            handleDelete: handleDeleteModalOpen
            // handlePost: () => { },
        }
    })

    const handleInBoundStoResponse = (status: number, data: any, error: string) => {
        if (status === 200) {
            showNotificationToast("Confirm Inbound Stock Transfer Order", data.message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
        }
    }

    const handlePostInBoundStoResponse = (status: number, message: string, error: string) => {
        if (status === 201) {
            ToastMessage("Inbound Stock Transfer Order Post", message, status, error)
        } else {
            ToastMessage("Error", message, status, error)
        }
    }

    const handleDeleteResponse = (status: number, message: string, error: string) => {
        if (status === 200) {
            ToastMessage("Inbound Stock Transfer Order Delete", message, status, error)
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
            <InBoundStoViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Inbound Stock Transfer Order Unposted"}
                subTitle={"Confirm transfer orders for inbound stock transfer order."}
                skipRecord={skipRecordViewDetails}
                apiUrl={"/IInboundDeliveryStoFeature/GetInBoundStoDetails"}
                docNumber={selectedRow?.docNum}
                isPosted={false}
            />

            {/* Table */}
            <TanStackTable
                data={Array.isArray(ListAllInBoundSto?.data) ? ListAllInBoundSto?.data : []}
                dataCount={ListAllInBoundSto?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Unposted Inbound Stock Transfer Orders"}
                subTitle={"Track and review inbound stock transfer orders seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />
        </Stack>
    );
};

export default memo(InBoundStoUnPostedComponent);