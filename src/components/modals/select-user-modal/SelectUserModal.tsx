
import {
    Modal,
    Box,
    Button,
    Group,
    Text,
    TextInput,
    Badge,
    Card,
    ScrollArea,
    Tabs,
} from "@mantine/core";
import { IconUser, IconSearch } from "@tabler/icons-react";
import { useState } from "react";


interface propTypes {
    opened: boolean;
    handleModalClose: () => void;
    users: any
}

export default function SelectUserModal({ opened, handleModalClose, users }: propTypes) {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            size="90%"
            radius="md"
            title={
                <Box>
                    <Text fw={600} size="lg">
                        Select User
                    </Text>
                    <Text size="sm" c="dimmed">
                        Select user to assign warehouse
                    </Text>
                </Box>
            }
        >
            {/* Filters & Search */}
            <Group justify="space-between" mb="md">
                <Tabs defaultValue="all">
                    <Tabs.List>
                        <Tabs.Tab value="all">All</Tabs.Tab>
                        <Tabs.Tab value="active">Active</Tabs.Tab>
                        <Tabs.Tab value="inactive">Inactive</Tabs.Tab>
                        <Tabs.Tab value="worker">Worker</Tabs.Tab>
                        <Tabs.Tab value="manager">Manager</Tabs.Tab>
                        <Tabs.Tab value="receiver">Receiver</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                <Group>
                    <TextInput
                        placeholder="Search here"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        leftSection={<IconSearch size={16} />}
                    />
                    <Button variant="filled" color="gray">
                        Search
                    </Button>
                </Group>
            </Group>

            {/* User Grid */}
            <ScrollArea h={400}>
                <Group wrap="wrap" gap="md">
                    {filteredUsers.map((user: any) => (
                        <Card
                            key={user.id}
                            withBorder
                            radius="md"
                            shadow="xs"
                            w={250}
                            onClick={() => setSelectedUser(user.id)}
                            style={{
                                cursor: "pointer",
                                border:
                                    selectedUser === user.id
                                        ? "2px solid #228be6"
                                        : "1px solid #e0e0e0",
                                backgroundColor:
                                    selectedUser === user.id ? "#f0f9ff" : "white",
                            }}
                        >
                            <Group align="center" mb="sm">
                                <IconUser size={20} color="blue" />
                                <Text fw={500}>{user.name}</Text>
                            </Group>
                            <Text size="sm" c="dimmed">
                                {user.code} • {user.role}
                            </Text>
                            <Badge
                                mt="sm"
                                color={user.status === "Active" ? "green" : "gray"}
                                variant="light"
                                radius="sm"
                            >
                                {user.status}
                            </Badge>
                        </Card>
                    ))}
                </Group>
            </ScrollArea>
        </Modal>
    );
}
