'use client';

import IT_TableCom from '@/components/it-table/it-table';
import ITR_TableCom from '@/components/itr-table/itr-table';
import TR_TableCom from '@/components/tr-table/tr-table';
import { customStyles } from "@/styles/custom-theme";
import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";

const StockMovementComponent = () => {
    // Note: Media Query for responsiveness
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    // Note: state for tas Switch
    // Note: handling states here...!
    const [tab, setTab] = useState<'Inventory Transfer Request' | 'Inventory Transfer' | 'Transfer Request'>('Inventory Transfer Request');

    return (
        <Box>
            <Group mb={24} justify="space-between" align="center" style={{ flexShrink: 0 }}>
                <Stack gap={0}>
                    <Title
                        mb={8}
                        order={isSmallScreen ? 3 : 2}
                        c={customStyles.colors._4D4D4D}
                        size={isSmallScreen ? 'h3' : 'h2'}
                    >
                        Stock Movement
                    </Title>
                    <Text
                        mb={isSmallScreen ? 16 : 24}
                        c={customStyles.colors._909090}
                        size={isSmallScreen ? 'sm' : 'md'}
                    >
                        View, search, and manage all users by using multiple filters.
                    </Text>
                </Stack>
            </Group>
            <Box>
                {/* Custom Tab Headers */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    position: 'relative'
                }}>
                    {(['Inventory Transfer Request', 'Inventory Transfer', 'Transfer Request'] as const).map((tabOption) => (
                        <button
                            key={tabOption}
                            onClick={() => setTab(tabOption)}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: tab === tabOption ? customStyles.colors._1B59F8 : customStyles.colors._909090,
                                transition: 'border 0.3s ease',
                                borderBottom: tab === tabOption ? `4px solid ${customStyles.colors._1B59F8}` : `2px solid ${customStyles.colors._E1E7EC}`,
                            }}
                        >
                            {tabOption}
                        </button>
                    ))}
                </div>

                {/* Custom Tab Panels */}
                <div>
                    {tab === 'Inventory Transfer Request' && (
                        <ITR_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA as string} />
                    )}
                    {tab === 'Inventory Transfer' && (
                        <IT_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA as string} />
                    )}
                    {tab === 'Transfer Request' && (
                        <TR_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA as string} />
                    )}
                </div>
            </Box>
        </Box>
    )
}

export default StockMovementComponent