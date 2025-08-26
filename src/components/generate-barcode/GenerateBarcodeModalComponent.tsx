import { Text, TextInput, Title } from "@mantine/core"
import { FC } from "react";

interface GenerateBarcodeProps {
    title: string;
    description: string;
    inputLabel?: string;
    inputPlaceholder?: string;
    inputValue?: string;
    onInputChange?: (value: string) => void;
}

const GenerateBarcodeModalComponent: FC<GenerateBarcodeProps> = ({
    title,
    description,
    inputLabel,
    inputPlaceholder,
    inputValue,
    onInputChange
}) => {
    return (
        <>
            {/* Title */}
            <Title
                order={2}
                fw={600}
                ta="center"
                c="dark.8"
            >
                {title}
            </Title>

            {/* Description */}
            <Text
                size="lg"
                ta="center"
                c="gray.6"
                style={{ marginTop: '-8px' }}
            >
                {description}
            </Text>

            {/* Input Section */}
            {inputLabel && (
                <div style={{ width: '100%' }}>
                    <TextInput
                        placeholder={inputPlaceholder}
                        value={inputValue}
                        withAsterisk
                        label={inputLabel}
                        onChange={(event) => onInputChange?.(event.currentTarget.value)}
                        size="md"
                        styles={{
                            input: {
                                borderRadius: '8px',
                                border: '1px solid #e9ecef',
                                padding: '12px 16px',
                                fontSize: '14px',
                                '&:focus': {
                                    borderColor: '#4c6ef5',
                                }
                            }
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default GenerateBarcodeModalComponent