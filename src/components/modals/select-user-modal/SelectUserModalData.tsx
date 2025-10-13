import { Badge, Box, Button, Card, Group, Image, ScrollArea, Stack, Tabs, Text, TextInput, Title } from '@mantine/core'
import React, { useState } from 'react'
import NextImage from 'next/image';
import { IconPointFilled, IconSearch, IconUserCog, IconUserSquare } from '@tabler/icons-react';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';

interface User {
    userId: string;
    userName: string;
    email: string;
    role: string;
    phone: string;
    department: string;
    isActive: boolean;
}

interface SelectUserModalDataProps {
    users: User[];
    selectedUser: any
    handleSelectUser: (a: any) => void;
    handleShowDashboard: (a: string) => void
}

const SelectUserModalData = ({ users, selectedUser, handleSelectUser, handleShowDashboard }: SelectUserModalDataProps) => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState<string>("all");

    // Filtering logic
    const filteredUsers = users.filter((u) => {
        const matchesSearch = u.userName
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesTab =
            activeTab === "all"
                ? true
                : activeTab === "active"
                    ? u.isActive
                    : activeTab === "inactive"
                        ? !u.isActive
                        : u.role.toLowerCase() === activeTab.toLowerCase();

        return matchesSearch && matchesTab;
    });

    const activeTabStyles = {
        backgroundColor: "#1B59F81A",
        color: "blue",
        width: "100px",
        borderRadius: "5px"
    }

    const nonActiveTabStyles = {
        backgroundColor: "#E1E7EC",
        color: "#4D4D4D",
        width: "100px",
        borderRadius: "5px"
    }
    return (
        <Box>
            {/* Filters & Search */}
            <Group justify="space-between" mb="md" style={{ paddingBottom: 20, borderBottom: "2px solid #E1E7EC" }}>
                <Group justify="space-between" w={"100%"}>
                    <Group>
                        <Box>
                            <Text fw={600} size="lg">
                                Select User
                            </Text>
                            <Text size="sm" c="dimmed">
                                Select user to assign warehouse
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
                <Tabs variant="none" value={activeTab} onChange={(val) => setActiveTab(val || "all")}>
                    <Tabs.List style={{ display: "flex", gap: 10 }}>
                        <Tabs.Tab value="all" variant="light" style={activeTab === "all" ? activeTabStyles : nonActiveTabStyles}>All</Tabs.Tab>
                        <Tabs.Tab value="active" style={activeTab === "active" ? activeTabStyles : nonActiveTabStyles}>Active</Tabs.Tab>
                        <Tabs.Tab value="inactive" style={activeTab === "inactive" ? activeTabStyles : nonActiveTabStyles}>Inactive</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Group>

            {/* User Grid */}
            <ScrollArea h={300} >
                <Group wrap="wrap" gap="md" justify="center">
                    {(!filteredUsers.length) ? (
                        <Stack align='center' justify='center' mt={24} p={24} style={{ backgroundColor: customStyles.colors.white, borderRadius: '16px' }}>
                            <Image w={250} h={250} radius={16} component={NextImage} src={localAssets.reconciliationNotFoundImage} alt="Not Found" />
                            <Title order={2} c={customStyles.colors._4D4D4D}>No User Found</Title>
                        </Stack>
                    ) : filteredUsers.map((user: User) => (
                        <Card
                            key={user.userId}
                            withBorder
                            radius="md"
                            shadow="xs"
                            onClick={() => handleSelectUser(user)}
                            style={{
                                cursor: "pointer",
                                border:
                                    // selectedUser.some((u: any) => u.userId === user.userId)
                                    selectedUser?.userId === user.userId
                                        ? "1px solid #228be6"
                                        : "1px solid #e0e0e0",
                                backgroundColor:
                                    // selectedUser.some((u: any) => u.userId === user.userId) ? "#f0f9ff" : "white",
                                    selectedUser?.userId === user.userId ? "#f0f9ff" : "white",
                                transition: "0.2s",
                                minWidth: "300px"
                            }}
                        >
                            <Group align="center" gap={5} mb={10}>
                                <IconUserSquare
                                    stroke={2}
                                    size={20}
                                    color="#228be6"
                                />
                                <Text fw={500}>{user.userName}</Text>
                            </Group>
                            <Group justify="center" gap={3}>
                                {/* <Group gap={2}>
                                    <IconId
                                        stroke={2}
                                        size={14}
                                        color="#909090"
                                    />
                                    <Text size={"12px"} color="#909090">{user.userId}</Text>
                                </Group> */}
                                <Group gap={2}>
                                    <IconUserCog
                                        stroke={2}
                                        size={14}
                                        color="#909090"
                                    />
                                    <Text size={"12px"} color="#909090">{user.role}</Text>
                                </Group>
                            </Group>
                            <Badge
                                mt="sm"
                                color={user.isActive ? "green" : "gray"}
                                variant="light"
                                radius="sm"
                                fullWidth
                                p={15}
                            >
                                <Group gap={1}>
                                    <IconPointFilled size={20} stroke={4} />
                                    {user.isActive ? "Active" : "Inactive"}
                                </Group>
                            </Badge>
                        </Card>
                    ))}
                </Group>
            </ScrollArea >

        </Box>
    )
}

export default SelectUserModalData
