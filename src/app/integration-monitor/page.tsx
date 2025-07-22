// Note: IntegrationMonitor screen...!

"use client";

import React, { useState } from 'react';
import {
    Button,
    Group,
    SegmentedControl,
    Text,
    Title,
    Stack,
    Tabs,
    TabsList,
    TabsTab,
    Box,
} from '@mantine/core';
import { IconCheckbox, IconRefresh } from "@tabler/icons-react";
import { customStyles } from '@/styles/custom-theme';
import IntegrationComponent from '@/components/integration/integration';
import ReplicationComponent from '@/components/replication/replication';
import Loader from '@/components/loader/loader';
import { useMediaQuery } from '@mantine/hooks';

const IntegrationMonitor = () => {

    // Note: handeling states here...!
    const [tab, setTab] = useState<'integration' | 'replication'>('integration');
    const [loading, setLoading] = useState(false);

    return (
        <Box>

            {/* Note: Loading component */}
            <Loader loadingState={loading} />

            {/* Note: Screen Head section */}
            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-start"
            >
                <Stack gap={0} mb={24}>
                    <Title
                        order={2}
                        style={{
                            color: customStyles.colors._4D4D4D,
                        }}
                    >
                        Integration Monitor
                    </Title>

                    <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
                        Data auto-syncs every 15 mins. To sync manually, Click the Sync All button anytime.
                    </Text>
                </Stack>
            </Group>

            <Box>
                <Tabs defaultValue="integration" value={tab} onChange={(value) => setTab(value as 'integration' | 'replication')}>
                    <Tabs.List mb={32} justify='center' grow>
                        <Tabs.Tab size={32} color={tab === 'integration' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="integration">
                            Integration
                        </Tabs.Tab>
                        <Tabs.Tab size={32} color={tab === 'replication' ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D} value="replication">
                            Replication
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="integration">
                        <IntegrationComponent
                            enableLoader={() => setLoading(true)}
                            disableLoader={() => setLoading(false)}
                        />
                    </Tabs.Panel>

                    <Tabs.Panel value="replication">
                        <ReplicationComponent />
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </Box>
    );
};

export default IntegrationMonitor;