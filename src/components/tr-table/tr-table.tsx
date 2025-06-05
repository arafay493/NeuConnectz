// Note: TR Table Component...!

import React, { memo } from 'react';
import {
    Table,
    Flex,
    Select
} from '@mantine/core';
import PaginationComponent from '../pagination/pagination';
import DataNotFound from '@/components/data-not-found/data-not-found';
import { TR_DataType } from '@/types/redux-types';
import { customStyles } from '@/styles/custom-theme';

// Note: Table headers data...!
const headers: string[] =
    [
        "S.No",
        "Doc Num",
        "From WH Code",
        "To WH Code",
        "Doc Status",
        "Item Code",
        "Quantity",
        "ERP Doc Entry",
        "ERP Object Type",
        "ERP Doc Line",
        "SAP Status"
    ];

const TR_TableCom = (props: any) => {
    // console.log("Props in TR Table component: ", props);
    const
        { paginatedData,
            totalPages,
            activePage,
            setPage,
            itemsPerPage,
            setItemsPerPage,
            itrErrorState

        } = props;

    return (
        <>
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
                        (paginatedData.length > 0)
                            ?
                            (
                                paginatedData
                                    .map((row: TR_DataType, index: number) => (
                                        <Table.Tr key={row.id}>
                                            <Table.Td>{index + 1}</Table.Td>
                                            <Table.Td>{row.docNum}</Table.Td>
                                            <Table.Td>{row.fromWareHouseCode}</Table.Td>
                                            <Table.Td>{row.toWareHouseCode}</Table.Td>
                                            <Table.Td>{row.docStatus}</Table.Td>
                                            <Table.Td>{row.itemCode}</Table.Td>
                                            <Table.Td>{row.quantity}</Table.Td>
                                            <Table.Td>{row.erpDocEntry != null ? row.erpDocEntry : "-"}</Table.Td>
                                            <Table.Td>{row.erpObjectType != null ? row.erpObjectType : "-"}</Table.Td>
                                            <Table.Td>{row.erpDocLine != null ? row.erpDocLine : "-"}</Table.Td>
                                            <Table.Td>{row.sapStatus}</Table.Td>
                                        </Table.Tr>
                                    ))
                            )
                            :
                            (<DataNotFound notFoundContent={itrErrorState || "No TR data found."} colSpanValue={12} />)
                    }
                </Table.Tbody>
            </Table>

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
                    handleNewPage={setPage}
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
        </>
    );
};

export default memo(TR_TableCom);