'use client';

import { customStyles } from "@/styles/custom-theme";
import { Box, Stack, Tabs, Text, Title } from "@mantine/core";
import { useState } from "react";
import PostedGRNTable from "./PostedGRNTable";
import UnpostedGRNTable from "./UnpostedGRNTable";


const GRNMovementComponent = () => {
    const [tab, setTab] = useState<'Posted' | 'Unposted'>('Posted');

    return (
        <Box>
            <Stack gap={8} mb={24} style={{ flexShrink: 0 }}>
                <Title order={2} c={customStyles.colors._4D4D4D}>GRN Movement</Title>
                <Text c={customStyles.colors._909090}>Track and manage all goods receipt notes to ensure timely, accurate inventory updates and smooth warehouse operations.</Text>
            </Stack>
            <Box>
                <Tabs defaultValue="integration" value={tab} onChange={(value) => setTab(value as typeof tab)}>
                    <Tabs.List mb={32} justify='center' grow>
                        <Tabs.Tab size={32} color={tab === 'Posted' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="Posted">
                            Posted
                        </Tabs.Tab>
                        <Tabs.Tab size={32} color={tab === 'Unposted' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="Unposted">
                            Unposted
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="Posted">
                        <PostedGRNTable />
                    </Tabs.Panel>

                    <Tabs.Panel value="Unposted">
                        <UnpostedGRNTable />{/* <IT_TableCom apiUrl={process.env.NEXT_PUBLIC_FETCH_ALL_IT_DATA as string} /> */}
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </Box>
    )
}

export default GRNMovementComponent