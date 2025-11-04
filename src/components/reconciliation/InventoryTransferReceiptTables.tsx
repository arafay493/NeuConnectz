'use client';

import { Box, Group } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks';
import { customStyles } from '@/styles/custom-theme';
import { FC, ReactNode } from 'react';

interface ItTrTables {
    inventoryTransfer: ReactNode;
    transferReceipt: ReactNode;
}

const InventoryTransferReceiptTables: FC<ItTrTables> = ({
    inventoryTransfer,
    transferReceipt
}) => {
    // Break points
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1400px)');

    return (
        <Box
            mt={16}
            style={{
                gap: isSmallScreen ? '16px' : '24px'
            }}
        >
            <Group wrap={'wrap'} align='stretch' >
                {/* Inventory Transfer Table */}
                <Box
                    flex={1}
                    bg={customStyles.colors.white}
                    p={16}
                    style={{
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {inventoryTransfer}
                </Box>

                {/* Transfer Receipt Table */}
                <Box
                    flex={1}
                    bg={customStyles.colors.white}
                    p={16}
                    // maw={600}
                    style={{
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {transferReceipt}
                </Box>
            </Group>
        </Box>
    )

}

export default InventoryTransferReceiptTables;