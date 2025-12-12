import React, { memo, useState, FC, useEffect } from 'react';
import { Stack } from '@mantine/core';
import { PaginationState } from '@tanstack/react-table';
import TanStackTable from '../tanStackTable/TanStackTable';
import ConfirmModal from '../modals/confirm-modal/ConfirmModal';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchListAllProductionReciept } from '@/redux/actions/production-reciept-actions/production-reciept-actions';
import { useMediaQuery } from '@mantine/hooks';
import ProductionRecieptViewDetailsModal from '../modals/production-reciept-view-details-modal/ProductionRecieptViewDetailsModal';
import ProductionRecieptPosted_Columns from '../columns/ProductionRecieptPosted_Columns';

type ApiProp = {
    apiUrl: string;
};

const ProductionRecieptPostedComponent: FC<ApiProp> = ({ apiUrl}) => {
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
    const { ListAllProductionReciept } = useAppSelector(({ productionRecieptStates }) => { return productionRecieptStates });

    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);

            dispatch(fetchListAllProductionReciept({
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

    const columns = ProductionRecieptPosted_Columns({
        pagination, list: ListAllProductionReciept?.data, actions: {
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
            <ProductionRecieptViewDetailsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Production Reciept Posted"}
                subTitle={"Confirm transfer orders for production reciept."}
                skipRecord={skipRecordViewDetails}
                apiUrl={"/IProductionReceiptFeature/GetProductionReceiptDetails"}
                docNumber={selectedRow?.docNum}
                isPosted={true}
            />

            {/* Table */}
            <TanStackTable
                data={Array.isArray(ListAllProductionReciept?.data) ? ListAllProductionReciept?.data : []}
                dataCount={ListAllProductionReciept?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Posted Production Reciept"}
                subTitle={"Track and review production reciept seemlessly."}
                skipRecord={skipRecord}
            // isCsvExport={true}
            // handleExportToCSV={handleExportToCSV}
            />
        </Stack>
    );
};

export default memo(ProductionRecieptPostedComponent);