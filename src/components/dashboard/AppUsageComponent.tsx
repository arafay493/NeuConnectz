'use client';

import { customStyles } from '@/styles/custom-theme';
import { Box, Group, Paper, Select, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconChevronDown, IconDeviceIpadHorizontalCog, IconTrendingUp } from '@tabler/icons-react';
import { memo } from 'react';

const AppUsageComponent = () => {
    return (
        <Paper h='100%' flex={1} radius={16} p={24}>
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Text size="lg" fw={500} c={customStyles.colors._4D4D4D}>
                    App Usage
                </Text>
                <Select
                    w={130}
                    data={['This Week', 'This Month', 'This Quarter']}
                    defaultValue="This Week"
                    size="md"
                    rightSection={<IconChevronDown size={16} />}
                    styles={{
                        input: {
                            border: `1px solid ${customStyles.colors._E1E7EC}`,
                            color: customStyles.colors._909090,
                        }
                    }}
                />
            </Group>

            {/* Usage Cards */}
            <Stack gap={12}>
                {/* Usage Card */}
                <Box
                    p={16}
                    style={{
                        background: 'linear-gradient(135deg, #E8F4FD 0%, #D1E9FC 100%)',
                        borderRadius: '12px',
                        border: '1px solid #E1ECFD'
                    }}
                >
                    <Text size="md" c={customStyles.colors._1B59F8} fw={500} mb="md">
                        Usage
                    </Text>
                    <Group justify="space-between" align="center">
                        <ThemeIcon
                            size={80}
                            radius="md"
                            variant="transparent"
                            color={customStyles.colors._1B59F8}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <IconDeviceIpadHorizontalCog size={80} stroke={1.5} />
                        </ThemeIcon>
                        <Text size="48px" fw={700} c={customStyles.colors._1B59F8} lh={1}>
                            90%
                        </Text>
                    </Group>
                </Box>

                {/* Growth Card */}
                <Box
                    p={16}
                    style={{
                        background: 'linear-gradient(135deg, #F0FDF5 0%, #E8F9EE 100%)',
                        borderRadius: '12px',
                        border: '1px solid #E8F9EE'
                    }}
                >
                    <Text size="md" c="green" fw={500} mb="md">
                        Growth
                    </Text>
                    <Group justify="space-between" align="center">
                        <ThemeIcon
                            size={80}
                            radius="md"
                            variant="transparent"
                            color="green"
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <IconTrendingUp size={80} stroke={2} />
                        </ThemeIcon>
                        <Text size="48px" fw={700} c="green" lh={1}>
                            12%
                        </Text>
                    </Group>
                </Box>
            </Stack>
        </Paper>
    );
};

export default memo(AppUsageComponent);