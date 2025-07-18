// Note: TR Table Component...!

import React, { memo, useState, useEffect } from 'react';
import {
    Table,
    Flex,
    Select
} from '@mantine/core';
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '@/components/data-not-found/data-not-found';
import { TR_DataType } from '@/types/redux-types';
import { customStyles } from '@/styles/custom-theme';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAll_ITR_Data } from '@/redux/actions/itr-actions/itr-actions';
import Loader from '../loader/loader';

// Note: Table headers data...!
const headers: string[] =
    [
        "S.No",
        "Doc Num",
        "From WH Code",
        "To WH Code",
        "Doc Status",
        "Item Code",
        "Item Description",
        "Quantity",
        "ERP Doc Entry",
        "ERP Object Type",
        "ERP Doc Line",
        "SAP Status"
    ];

type ApiProp = {
    apiUrl: string;
};

const TR_TableCom: React.FC<ApiProp> = ({ apiUrl }) => {
    // console.log("API URL in TR Table: ", apiUrl);

    // Note: States...!
    const [loading, setLoading] = useState(false);
    const [activePage, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Note: Required variables...!
    const lastCount = itemsPerPage;
    const skipRecords = (activePage - 1) * itemsPerPage;

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { trData, trDataCount, itrErrorState } = useAppSelector(({ itrStates }) => { return itrStates });
    // console.log("list TR Data: ", trData);
    // console.log("Total TR counts: ", trDataCount);

    const totalPages = Math.ceil(trDataCount / itemsPerPage);

    const handleNewPage = (newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (authenticatedUser?.token) {
            setLoading(true);
            dispatch(fetchAll_ITR_Data({
                token: authenticatedUser?.token || '',
                // apiUrl: process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA || '',
                apiUrl: apiUrl,
                type: 'TR',
                handleLoading: () => setLoading(false),
                lastCount: lastCount,
                skipRecords: skipRecords
            }));
        };
    }, [authenticatedUser, skipRecords, lastCount]);

    return (
        <>
            {loading && <Loader loadingState={loading} />}

            <Table
                highlightOnHover
                striped
                withTableBorder
            >
                <Table.Thead>
                    <Table.Tr>
                        {headers.map(h => <Table.Th key={h}>{h}</Table.Th>)}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {
                        trData.length > 0 &&
                        trData?.map((row: TR_DataType, index: number) => (
                            <Table.Tr key={row.id}>
                                <Table.Td> {(activePage - 1) * itemsPerPage + index + 1} </Table.Td>
                                <Table.Td>{row.docNum}</Table.Td>
                                <Table.Td>{row.fromWareHouseCode}</Table.Td>
                                <Table.Td>{row.toWareHouseCode}</Table.Td>
                                <Table.Td>{row.docStatus}</Table.Td>
                                <Table.Td>{row.itemCode}</Table.Td>
                                <Table.Td>{row.itemName}</Table.Td>
                                <Table.Td>{row.quantity}</Table.Td>
                                <Table.Td>{row.erpDocEntry != null ? row.erpDocEntry : "-"}</Table.Td>
                                <Table.Td>{row.erpObjectType != null ? row.erpObjectType : "-"}</Table.Td>
                                <Table.Td>{row.erpDocLine != null ? row.erpDocLine : "-"}</Table.Td>
                                <Table.Td>{row.sapStatus}</Table.Td>
                            </Table.Tr>
                        ))
                    }
                </Table.Tbody>
            </Table>

            {trData.length < 1 && <DataNotFound notFoundContent={itrErrorState || "No TR data found."} />}

            {
                trData.length > 0 &&
                <Flex
                    justify={customStyles.alignment.spaceBetween}
                    align={customStyles.alignment.center}
                    mb="md"
                    wrap="wrap"
                    gap="sm"
                >
                    {/* Note: Pagination section */}
                    <PaginationComponent
                        totalPages={totalPages}
                        pageNum={activePage}
                        handleNewPage={handleNewPage}
                    />

                    {/* Note: Rows per page section */}
                    <Select
                        data={["5", "10", "20", "50"]}
                        label="Rows per page"
                        value={itemsPerPage.toString()}
                        onChange={(value) => {
                            setItemsPerPage(Number(value));
                            setPage(1);
                        }}
                        w={120}
                    />
                </Flex>
            }
        </>
    );
};

export default memo(TR_TableCom);