import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchListAllInboundSto } from '@/redux/actions/inbound-sto-actions/inbound-sto-actions';
import { useMediaQuery } from '@mantine/hooks';
import InBoundStoViewDetailsModal from '../modals/inbound-sto-view-details-modal/InBoundStoViewDetailsModal';
import InBoundStoPosted_Columns from '../columns/InBoundStoPosted_Columns';

type ApiProp = {
    apiUrl: string;
};

const InBoundStoPostedComponent: FC<ApiProp> = ({ apiUrl}) => {
    const isTabletView = useMediaQuery('(max-width: 968px)'); // TRUE below 968px
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

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { ListAllInBoundSto } = useAppSelector(({ inboundStoStates }) => { return inboundStoStates });

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);

            dispatch(fetchListAllInboundSto({
                authToken: authenticatedUser?.token || '',
                apiUrl: apiUrl,
                lastCount: pagination.pageSize, // Use page size for server-side pagination
                skipRecords: skipRecord
            })).finally(() => {
                setIsLoading(false)
            });
        }
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

    const columns = InBoundStoPosted_Columns({
        pagination, list: ListAllInBoundSto?.data, actions: {
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
        <Stack>
            {/* Confirm Modal */}
            <ConfirmModal description='By Confirming this will be posted.' handleCancel={handleModalClose} handleConfirm={handleConfirm} handleModalClose={handleModalClose} opened={isConfirmModalOpen} />
            {/* View Modal */}
            <InBoundStoViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Inbound Stock Transfer Order Posted"}
                subTitle={"Confirm transfer orders for inbound stock transfer order."}
                skipRecord={skipRecordViewDetails}
                apiUrl={"/IBinManagementFeature/GetDetailsofBinTransfer"}
                docNumber={selectedRow?.docNum}
                isPosted={true}
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
                title={"Posted Inbound Stock Transfer Orders"}
                subTitle={"Track and review inbound stock transfer orders seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />
        </Stack>
    );
};

export default memo(InBoundStoPostedComponent);