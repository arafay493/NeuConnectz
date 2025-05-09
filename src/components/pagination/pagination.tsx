// Note: Pagination component...!

import React, { memo } from 'react';
import { Pagination, Group } from "@mantine/core";
import { customStyles } from '@/styles/custom-theme';

interface PaginationProps {
    totalPages: number;
    pageNum: number
    handleNewPage: any
};

const PaginationComponent = (props: PaginationProps) => {
    const { totalPages, pageNum, handleNewPage } = props;

    return (
        <Group
            justify={customStyles.alignment.left}
            mt={customStyles.deviceSize.md}
        >
            <Pagination
                total={totalPages}
                value={pageNum}
                onChange={handleNewPage}
            />
        </Group>
    );
};

export default memo(PaginationComponent);