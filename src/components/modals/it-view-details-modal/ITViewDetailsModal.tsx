import {
    Modal,
    Button,
    Group,
    Text,
    Stack,
    Center
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCircleX,
} from "@tabler/icons-react";


interface DeleteModalProps {
    opened: boolean;
    handleModalClose: () => void;
    // handleConfirm: () => void;
    // handleCancel: () => void;
    // description: string
}


export default function ITViewDetailsModal({
    opened,
    handleModalClose,
    // handleConfirm,
    // handleCancel,
    // description
}: DeleteModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <IconCircleX size={70} stroke={2} color="#ED1C24" />,
            }}
            centered
            // withCloseButton={false}
            size={500}
            radius="md"
        >
            <Stack gap="sm" align="start">
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

                <Text fw={600} size="lg">
                    Are you sure?
                </Text>

                {/* <Text size="sm" c="dimmed">
                    {description}
                </Text> */}

                <Group mt="md" grow>
                    <Button
                        variant="transparent"
                        className={'btn'}
                        radius={8}
                        size="md"
                        w={300}
                        color="#1B59F8"
                        style={{
                            border: "1px solid", borderColor: "#E1E7EC", boxShadow: "10px"
                        }}
                        // onClick={handleCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="filled"
                        radius={8}
                        size="md"
                        w={300}
                        color="#1B59F8"
                        // onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </Group>
            </Stack>
        </Modal >
    );
}

