import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import PutAwayPostedViewDetailsModal from '../modals/putaway-posted-view-details-modal/PutAwayPostedViewDetailsModal';
import PutAwayOrderOrderPosted_Columns from '../columns/PutAwayOrderPosted_Columns';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchListAllPutAway } from '@/redux/actions/putaway-actions/putaway-actions';

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

const PutAwayPostedComponent: FC<ApiProp> = ({ apiUrl }) => {
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
    const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

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
            const skipRecord = pagination.pageIndex * pagination.pageSize;

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
        setIsViewDetailsModalOpen(false)
    }

    const handleViewDetailsModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
        setIsViewDetailsModalOpen(true)
    }

    const columns = PutAwayOrderOrderPosted_Columns({
        pagination, list: ListAllPutAway?.data, actions: {
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
        }
    })

    const handleExportToCSV = () => {
        console.log("Export to CSV Running.............")
    }

    return (
        <Stack p={24} mt={24} bg={customStyles.colors.white} style={{ borderRadius: '16px', width: '100%' }}>
            {/* View Modal */}
            <PutAwayPostedViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Putaway Posted"}
                skipRecord={skipRecordViewDetails}
                apiUrl={"apiUrlAgainstPO"}
                poNumber={0}
            />
            {/* Table */}
            <TanStackTable
                data={Array.isArray(ListAllPutAway?.data) ? ListAllPutAway?.data : []}
                dataCount={ListAllPutAway?.data?.length}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Posted Putaway Orders"}
                subTitle={"Track and review stock transfer order seemlessly."}
                skipRecord={skipRecord}
                isCsvExport={true}
                handleExportToCSV={handleExportToCSV}
            />
        </Stack>
    );
};

export default memo(PutAwayPostedComponent);