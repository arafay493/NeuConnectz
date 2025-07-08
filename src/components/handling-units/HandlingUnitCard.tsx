'use client';

import { Stack, Group, Box, Text, Badge, ActionIcon } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react"

interface HandlingUnitCardProps {
    id?: string;
    title: string;
    description?: string;
    size?: string;
    weight?: string;
    capacity?: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

const HandlingUnitCard = ({
    id,
    title,
    description,
    size,
    weight,
    capacity,
    onEdit,
    onDelete
}: HandlingUnitCardProps) => {
    return (
        <Box
            mih={100}
            bg="#FFF"
            p="16px"
            style={{
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Stack gap="12px">
                {/* Header with ID, Title and Actions */}
                <Group justify="space-between" align="flex-start">
                    <Group gap="8px" align="center">
                        {id && (
                            <Text
                                size="lg"
                                fw={600}
                                ta="center"
                                c="#4c6ef5"
                                bg="#e7f5ff"
                                style={{ minWidth: '28px', borderRadius: '4px', padding: '2px 8px' }}
                            >
                                {id}
                            </Text>
                        )}
                        <Text size="lg" fw={500} c="dark.8">
                            {title}
                        </Text>
                    </Group>

                    <Group gap="4px">
                        <ActionIcon
                            variant="light"
                            color="blue"
                            size="md"
                            onClick={onEdit}
                            style={{
                                '&:hover': {
                                    backgroundColor: '#e7f5ff'
                                }
                            }}
                        >
                            <IconEdit size={20} />
                        </ActionIcon>
                        <ActionIcon
                            variant="light"
                            color="red"
                            size="md"
                            onClick={onDelete}
                            style={{
                                '&:hover': {
                                    backgroundColor: '#ffe0e0'
                                }
                            }}
                        >
                            <IconTrash size={20} />
                        </ActionIcon>
                    </Group>
                </Group>

                {/* Description */}
                {description && (
                    <Box>
                        <Text size="sm" c="gray.6" mb="4px">
                            Description:
                        </Text>
                        <Text size="sm" c="dark.7">
                            {description}
                        </Text>
                    </Box>
                )}

                {/* Badges */}
                <Group gap="8px" justify={size && weight && capacity ? '' : 'center'} wrap="wrap">
                    {size && (
                        <Badge
                            fw={500}
                            variant="light"
                            color="blue"
                            size="md"
                            radius="md"
                            styles={{
                                root: {
                                    backgroundColor: '#f3f8fe',
                                    color: '#2f80ed',
                                    border: '2px Solid #ccdffb',
                                    padding: '6px 12px',
                                }
                            }}
                        >
                            Size {size}
                        </Badge>
                    )}

                    {weight && (
                        <Badge
                            fw={500}
                            variant="light"
                            color="blue"
                            size="md"
                            radius="md"
                            styles={{
                                root: {
                                    backgroundColor: '#f3f8fe',
                                    color: '#2f80ed',
                                    border: '2px Solid #ccdffb',
                                    padding: '6px 12px',
                                }
                            }}
                        >
                            Weight {weight}
                        </Badge>
                    )}

                    {capacity && (
                        <Badge
                            fw={500}
                            variant="light"
                            color="blue"
                            size="md"
                            radius="md"
                            styles={{
                                root: {
                                    backgroundColor: '#f3f8fe',
                                    color: '#2f80ed',
                                    border: '2px Solid #ccdffb',
                                    padding: '6px 12px',
                                }
                            }}
                        >
                            Capacity {capacity}
                        </Badge>
                    )}
                </Group>
            </Stack>
        </Box >
    )
}

export default HandlingUnitCard