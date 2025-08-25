import { Group, Modal, Button, Stack } from "@mantine/core"
import { FC, ReactNode } from "react";

interface ModalComponentProps {
    children?: ReactNode;
    onClose: () => void;
    onSubmit: () => void;
    isLoading?: boolean;
    isOpen: boolean;
    isSingleButton?: boolean;
    firstButtonText: string;
    secondButtonText?: string;
    firstButtonColor: string;
    secondButtonColor?: string;
}

const ModalComponent: FC<ModalComponentProps> = ({
    children,
    onClose,
    onSubmit,
    isLoading,
    isOpen,
    isSingleButton,
    firstButtonText,
    secondButtonText,
    firstButtonColor,
    secondButtonColor,
}) => {
    return (
        <Modal
            w={800}
            opened={isOpen}
            onClose={onClose}
            withCloseButton={false}
            centered
            size="lg"
            radius="lg"
            zIndex={2000}
            overlayProps={{
                opacity: 0.55,
                blur: 3,
            }}
            styles={{
                content: {
                    backgroundColor: 'white',
                    borderRadius: '16px',
                },
                body: {
                    padding: '32px',
                },
                overlay: {
                    zIndex: 1999,
                },
                inner: {
                    zIndex: 2000,
                }
            }}
        >
            <Stack align="center">
                {/* Custom children content */}
                {children}

                {/* Buttons */}
                <Group gap="12px" style={{ width: '100%', marginTop: '16px' }}>
                    <Button
                        variant={isSingleButton ? "filled" : "outline"}
                        color={firstButtonColor}
                        size="md"
                        radius="md"
                        flex={1}
                        onClick={onClose}
                    >
                        {firstButtonText}
                    </Button>

                    {!isSingleButton && (
                        <Button
                            color={secondButtonColor}
                            size="md"
                            radius="md"
                            flex={1}
                            onClick={onSubmit}
                            loading={isLoading}
                        >
                            {secondButtonText}
                        </Button>
                    )}
                </Group>
            </Stack>
        </Modal>
    )
}

export default ModalComponent