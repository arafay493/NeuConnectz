import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';
import { Badge, Box, Button, Card, Group, Image, ScrollArea, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconPointFilled, IconSearch, IconUserCog, IconUserSquare } from '@tabler/icons-react';
import NextImage from 'next/image';
import React, { useState } from 'react'

const options = [
    "Home",
    "Inventory Transfer Request",
    "Transfer Request",
    // "User Registration",
    // "Password Reset",
    // "Account Verification",
    // "Feedback Submission",
    // "Profile Update",
    // "Subscription Renewal",
    // "Payment Processing",
    // "Order Cancellation",
    // "Data Export",
    // "Service Upgrade",
    // "Usage Analytics",
    // "Support Ticket",
    // "Feature Request",
    // "Beta Access",
    // "Content Moderation",
];

const SelectDashboardModalData = ({ handleShowDashboard, dashboard }: any) => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string | null>(null);

    // Filtering logic
    const filteredDashboards = options.filter((u) => {
        const matchesSearch = u.toLowerCase().includes(search.toLowerCase());

        // const matchesTab =
        //     activeTab === "all"
        //         ? true
        //         : activeTab === "active"
        //             ? u.isActive
        //             : activeTab === "inactive"
        //                 ? !u.isActive
        //                 : u.role.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch
    });

    return (
        <Box>
            {/* Filters & Search */}
            <Group justify="space-between" mb="md" style={{ paddingBottom: 20, borderBottom: "2px solid #E1E7EC" }}>
                <Group justify="space-between" w={"100%"}>
                    <Group>
                        <Box>
                            <Text fw={600} size="lg">
                                Select Dashboard
                            </Text>
                            <Text size="sm" c="dimmed">
                                Details here
                            </Text>
                        </Box>
                    </Group>
                    <Group>
                        <TextInput
                            placeholder="Search here"
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            leftSection={<IconSearch size={16} color="#909090" />}
                            styles={{
                                input: {
                                    border: "none",
                                    backgroundColor: "#E1E7EC",
                                    color: "#909090",
                                    '&::placeholder': {
                                        color: '#909090',
                                    },
                                },
                            }}
                        />
                        <Button variant="filled" color="#909090">Search</Button>
                    </Group>
                </Group>
            </Group>


            <ScrollArea h={400} >
                {(!filteredDashboards.length) ? <Group wrap="wrap" gap="md" display={"flex"} justify="center" w={"100%"} align='center'>
                    <Stack align='center' justify='center' mt={24} p={24} style={{ backgroundColor: customStyles.colors.white, borderRadius: '16px' }}>
                        <Image w={200} h={200} radius={16} component={NextImage} src={localAssets.reconciliationNotFoundImage} alt="Not Found" />
                        <Title order={2} c={customStyles.colors._4D4D4D}>No Dashboard Found</Title>
                    </Stack>
                </Group> : (<SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {filteredDashboards.map((option) => (
                        <Card
                            key={option}
                            // shadow="sm"
                            padding="md"
                            radius="md"
                            withBorder
                            // onClick={() => setSelected(option)}
                            onClick={() => handleShowDashboard(option)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: dashboard === option ? "#e7f0ff" : "white",
                                borderColor: dashboard === option ? "#1c7ed6" : "#dee2e6",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <Group justify="space-between" mb={5}>
                                <Text fw={500}>{option}</Text>
                            </Group>
                            <Text size="sm" c="dimmed">
                                {dashboard === option ? "Selected" : "Select"}
                            </Text>
                        </Card>
                    ))}
                </SimpleGrid>)}
            </ScrollArea>
        </Box>
    )
}

export default SelectDashboardModalData
