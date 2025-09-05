// CloseProductionOrderComponent...!

"use client";
import React, { memo, FC } from "react";
import { Modal, Button, Group, Text, Stack, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type CloseProductionOrderComponentProp = {
    open: boolean,
    onClose: () => void,
};

const CloseProductionOrderComponent: FC<CloseProductionOrderComponentProp> = ({ open, onClose }) => {
    return (
        <Modal
            opened={open}
            onClose={onClose}
            centered
            withCloseButton={false}
            size={"auto"}
            radius="md"
        >
            <Stack gap="sm" align="center">
                {/* Warning Icon */}
                <Center
                    style={{
                        backgroundColor: "#FFF7E6",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                    }}
                >
                    <IconAlertCircle size={24} color="#F59E0B" />
                </Center>

                {/* Title */}
                <Text fw={600} size="lg">
                    Are you sure?
                </Text>

                {/* Subtitle */}
                <Text size="sm" c="dimmed" ta="center">
                    Are you sure you want to close this production order?
                </Text>

                {/* Buttons */}
                <Group mt="md" grow>
                    <Button
                        variant="transparent"
                        className={'filledButton'}
                        radius={8}
                        size="md"
                        w={300}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="transparent"
                        className={'outlineButton'}
                        radius={8}
                        size="md"
                        w={300}
                        onClick={onClose}
                    >
                        Confirm
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default memo(CloseProductionOrderComponent);