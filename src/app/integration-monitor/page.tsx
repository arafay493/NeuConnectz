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
} from '@mantine/core';
import { IconCheckbox } from "@tabler/icons-react";
import { customStyles } from '@/styles/custom-theme';
import IntegrationComponent from '@/components/integration/integration';
import ReplicationComponent from '@/components/replication/replication';
import Loader from '@/components/loader/loader';

const IntegrationMonitor = () => {

    // Note: handeling states here...!
    const [tab, setTab] = useState<'integration' | 'replication'>('integration');
    const [loading, setLoading] = useState(false);

    return (
        <div>

            {/* Note: Loading component */}
            <Loader loadingState={loading} />

            {/* Note: Screen Head section */}
            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-start"
                p="md"
                bg="gray.0"
            >
                <Stack gap={0}>
                    <Title
                        order={3}
                        style={{
                            color: customStyles.colors._4D4D4D,
                            fontSize: "24px",
                            fontWeight: 700
                        }}
                    >
                        Integration Monitor
                    </Title>

                    <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
                        Track the status of your data syncs between NeuConnectz and SAP in real time.
                    </Text>
                </Stack>

                {/* <Button
                    leftSection={<IconCheckbox size={14} color={customStyles.colors.white} />}
                    color={customStyles.colors._1B59F8}
                >
                    Post All
                </Button> */}
            </Group>

            <div style={{ padding: 10 }}>
                <SegmentedControl
                    fullWidth
                    data={[{ label: 'Integration', value: 'integration' }, { label: 'Replication', value: 'replication' }]}
                    value={tab}
                    onChange={(value) => setTab(value as 'integration' | 'replication')}
                    mb="lg"
                />

                {
                    tab === 'replication'
                        ?
                        (<ReplicationComponent />)
                        :
                        (
                            <IntegrationComponent
                                enableLoader={() => setLoading(true)}
                                disableLoader={() => setLoading(false)}
                            />
                        )
                }
            </div>
        </div>
    );
};

export default IntegrationMonitor;