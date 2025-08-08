'use client';

import { customStyles } from "@/styles/custom-theme";
import { Box, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import PostedGRNTable from "./PostedGRNTable";
import UnpostedGRNTable from "./UnpostedGRNTable";
import { useMediaQuery } from "@mantine/hooks";


const GRNMovementComponent = () => {
    const [tab, setTab] = useState<'Posted' | 'Unposted'>('Posted');

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
                    GRN Movement
                </Title>
                <Text
                    mb={isSmallScreen ? 16 : 24}
                    c={customStyles.colors._909090}
                    size={isSmallScreen ? 'sm' : 'md'}
                >
                    Track and manage all goods receipt notes to ensure timely, accurate inventory updates and smooth warehouse operations.
                </Text>
            </Stack>
            <Box>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '32px',
                    position: 'relative'
                }}>
                    {(['Posted', 'Unposted'] as const).map((tabOption) => (
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
                    {tab === 'Posted' && (
                        <PostedGRNTable />
                    )}
                    {tab === 'Unposted' && (
                        <UnpostedGRNTable />
                    )}
                </div>
            </Box>
        </Box>
    )
}

export default GRNMovementComponent