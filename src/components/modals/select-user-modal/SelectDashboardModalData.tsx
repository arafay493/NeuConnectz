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
    "User Registration",
    "Password Reset",
    "Account Verification",
    "Feedback Submission",
    "Profile Update",
    "Subscription Renewal",
    "Payment Processing",
    "Order Cancellation",
    "Data Export",
    "Service Upgrade",
    "Usage Analytics",
    "Support Ticket",
    "Feature Request",
    "Beta Access",
    "Content Moderation",
];

const SelectDashboardModalData = ({ handleShowDashboard, dashboard }: any) => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<string | null>(null);

    // Filtering logic
    // const filteredUsers = users.filter((u) => {
    //     const matchesSearch = u.userName
    //         .toLowerCase()
    //         .includes(search.toLowerCase());

    //     const matchesTab =
    //         activeTab === "all"
    //             ? true
    //             : activeTab === "active"
    //                 ? u.isActive
    //                 : activeTab === "inactive"
    //                     ? !u.isActive
    //                     : u.role.toLowerCase() === activeTab.toLowerCase();

    //     return matchesSearch && matchesTab;
    // });

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


            <ScrollArea h={300} >
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {options.map((option) => (
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
                </SimpleGrid>
            </ScrollArea>
        </Box>
    )
}

export default SelectDashboardModalData
