import {
    Modal,
    Group,
    Text,
    Stack,
    Box,
    Flex
} from "@mantine/core";
import {
    IconCircleX,
    IconTransform,
} from "@tabler/icons-react";


interface ModalProps {
    opened: boolean;
    handleModalClose: () => void;
    handleCreateRemainingTranferReciept: () => void
    handleReverseITofTRInReconciliation: () => void
}


export default function QuantityDifferenceViewModal({
    opened,
    handleModalClose,
    handleCreateRemainingTranferReciept,
    handleReverseITofTRInReconciliation
}: ModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={handleModalClose}
            zIndex={10000}
            closeButtonProps={{
                icon: <Box p={4} style={{ backgroundColor: "#E1E7EC80", borderRadius: 5 }}><IconCircleX size={30} stroke={2} color="#ED1C24" /></Box>,
            }}
            centered
            title={
                <Flex direction="column" w="100%" mt={10}>
                    <Text fw={600} mb={10} size="16px">
                        Select Document to Reconcile
                    </Text>
                    <Text fw={500} color="#909090" size="16px">
                        Select one option to continue with the reconciliation and clear the mismatch.
                    </Text>
                </Flex>
            }
            size={1000}
            radius="md"
        >
            <Stack gap="sm" align="start" m={10}>
                <Box style={{ border: "1px solid #E1E7EC", borderRadius: 8 }} w={"100%"} p={20}>
                    <Group style={{ cursor: "pointer" }} onClick={handleCreateRemainingTranferReciept}>
                        <Box p={4} style={{ backgroundColor: "#E1E7EC80", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center" }} w={50} h={50}><IconTransform size={20} stroke={2} color="#4D4D4D" /></Box>
                        <Box>
                            <Text fw={600} mb={10} size="16px">
                                Create Remaining Transfer Reciept
                            </Text>
                            <Text fw={500} color="#909090" size="16px">
                                Inventory Transfer auto-generates when items are sent, enabling auto-reconciliation.
                            </Text>
                        </Box>
                    </Group>
                </Box>
                <Box style={{ border: "1px solid #E1E7EC", borderRadius: 8 }} w={"100%"} p={20}>
                    <Group style={{ cursor: "pointer" }} onClick={handleReverseITofTRInReconciliation}>
                        <Box p={4} style={{ backgroundColor: "#E1E7EC80", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center" }} w={50} h={50}><IconTransform size={20} stroke={2} color="#4D4D4D" /></Box>
                        <Box>
                            <Text fw={600} mb={10} size="16px">
                                Reverse Inventory Transfer of Transfer Request
                            </Text>
                            <Text fw={500} color="#909090" size="16px">
                                Inventory Transfer auto-generates when items are sent, enabling auto-reconciliation.
                            </Text>
                        </Box>
                    </Group>
                </Box>
                <Box style={{ border: "1px solid #E1E7EC", borderRadius: 8 }} w={"100%"} p={20}>
                    <Group>
                        <Box p={4} style={{ backgroundColor: "#E1E7EC80", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center" }} w={50} h={50}><IconTransform size={20} stroke={2} color="#4D4D4D" /></Box>
                        <Box>
                            <Text fw={600} mb={10} size="16px">
                                Transfer Receipt
                            </Text>
                            <Text fw={500} color="#909090" size="16px">
                                Transfer Receipt auto-generates upon item receipt, completing auto-reconciliation.
                            </Text>
                        </Box>
                    </Group>
                </Box>
            </Stack>
        </Modal >
    );
}
