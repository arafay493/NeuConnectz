'use client';

import { customStyles } from "@/styles/custom-theme"
import { Box, Group, Stack, Tabs, Text, Title } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useState } from "react"
import ITR_TableCom from '@/components/itr-table/itr-table';
import TR_TableCom from '@/components/tr-table/tr-table';
import IT_TableCom from '@/components/it-table/it-table';

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
                <Tabs defaultValue="integration" value={tab} onChange={(value) => setTab(value as typeof tab)}>
                    <Tabs.List mb={32} justify='center' grow>
                        <Tabs.Tab size={32} color={tab === 'Inventory Transfer Request' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="Inventory Transfer Request">
                            Inventory Transfer Request
                        </Tabs.Tab>
                        <Tabs.Tab size={32} color={tab === 'Inventory Transfer' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="Inventory Transfer">
                            Inventory Transfer
                        </Tabs.Tab>
                        <Tabs.Tab size={32} color={tab === 'Transfer Request' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="Transfer Request">
                            Transfer Request
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="Inventory Transfer Request">
                        <ITR_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_ITR_DATA as string} />
                    </Tabs.Panel>

                    <Tabs.Panel value="Inventory Transfer">
                        <IT_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA as string} />
                    </Tabs.Panel>
                    <Tabs.Panel value="Transfer Request">
                        <TR_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_TR_DATA as string} />
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </Box>
    )
}

export default StockMovementComponent