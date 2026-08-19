// import { exportToCSVListAllStockReportsData, fetchListAllStockReportsData } from '@/redux/actions/reports-actions/reports-actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Stack } from '@mantine/core';
import { PaginationState } from '@tanstack/react-table';
import { FC, memo, useEffect, useState } from 'react';
import Columns from './Columns';
import TanStackTable from '../tanStackTable/TanStackTable';
import FilterSection from './FilterSection';
import useDocumentDetails from './useDocumentDetails';
import { fetchAllInventory } from '@/redux/actions/inventory-actions/inventory-actions';
type ApiProp = {
    apiUrl: string;
    filterState: any,
    Dispatch: any
};

const TableComponent: FC<ApiProp> = ({ apiUrl, filterState, Dispatch }) => {
    console.log("API URL Unposted:", apiUrl);

    // Note: Handling states here...!
    const [isLoading, setIsLoading] = useState(false);
    const [isCSVLoading, setIsCSVLoading] = useState(false);
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
    const [selectedRow, setSelectedRow] = useState<any>(null);

    // Pagination values for Api call
    const skipRecord = pagination.pageIndex * pagination.pageSize;
    const skipRecordViewDetails = paginationViewDetails.pageIndex * paginationViewDetails.pageSize;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { inventoryList } = useAppSelector(
        ({ inventoryStates }) => {
            return inventoryStates;
        }
    );
    useEffect(() => {
        if (authenticatedUser?.token) {
            setIsLoading(true);
            dispatch(fetchAllInventory({
                authToken: authenticatedUser?.token || '',
                LastCount: pagination.pageSize,
                skipRecord: skipRecord,
                isScanned: false,
                isDispatched: false,
                // filters: filterState,
            })).finally(() => {
                setIsLoading(false)
            });
        };
    }, [authenticatedUser, dispatch, apiUrl, pagination.pageIndex, pagination.pageSize, filterState]);

    const handleModalClose = () => {
        setIsViewDetailsModalOpen(false)
    }

    const handleViewDetailsModalOpen = (rowData: any) => {
        setSelectedRow(rowData)
        setIsViewDetailsModalOpen(true)
    }

    const columns = Columns({
        pagination, list: inventoryList?.data, isPosted: true, actions: {
            handleViewDetailsModalOpen: handleViewDetailsModalOpen,
        }
    })

    const filterActive = Object.values(filterState).some(
        value => value !== null && value !== ""
    );

    const handleExportToCSV = () => {
        // setIsCSVLoading(true);
        // dispatch(exportToCSVListAllStockReportsData({
        //     authToken: authenticatedUser?.token || '',
        //     apiUrl: "/IReportsFeature/ExportStocksToCsv",
        //     lastCount: pagination.pageSize,
        //     skipRecords: skipRecord,
        //     filters: filterState,
        // })).finally(() => {
        //     setIsCSVLoading(false)
        // });
    }

    const details = useDocumentDetails(selectedRow);

    return (
        <Stack>
            {/* View Modal */}
            {/* <BinsModal
                opened={isViewDetailsModalOpen}
                handleModalClose={handleModalClose}
                row={selectedRow}
                isLoading={isViewLoading}
                setIsLoading={setIsViewLoading}
                pagination={paginationViewDetails}
                setPagination={setPaginationViewDetails}
                title={"Stock Reports"}
                subTitle={"Track and review vendor return order seemlessly."}
                skipRecord={skipRecordViewDetails}
                apiUrl={"/IVendorReturnFeature/GetVendorReturnDocDetails"}
                poNumber={selectedRow?.docNum || ""}
                handlePost={() => { }}
                isConfirmed={selectedRow?.confirmationStatus === "Confirmed"}
                tableData={ListAllDocDataDetailsByDocNo}
                details={details}
            /> */}

            {/* Filters */}
            {/* <FilterSection filterState={filterState} Dispatch={Dispatch} isPosted={true} filterActive={filterActive} /> */}

            {/* Table */}
            <TanStackTable
                data={Array.isArray(inventoryList?.data) ? inventoryList?.data : []}
                dataCount={inventoryList?.totalCount}
                columns={columns}
                isLoading={isLoading}
                isInsideModalTable={true}
                pagination={pagination}
                setPagination={setPagination}
                title={"Inventory List"}
                subTitle={"View detailed inventory information."}
                skipRecord={skipRecord}
                isCsvExport={false}
                handleExportToCSV={handleExportToCSV}
                isCSVLoading={isCSVLoading}
                // isCSVLoading={true}
                filterActive={filterActive}
                headerTextAllowed={true}
                isPaginationShown={true}
            />
        </Stack>
    );
};

export default memo(TableComponent);