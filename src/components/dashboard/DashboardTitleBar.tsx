import { customStyles } from '@/styles/custom-theme'
import { Box, Button, Group, Stack, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconUserCircle } from '@tabler/icons-react'
import React from 'react'

const DashboardTitleBar = ({dashboard, selectedUser, setDeleteModalOpened, handleOpenModal}: any) => {
    const isSmallScreen = useMediaQuery("(max-width: 768px)");
    return (
        <Box>
            <Group mb={24} align="center" justify="space-between">
                <Stack gap={8}>
                    <Title
                        order={isSmallScreen ? 3 : 2}
                        c={customStyles.colors._4D4D4D}
                        // size={isSmallScreen ? "h3" : "h2"}
                        style={{ fontWeight: 700, fontSize: 24 }}
                    >
                        {dashboard}
                    </Title>
                    <Text
                        mb={isSmallScreen ? 16 : 24}
                        c={customStyles.colors._909090}
                        // size={isSmallScreen ? "sm" : "md"}
                        style={{ fontWeight: 500, fontSize: 16 }}
                    >
                        Dashboard
                    </Text>
                </Stack>
                <Stack gap={2}>
                    {selectedUser && <Button
                        // className="filledButton"
                        // bg="#E1E7EC"
                        style={{ color: "red", fontSize: 10, textAlign: "right", width: 50, alignSelf: "end", padding: 0 }}
                        size="xs"
                        variant="transparent"
                        onClick={() => setDeleteModalOpened(true)}
                    >
                        Cancel
                    </Button>}
                    <Button
                        leftSection={<IconUserCircle size={24} />}
                        // className="filledButton"
                        bg="#E1E7EC"
                        style={{ color: "#4D4D4D", fontSize: 16 }}
                        size="md"
                        px={40}
                        py={10}
                        radius={8}
                        onClick={handleOpenModal}
                    >
                        {!selectedUser ? "Select User" : selectedUser.userName}
                    </Button>
                </Stack>
            </Group>
        </Box>
    )
}

export default DashboardTitleBar
