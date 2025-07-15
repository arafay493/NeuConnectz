// Note: DataNotFound component...!

import React, { FC, memo } from 'react';
import { Text } from '@mantine/core';
import { customStyles } from '@/styles/custom-theme';

type DataNotFoundProps = {
    notFoundContent: string;
};

const DataNotFound: FC<DataNotFoundProps> = ({ notFoundContent }) => {
    return (
        <div
            style={{
                width: '100%',
                // backgroundColor: "yellow"
            }}
        >
            <Text
                style={{
                    textAlign: customStyles.alignment.center,
                    fontSize: '22px',
                    fontWeight: 500,
                    padding: '10px',
                }}
            >
                {notFoundContent}
            </Text>
        </div>
    );
};

export default memo(DataNotFound);