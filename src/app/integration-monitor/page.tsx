"use client";

import IntegrationComponent from '@/components/integration/integration';
import ReplicationComponent from '@/components/replication/replication';
import { customStyles } from '@/styles/custom-theme';
import {
    Box,
    Stack,
    Text,
    Title
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';

const IntegrationMonitor = () => {
    // Note: handling states here...!
    const [tab, setTab] = useState<'Integration' | 'Replication'>('Integration');

    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    return (
        <Box>
            <Stack gap={8} mb={24} style={{ flexShrink: 0 }}>
                <Title
                    mb={8}
                    order={isSmallScreen ? 3 : 2}
                    c={customStyles.colors._4D4D4D}
                    size={isSmallScreen ? 'h3' : 'h2'}
                >
                    Integration Monitor
                </Title>
                <Text
                    mb={isSmallScreen ? 16 : 24}
                    c={customStyles.colors._909090}
                    size={isSmallScreen ? 'sm' : 'md'}
                >
                    Data auto-syncs every 15 mins. To sync manually, Click the Sync All button anytime.
                </Text>
            </Stack>
            <Box>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    position: 'relative'
                }}>
                    {(['Integration', 'Replication'] as const).map((tabOption) => (
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
                    {tab === 'Integration' && (
                        <IntegrationComponent />
                    )}
                    {tab === 'Replication' && (
                        <ReplicationComponent />
                    )}
                </div>


            </Box >
        </Box >
    );
};

export default IntegrationMonitor;