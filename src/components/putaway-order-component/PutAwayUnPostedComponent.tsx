import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import StockTransferOrderUnPosted_Columns from '../columns/StockTransferOrderUnPosted_Columns';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import PutawayUnPostedViewDetailsModal from '../modals/putaway-unposted-view-details-modal/PutawayUnPostedViewDetailsModal';
import PutAwayOrderUnPosted_Columns from '../columns/PutAwayOrderUnPosted_Columns';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { confirmPutAwayOrders, fetchListAllPutAway, postPutAwayOrders } from '@/redux/actions/putaway-actions/putaway-actions';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '../loader/loader';

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

const PutAwayUnPostedComponent: FC<ApiProp> = ({ apiUrl }) => {
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
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { ListAllPutAway } = useAppSelector(({ putawayStates }) => { return putawayStates });

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            // const skipRecord = pagination.pageIndex * pagination.pageSize;

            dispatch(fetchListAllPutAway({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
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
        setIsFullPageLoading(true)
        dispatch(confirmPutAwayOrders({
            payload: {
                docNum: selectedRow?.docNum
            },
            token: authenticatedUser?.token || '',
            resHandler: handleResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllPutAway({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
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
        dispatch(postPutAwayOrders({
            payload: {
                putawayDocNums: [String(rowData?.docNum)]
            },
            token: authenticatedUser?.token || '',
            resHandler: handlePostResponse
        })).finally(() => {
            setIsFullPageLoading(false)
            setIsLoading(true);
            dispatch(fetchListAllPutAway({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
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
    const columns = PutAwayOrderUnPosted_Columns({
        pagination, list: ListAllPutAway?.data, actions: {
            handleConfirmModalOpen: handleConfirmModalOpen,
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
            handlePost: handlePost,
        }
    })

    const handleResponse = (status: number, data: any, error: string) => {
        if (status === 200) {
            showNotificationToast("Confirmation", data.message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
        }
    }

    const handlePostResponse = (status: number, message: string, error: string) => {
        if (status === 201) {
            showNotificationToast("Putaway Post", message, customStyles.colors._408CCE);
        } else if (error) {
            showNotificationToast("Error", error, customStyles.colors.red);
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
            <ConfirmModal description='By Confirming this will be posted.' handleCancel={handleModalClose} handleConfirm={handleConfirm} handleModalClose={handleModalClose} opened={isConfirmModalOpen} />
            {/* View Modal */}
            <PutawayUnPostedViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Putaway Unposted"}
                skipRecord={skipRecordViewDetails}
                apiUrl={"/IPutAwayFeature/GetPutAwayDetails"}
                poNumber={selectedRow?.docNum || ""}
                handlePost={handlePost}
            />

            <TanStackTable
                data={Array.isArray(ListAllPutAway?.data) ? ListAllPutAway?.data : []}
                dataCount={ListAllPutAway?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={" Unposted Putaway Orders"}
                subTitle={"Track and review stock transfer order seemlessly."}
                skipRecord={skipRecord}
                isCsvExport={true}
                handleExportToCSV={handleExportToCSV}
            />
        </Stack>
    );
};

export default memo(PutAwayUnPostedComponent);