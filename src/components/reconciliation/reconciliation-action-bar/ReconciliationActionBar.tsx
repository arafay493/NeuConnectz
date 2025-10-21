import { customStyles } from "@/styles/custom-theme"
import { Button, Group, Stack, Text, Title } from "@mantine/core"
import { IconCopyCheck } from "@tabler/icons-react"

const ReconciliationActionBar = ({ handleAutoReconcile }: any) => {
    return (
        <Group justify="space-between" mt={24} p={24} bg={customStyles.colors.white} style={{ borderRadius: '16px' }}>
            <Stack gap={0}>
                <Title mb={6} order={4} c={customStyles.colors._4D4D4D}>
                    Reconciliation Action
                </Title>
                <Text c={customStyles.colors._909090}>
                    Auto mode shows mismatches, manual mode lets you match entries.
                </Text>
            </Stack>
            <Group>
                <Button
                    className="outlineButton"
                    variant="transparent"
                    size="md"
                    radius={8}
                    leftSection={<IconCopyCheck size={24} />}
                >
                    Reconcile
                </Button>
                <Button
                    className="filledButton"
                    variant="transparent"
                    size="md"
                    radius={8}
                    leftSection={<IconCopyCheck size={24} />}
                    onClick={handleAutoReconcile}
                >
                    Auto Reconcile
                </Button>
            </Group>
        </Group>
    )
}

export default ReconciliationActionBar