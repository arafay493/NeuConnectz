// Note: DataNotFound component...!

import React, { FC, memo } from 'react';
import { Text } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';

type DataNotFoundProps = {
    notFoundContent: string;
    colSpanValue: number
};

const DataNotFound: FC<DataNotFoundProps> = ({ notFoundContent, colSpanValue }) => {
    return (
        <tr>
            <td colSpan={colSpanValue}>
                <Text style={{ textAlign: customStyles.alignment.center }}>
                    {notFoundContent}
                </Text>
            </td>
        </tr>
    );
};

export default memo(DataNotFound);