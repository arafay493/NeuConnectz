"use client"

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
    Stack,
    Title,
    Image
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
import NextImage from 'next/image';
import { localAssets } from "@/lib/file-paths/file-paths";
import { customStyles } from "@/styles/custom-theme";
import SelectUserModalData from "./SelectUserModalData";
import SelectDashboardModalData from "./SelectDashboardModalData";

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
    handleShowDashboard: (a: string) => void,
    dashboard: string,
    tab: string,
    setTab: any
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
    handleSelectUser,
    handleShowDashboard,
    dashboard,
    tab,
    setTab
}: SelectUserModalProps) {


    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <Box p={4} style={{ backgroundColor: "#E1E7EC80", borderRadius: 5 }}><IconCircleX size={30} stroke={2} color="#ED1C24" /></Box>,
            }}
            size="95%"
            radius="md"
            title={
                <Box>
                    <Text fw={600} size="lg">
                        Select User & Dashboard Selection
                    </Text>
                    <Text size="sm" c="dimmed">
                        Select user to assign warehouse
                    </Text>
                </Box>
            }

        >

            {/* Custom Tab Headers */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 20,
                position: 'relative',
                borderTop: "2px solid #E1E7EC",
                paddingTop: 10
            }}>
                {(['Select User', 'Select Dashboard'] as const).map((tabOption) => (
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
                {tab === 'Select User' && (<SelectUserModalData users={users} handleSelectUser={handleSelectUser} selectedUser={selectedUser} handleShowDashboard={handleShowDashboard} />)}
                {tab === 'Select Dashboard' && (<SelectDashboardModalData handleShowDashboard={handleShowDashboard} dashboard={dashboard} />)}
            </div>



            {/* Confirm Button */}
            {/* <Group justify="flex-end" mt="lg">
                <Button
                    disabled={!selectedUser}
                    onClick={() => {
                        handleModalClose();
                    }}
                >
                    Confirm Selection
                </Button>
            </Group> */}
        </Modal>
    );
}
