'use client';

import { customStyles } from '@/styles/custom-theme';
import { Grid, GridCol, Group, Paper, Progress, Select, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconChevronDown, IconCircleArrowUpFilled, IconClock, IconDownload } from '@tabler/icons-react';
import { memo } from 'react';

const AverageConversionComponent = () => {
    return (
        <Paper radius={16} p={20} h="100%">
            {/* Header */}
            <Group justify="space-between" mb="lg">
                <Text size="lg" fw={500} c={customStyles.colors._4D4D4D}>
                    Average Conversion
                </Text>
                <Group gap="sm">
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
                    <Select
                        w={130}
                        data={['Download', 'Export', 'Share']}
                        defaultValue="Download"
                        size="md"
                        rightSection={<IconDownload size={16} />}
                        styles={{
                            input: {
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                                color: customStyles.colors._909090,
                            }
                        }}
                    />
                </Group>
            </Group>

            <Grid gutter="md" h="calc(100% - 60px)">
                {/* Main Conversion Progress */}

                <GridCol span={{ base: 12, sm: 6, md: 6 }}>
                    <Stack
                        gap={16}
                        p={20}
                        h="100%"
                        justify="space-between"
                        style={{
                            borderRadius: '12px',
                            border: `1px solid ${customStyles.colors._ECECEC}`,
                        }}
                    >
                        <Text size="sm" c={customStyles.colors._4D4D4D} fw={500}>
                            Avg. Conversion of Inventory Transfer
                        </Text>
                        <Stack gap={12}>
                            <Group justify="space-between">
                                <Text size="28px" fw={700} c={customStyles.colors._1B59F8}>
                                    90%
                                </Text>
                                <Group align='center' gap={4}>
                                    <ThemeIcon size={32} variant="transparent" color="green">
                                        <IconCircleArrowUpFilled size={32} />
                                    </ThemeIcon>
                                    <Text size="sm" c="green" fw={600}>
                                        12%
                                    </Text>
                                </Group>
                            </Group>
                            <Progress
                                value={90}
                                size="md"
                                radius="xl"
                                color={customStyles.colors._1B59F8}
                            />
                        </Stack>
                    </Stack>
                </GridCol>

                {/* Conversion Rate Cards */}
                {/* <Group justify='space-between' style={{ flexWrap: 'nowrap' }}> */}
                <GridCol span={{ base: 12, sm: 6, md: 3 }}>
                    {/* ITR Conversion Rate */}
                    <Stack
                        h="100%"
                        gap={12}
                        p={16}
                        justify="space-between"
                        style={{
                            borderRadius: '16px',
                            border: `1px solid ${customStyles.colors._ECECEC}`,
                        }}
                    >
                        <Text size="md" c={customStyles.colors._4D4D4D} fw={500}>
                            Avg. ITR conversion rate
                        </Text>

                        <Group justify='space-between' align="center">
                            <ThemeIcon size={28} variant="transparent" color={customStyles.colors._1B59F8}>
                                <IconClock size={28} />
                            </ThemeIcon>
                            <Text size="xl" fw={700} c={customStyles.colors._1B59F8}>
                                22
                                <Text component="span" size="sm" ml={4} c={customStyles.colors._909090}>
                                    Mins
                                </Text>
                            </Text>
                        </Group>
                    </Stack>
                </GridCol>
                <GridCol span={{ base: 12, sm: 6, md: 3 }}>

                    {/* IT Conversion Rate */}
                    <Stack
                        h="100%"
                        gap={12}
                        p={16}
                        justify="space-between"
                        style={{
                            borderRadius: '16px',
                            border: `1px solid ${customStyles.colors._ECECEC}`,
                        }}
                    >
                        <Text size="md" c={customStyles.colors._4D4D4D} fw={500}>
                            Avg. IT conversion rate
                        </Text>

                        <Group justify='space-between' align="center">
                            <ThemeIcon size={28} variant="transparent" color={customStyles.colors._1B59F8}>
                                <IconClock size={28} />
                            </ThemeIcon>
                            <Text size="xl" fw={700} c={customStyles.colors._1B59F8}>
                                1
                                <Text component="span" size="sm" ml={4} c={customStyles.colors._909090}>
                                    HRS
                                </Text>
                            </Text>
                        </Group>
                    </Stack>
                </GridCol>
                {/* </Group> */}
            </Grid>
        </Paper >
    );
};

export default memo(AverageConversionComponent);
