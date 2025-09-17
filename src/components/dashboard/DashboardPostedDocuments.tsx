'use client';

import { useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { ActionIcon, Card, Grid, GridCol, Group, Select, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronDown, IconClipboardCheck, IconDownload, IconFileCheck, IconPackages, IconTransform, IconTrendingUp } from "@tabler/icons-react";

const DashboardPostedDocuments = () => {
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1200px)');
    
    const { dashboardAnalyticsData } = useAppSelector(({ dashboardStates }) => {
        return dashboardStates;
    });
    const postedDocumentCard = [
        {
            title: 'ITR',
            icon: <IconPackages color={customStyles.colors.white} size={24} />,
            color: '#789EFF',
            value: dashboardAnalyticsData?.transferStatistics?.totalItrIntegrated || 0,
            subValue: '/54',
            percentage: '+19.01%',
            bgColor: '#E8F0FF'
        },
        {
            title: 'IT',
            icon: <IconTransform color={customStyles.colors.white} size={24} />,
            color: '#D5A5FF',
            value: dashboardAnalyticsData?.transferStatistics?.totalItIntegrated || 0,
            subValue: '/0',
            percentage: '+19.01%',
            bgColor: '#F5EBFF'
        },
        {
            title: 'TR',
            icon: <IconClipboardCheck color={customStyles.colors.white} size={24} />,
            color: '#FF8A8A',
            value: dashboardAnalyticsData?.transferStatistics?.totalTrIntegrated || 0,
            subValue: '/2',
            percentage: '+19.01%',
            bgColor: '#FFE8E8'
        },
        {
            title: 'GRN',
            icon: <IconFileCheck color={customStyles.colors.white} size={24} />,
            color: '#FFA261',
            value: dashboardAnalyticsData?.grnStatistics?.totalGrnIntegrated || 0,
            subValue: '/52',
            percentage: '+19.01%',
            bgColor: '#FFF0E6'
        }
    ]
    console.log(
        "🚀 ~ DashboardComponent ~ dashboardAnalyticsData:",
        dashboardAnalyticsData
    );

    return (
        <Stack bg={customStyles.colors.white} p={24} gap={24} style={{ borderRadius: 16 }}>
            {/* Title of Posted Documents */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0 }}>
                <Title order={4} c={customStyles.colors._4D4D4D} fw={600}>Posted Documents</Title>
                {/* <Group gap={12}>
                    <Select
                        w={150}
                        data={['This Week', 'This Month', 'This Year']}
                        defaultValue="This Week"
                        size="md"
                        radius={4}
                        rightSection={<IconChevronDown size={16} />}
                        styles={{
                            input: {
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                                color: customStyles.colors._909090,
                            }
                        }}
                    />
                    <Select
                        w={150}
                        data={['Download', 'Export PDF', 'Export Excel']}
                        defaultValue="Download"
                        size="md"
                        radius={4}
                        rightSection={<IconDownload size={16} />}
                        styles={{
                            input: {
                                border: `1px solid ${customStyles.colors._E1E7EC}`,
                                color: customStyles.colors._909090,
                            }
                        }}
                    />
                </Group> */}
            </Group>
            <Grid>
                {
                    postedDocumentCard.map((card, index) => (
                        <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 3} key={index}>
                            <Card withBorder radius={16} p={16}>
                                <Stack gap={16}>
                                    <Group justify="space-between" align="flex-start">
                                        <Text size="lg" c={customStyles.colors._4D4D4D} fw={500}>
                                            {card.title}
                                        </Text>
                                        {/* <Group p='2px 6px' bg="#3CD8561A" gap={4} align="center" style={{ borderRadius: 4 }}>
                                            <IconTrendingUp size={14} color="#3CD856" />
                                            <Text size="xs" c='#3CD856' fw={500}>
                                                {card.percentage}
                                            </Text>
                                        </Group> */}
                                    </Group>
                                    <Group gap={8} align="center" justify="space-between" style={{ flexWrap: 'nowrap' }}>
                                        <ActionIcon
                                            variant="filled"
                                            color={card.color}
                                            size={48}
                                            radius="xl"
                                        >
                                            {card.icon}
                                        </ActionIcon>
                                        <Group gap={0}>
                                            <Text
                                                size="xl"
                                                fw={700}
                                                c={customStyles.colors._4D4D4D}
                                                style={{ fontSize: '24px', lineHeight: 1 }}
                                            >
                                                {card.value}
                                            </Text>
                                            {/* <Text
                                                size="md"
                                                c={customStyles.colors._909090}
                                                fw={500}
                                                style={{ fontSize: '12px' }}
                                            >
                                                {card.subValue}
                                            </Text> */}
                                        </Group>
                                    </Group>
                                </Stack>
                            </Card>
                        </GridCol>
                    ))
                }
            </Grid>
        </Stack>
    )
}

export default DashboardPostedDocuments