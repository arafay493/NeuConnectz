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
import {
    IconCircleX,
    IconId,
    IconPoint,
    IconPointFilled,
    IconSearch,
    IconUserCog,
    IconUserSquare,
    IconUserSquareRounded,
} from "@tabler/icons-react";
import { useState } from "react";

interface User {
    userId: string;
    userName: string;
    email: string;
    role: string;
    phone: string;
    department: string;
    isActive: boolean;
}

interface SelectedUser {
    userId: string;
    userName: string;
    email: string;
    role: string;
    phone: string;
    department: string;
    isActive: boolean;
}

interface SelectUserModalProps {
    opened: boolean;
    handleModalClose: () => void;
    users: User[];
    selectedUser: any
    handleSelectUser: (a: any) => void;
}

interface SelectedUserProps {
    userId: string,
    userName: string,
    email: string,
    phone: string,
    department: string,
    role: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean
}

export default function SelectUserModal({
    opened,
    handleModalClose,
    users,
    selectedUser,
    handleSelectUser
}: SelectUserModalProps) {
    const [search, setSearch] = useState("");
    // const [selectedUser, setSelectedUser] = useState<SelectedUserProps | null>(null);
    // console.log("🚀 ~ SelectUserModal ~ selectedUser:", selectedUser)
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
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <IconCircleX size={70} stroke={2} color="#ED1C24" />,
            }}
            size="95%"
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
            <Group justify="space-between" mb="md" style={{ paddingTop: 20, paddingBottom: 20, marinBottom: 20, borderTop: "2px solid #E1E7EC", borderBottom: "2px solid #E1E7EC" }}>
                <Tabs variant="none" value={activeTab} onChange={(val) => setActiveTab(val || "all")}>
                    <Tabs.List style={{ display: "flex", gap: 10 }}>
                        <Tabs.Tab value="all" variant="light" style={activeTab === "all" ? activeTabStyles : nonActiveTabStyles}>All</Tabs.Tab>
                        <Tabs.Tab value="active" style={activeTab === "active" ? activeTabStyles : nonActiveTabStyles}>Active</Tabs.Tab>
                        <Tabs.Tab value="inactive" style={activeTab === "inactive" ? activeTabStyles : nonActiveTabStyles}>Inactive</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

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

            {/* User Grid */}
            <ScrollArea h={400}>
                <Group wrap="wrap" gap="md" justify="center">
                    {filteredUsers.map((user: User) => (
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
            </ScrollArea>

            {/* Confirm Button */}
            <Group justify="flex-end" mt="lg">
                <Button
                    disabled={!selectedUser}
                    onClick={() => {
                        handleModalClose();
                    }}
                >
                    Confirm Selection
                </Button>
            </Group>
        </Modal>
    );
}
