import { ActionIcon, Box, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface AddHandlingUnitCardProps {
    label: string;
    onClick?: () => void;
}

const AddHandlingUnitCard = ({ label, onClick }: AddHandlingUnitCardProps) => {
    return (
        <Box
            mih={100}
            onClick={onClick}
            p="24px"
            style={{
                border: '2px dashed #4c6ef5',
                borderRadius: '8px',
                backgroundColor: '#f3f8fe',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                minHeight: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': onClick ? {
                    backgroundColor: '#e7f5ff',
                    borderColor: '#364fc7',
                } : {}
            }}
        >
            <Link
                href={"/handling-units/add"}
                style={{ width: '100%', height: "100%", textDecoration: 'none', color: 'inherit', fontWeight: 500, fontSize: '1.25rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
            >
                <ActionIcon
                    variant="filled"
                    color="#438cef"
                    size="md"
                    radius="md"
                    styles={{
                        root: {
                            backgroundColor: '#438cef',
                            '&:hover': {
                                backgroundColor: '#364fc7',
                            }
                        }
                    }}
                >
                    <IconPlus size={20} />
                </ActionIcon>

                <Text
                    size="md"
                    fw={500}
                >
                    {label}
                </Text>
            </Link>
        </Box>
    )
}

export default AddHandlingUnitCard