import React, { FC, memo } from "react";
import { Modal, Button, Group, Text, Stack, Divider } from "@mantine/core";

interface DeleteModalProps {
    opened: boolean;
    close: () => void;
    onConfirm: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({ opened, close , onConfirm }) => {
    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Delete confirmation"
            centered
            radius="md"
        >
            <Stack gap="sm">
                <Text fw={500} size="sm">
                    Are you sure you want to delete this item?
                </Text>

                <Text size="xs" c="dimmed">
                    This action cannot be undone.
                </Text>

                <Divider />

                <Group grow gap="sm">
                    {/* NO BUTTON - LEFT */}
                    <Button
                        variant="light"
                        color="gray"
                        fullWidth
                        onClick={close}
                    >
                        No
                    </Button>

                    {/* YES BUTTON - RIGHT */}
                    <Button
                        color="#1B59F8"
                        fullWidth
                        onClick={onConfirm}
                    >
                        Yes, delete
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default memo(DeleteModal);