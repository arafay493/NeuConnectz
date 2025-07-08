'use client';

import React, { useState } from 'react'
import {
    Box,
    Container,
    Title,
    Text,
    Grid,
    GridCol,
    Progress,
    Button,
    Stack,
    Group,
    Badge,
    TextInput,
    Card,
    Flex,
    ActionIcon,
    Divider
} from '@mantine/core'
import { IconRefresh, IconChevronDown, IconBarcode, IconX } from '@tabler/icons-react'

const ScanProductionOrder = () => {
    const [activeTab, setActiveTab] = useState('Manual Scan')
    const [expandedItems, setExpandedItems] = useState<number[]>([])

    const [scannedItems] = useState([
        {
            id: 1,
            type: 'Piece',
            quantity: '1/2',
            code: '123456678',
            progress: 50,
            subItems: [
                { id: 21, type: 'Boxes', bottles: '03/06', code: '123456678', status: 'Completed' },
                { id: 22, type: 'Boxes', bottles: '03/06', code: '123456678', status: 'Completed' }
            ]
        },
        {
            id: 2,
            type: 'Box',
            quantity: '25/30',
            code: '123456678',
            progress: 60,
            subItems: [
                { id: 21, type: 'Boxes', bottles: '03/06', code: '123456678', status: 'Completed' },
                { id: 22, type: 'Boxes', bottles: '03/06', code: '123456678', status: 'Completed' }
            ]
        },
        {
            id: 3,
            type: 'Pack',
            quantity: '61/100',
            code: '123456678',
            progress: 61,
            subItems: []
        }
    ])

    const toggleExpanded = (itemId: number) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }

    const [scannedResults] = useState([
        { id: 1, name: 'Bottle 01', code: '123456678', item: '10x40 Lubricants', isCorrect: true },
        { id: 2, name: 'Bottle 01', code: '-', item: '-', isCorrect: false },
        { id: 3, name: 'Bottle 01', code: '123456678', item: '10x40 Lubricants', isCorrect: true }
    ])

    return (
        <Container size="xl" p="md">
            <Card
                shadow="sm"
                radius="md"
                bg="#fff"
                p="lg"
            >
                <Group justify="space-between" mb="md">
                    <Title order={4} c="dark.8">Production Process</Title>
                    <TextInput
                        placeholder="Search"
                        size="sm"
                        w={200}
                        rightSection={<ActionIcon variant="subtle" size="sm"><IconRefresh size={16} /></ActionIcon>}
                    />
                </Group>

                <Group mb="lg">
                    <Text size="sm" c="dimmed">Box Size: <strong>04 Pieces</strong></Text>
                    <Group c="dimmed" ml="auto">
                        Capacity: <Text c="blue" size="sm">06</Text>
                        Filled: <Text c="green" size="sm">04</Text>
                        Unfilled: <Text c="gray" size="sm">05</Text>
                    </Group>
                </Group>

                <Grid>
                    <GridCol span={6}>
                        <Card h="100%" shadow="sm" padding="md" radius="md" withBorder bg="white" style={{ minHeight: '600px' }}>
                            <Stack gap="xs" style={{ flex: 1, overflow: 'hidden' }}>
                                <Group justify="space-between" mb="md">
                                    <Title order={5} c="dark.8">Scanned Items</Title>
                                    <ActionIcon variant="subtle" size="sm">
                                        <IconRefresh size={16} />
                                    </ActionIcon>
                                </Group>

                                <Divider size="xs" my="xs" />

                                <Box style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                                    <Stack gap="md">
                                        {scannedItems.map((item) => (
                                            <Box key={item.id}>
                                                <Box p="md" style={{ border: '1px solid #e9ecef', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                                                    <Group justify="space-between" mb="xs">
                                                        <Group>
                                                            <IconBarcode size={16} color="#4c6ef5" />
                                                            <Text fw={500} c="blue">{item.type}</Text>
                                                        </Group>
                                                        <ActionIcon
                                                            variant="subtle"
                                                            size="sm"
                                                            onClick={() => toggleExpanded(item.id)}
                                                            style={{
                                                                transform: expandedItems.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                transition: 'transform 0.2s ease'
                                                            }}
                                                        >
                                                            <IconChevronDown size={16} />
                                                        </ActionIcon>
                                                    </Group>

                                                    <Group justify="space-between" mb="xs">
                                                        <Text size="sm" c="dimmed">Quantity: {item.quantity}</Text>
                                                        <Text size="sm" c="dimmed">Code: {item.code}</Text>
                                                    </Group>

                                                    <Progress value={item.progress} size="sm" color="blue" />
                                                    <Text size="xs" c="dimmed" mt="xs">{item.progress}%</Text>
                                                </Box>

                                                {/* Expanded Sub-items */}
                                                {expandedItems.includes(item.id) && item.subItems.length > 0 && (
                                                    <Box
                                                        ml="md"
                                                        mt="xs"
                                                        style={{
                                                            maxHeight: '200px',
                                                            overflowY: 'auto',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        {item.subItems.map((subItem) => (
                                                            <Box
                                                                key={subItem.id}
                                                                p="sm"
                                                                mb="xs"
                                                                style={{
                                                                    border: '1px solid #e9ecef',
                                                                    borderRadius: '6px',
                                                                    backgroundColor: '#fff'
                                                                }}
                                                            >
                                                                <Group justify="space-between" align="center">
                                                                    <Group>
                                                                        <IconBarcode size={14} color="#4c6ef5" />
                                                                        <Text fw={500} c="blue" size="sm">{subItem.type}</Text>
                                                                    </Group>
                                                                    <Group>
                                                                        <Badge color="green" size="sm" variant="light">
                                                                            {subItem.status}
                                                                        </Badge>
                                                                        <ActionIcon variant="subtle" size="sm">
                                                                            <IconChevronDown size={14} />
                                                                        </ActionIcon>
                                                                    </Group>
                                                                </Group>
                                                                <Group justify="space-between" mt="xs">
                                                                    <Text size="xs" c="dimmed">Bottles: {subItem.bottles}</Text>
                                                                    <Text size="xs" c="dimmed">Code: {subItem.code}</Text>
                                                                </Group>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>

                                <Button fullWidth mt="lg" color="blue" size="md">
                                    Generate QR Code
                                </Button>
                            </Stack>
                        </Card>
                    </GridCol>

                    <GridCol span={6}>
                        <Card shadow="sm" padding="md" radius="md" withBorder bg="white" style={{ minHeight: '600px' }}>
                            <Stack gap="xs">
                                <Group justify="space-between" mb="md">
                                    <Title order={5} c="dark.8">Barcode Preview</Title>
                                    <ActionIcon variant="subtle" size="sm">
                                        <IconRefresh size={16} />
                                    </ActionIcon>
                                </Group>

                                <Divider size="xs" my="xs" />

                                <Group mb="md">
                                    <Button
                                        variant={activeTab === 'Manual Scan' ? 'filled' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveTab('Manual Scan')}
                                    >
                                        Manual Scan
                                    </Button>
                                    <Button
                                        variant={activeTab === 'Auto Scan' ? 'filled' : 'outline'}
                                        size="sm"
                                        onClick={() => setActiveTab('Auto Scan')}
                                    >
                                        Auto Scan
                                    </Button>
                                </Group>

                                <Box
                                    p="xl"
                                    mb="md"
                                    style={{
                                        border: '2px dashed #4c6ef5',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        backgroundColor: '#f8f9ff'
                                    }}
                                >
                                    <IconBarcode size={48} color="#4c6ef5" style={{ margin: '0 auto 16px' }} />
                                    <Text c="blue" fw={500}>Scan your barcode here</Text>
                                </Box>

                                <Button fullWidth mb="lg" color="blue" size="md">
                                    Start Scan
                                </Button>

                                <Stack gap="xs">
                                    {scannedResults.map((result) => (
                                        <Box
                                            key={result.id}
                                            p="sm"
                                            style={{
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                backgroundColor: result.isCorrect ? '#f8f9fa' : '#fff5f5'
                                            }}
                                        >
                                            <Group justify="space-between" align="flex-start">
                                                <Box>
                                                    <Group>
                                                        <IconBarcode size={16} color="#4c6ef5" />
                                                        <Text fw={500} c="blue" size="sm">{result.name}</Text>
                                                    </Group>
                                                    <Text size="xs" c="dimmed">Code: {result.code}</Text>
                                                    <Text size="xs" c="dimmed">Item: {result.item}</Text>
                                                </Box>
                                                {!result.isCorrect && (
                                                    <ActionIcon variant="subtle" size="sm" color="red">
                                                        <IconX size={14} />
                                                    </ActionIcon>
                                                )}
                                            </Group>
                                            {!result.isCorrect && (
                                                <Text size="xs" color="red" mt="xs">
                                                    This barcode is not correct
                                                </Text>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </Stack>
                        </Card>
                    </GridCol>
                </Grid>
            </Card>
        </Container>
    )
}

export default ScanProductionOrder;