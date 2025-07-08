'use client';

import { Anchor, Group, Table, TableTbody, TableThead, Text, ScrollArea } from '@mantine/core';
import { FC, ReactNode, useState } from 'react';

interface TableComponentProps {
    title?: string;
    isSeeAll?: boolean;
    tableHeadRow: ReactNode;
    tableBodyRow: ReactNode;
}

const TableComponent: FC<TableComponentProps> = ({
    title,
    isSeeAll = false,
    tableHeadRow,
    tableBodyRow
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
        console.log(`Page changed to: ${page}`);
        setCurrentPage(page);
    }; return (
        <>
            {
                (title || isSeeAll) &&
                <Group justify="space-between" align="center" mb="md">
                    {
                        title && <Text
                            fw={600}
                            style={{
                                color: '#374151',
                                fontSize: '1.375rem'
                            }}
                        >
                            {title}
                        </Text>
                    }
                    {
                        isSeeAll && <Anchor
                            href="#"
                            style={{
                                color: '#3b82f6',
                                fontSize: '1rem',
                                fontWeight: 500,
                                textDecoration: 'none'
                            }}
                        >
                            See All
                        </Anchor>
                    }
                </Group>}

            <ScrollArea>
                <Table
                    striped
                    stripedColor='#f9f9f9'
                    styles={{
                        table: {
                            border: '1px solid #d9d7db',
                            borderRadius: '12px',
                            minWidth: '600px', // Ensures table has minimum width before scrolling
                        },
                        th: {
                            padding: '12px 16px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#374151',
                            whiteSpace: 'nowrap', // Prevents text wrapping in headers
                        },
                        td: {
                            padding: '12px 16px',
                            whiteSpace: 'nowrap', // Prevents text wrapping in cells
                        }
                    }}
                >
                    <TableThead
                        style={{
                            backgroundColor: '#f9fafb',
                            borderBottom: '1px solid #e5e7eb'
                        }}
                    >
                        {tableHeadRow}
                    </TableThead>
                    <TableTbody>
                        {tableBodyRow}
                    </TableTbody>
                </Table>
            </ScrollArea>
            {/* <PaginationComponent
                currentPage={currentPage}
                totalPages={batchData.length > 0 ? Math.ceil(batchData.length / 5) : 0}
                onPageChange={handlePageChange}
            /> */}
        </>
    )
}

export default TableComponent