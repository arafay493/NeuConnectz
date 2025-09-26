import {
    Modal,
    Button,
    Group,
    Text,
    Stack,
    Center,
    Flex,
    Divider,
    ActionIcon,
    SimpleGrid,
    Box
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCircleX,
} from "@tabler/icons-react";


interface ModalProps {
    opened: boolean;
    handleModalClose: () => void;
    row: any
    // handleConfirm: () => void;
    // handleCancel: () => void;
    // description: string
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Group gap="xs">
            <Text fw={500} size="sm" c="dark.6">
                {label}:
            </Text>
            <Text size="sm" c="dimmed">
                {value}
            </Text>
        </Group>
    );
}


export default function TRViewDetailsModal({
    opened,
    handleModalClose,
    row
    // handleConfirm,
    // handleCancel,
    // description
}: ModalProps) {
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
            size={"100%"}
            radius="md"
            title={
                <Flex direction="column" w="100%">
                    <Text fw={400} fz="lg">
                        Preview
                    </Text>
                    {/* <Divider mt="sm" /> */}
                </Flex>
            }
        >
            {/* Header with close button */}
            {/* <Group justify="space-between" align="flex-start">
                <Text fw={600} size="md">Preview</Text>
                <ActionIcon onClick={handleModalClose} variant="subtle" color="#ED1C24" size="lg">
                    <IconCircleX />
                </ActionIcon>
            </Group> */}

            <Divider my="sm" />

            {/* Document details */}
            <Box mb="md">
                <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md" verticalSpacing="sm">
                    <InfoRow label="Document No" value={String(row?.documentNumber)} />
                    <InfoRow label="Item Code" value={row?.itemNo} />
                    <InfoRow label="Item Description" value={row?.productDescription.length < 20 ? row?.productDescription : row?.productDescription?.slice(0, 20)} />
                    <InfoRow label="UOM" value={row?.uom} />
                    <InfoRow label="Quantity" value={String(row?.quantity)} />
                    <InfoRow label="Remaining Qty" value={String(row?.remainingQuantity)} />
                    <InfoRow label="Planned Date" value={new Date(row?.plannedDate as string).toLocaleDateString()} />
                    <InfoRow label="Origin No" value={String(row?.originNo)} />
                    <InfoRow label="Warehouse" value={row?.warehouse} />
                </SimpleGrid>
            </Box>
            <Stack gap="sm" align="start">
                
            </Stack>
        </Modal >
    );
}

