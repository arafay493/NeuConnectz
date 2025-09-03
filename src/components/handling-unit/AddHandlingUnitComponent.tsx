'use client';

import { Box, Stack, Card, Group, Text, TextInput, Button, ActionIcon, Select } from '@mantine/core'
import TitleComponent from '../common/component-title'
import { IconMinus, IconChevronDown } from '@tabler/icons-react'
import { useState } from 'react'
import { customStyles } from '@/styles/custom-theme'

interface BaseUnit {
    name: string;
    volume: string;
}

interface HandlingUnit {
    name: string;
    containedWith: string;
    quantity: string;
}

interface GroupPreviewItem {
    name: string;
    type: 'group' | 'base' | 'handling';
    quantity?: string;
    units?: string;
    children?: GroupPreviewItem[];
}

const AddHandlingUnitComponent = () => {
    // State for form sections
    const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(true)
    const [isBaseLevelOpen, setIsBaseLevelOpen] = useState(false)
    const [isHandlingUnitOpen, setIsHandlingUnitOpen] = useState(false)

    // Form data states
    const [groupName, setGroupName] = useState('')
    const [baseUnits, setBaseUnits] = useState<BaseUnit[]>([])
    const [handlingUnits, setHandlingUnits] = useState<HandlingUnit[]>([])

    // Current form inputs
    const [currentBaseUnit, setCurrentBaseUnit] = useState<BaseUnit>({ name: '', volume: '' })
    const [currentHandlingUnit, setCurrentHandlingUnit] = useState<HandlingUnit>({
        name: '',
        containedWith: '',
        quantity: ''
    })

    // Dynamic data for preview - starts empty
    const [groupPreview, setGroupPreview] = useState<GroupPreviewItem[]>([])

    // Helper function to build proper hierarchical structure
    const buildGroupPreview = () => {
        if (!groupName.trim()) return []

        const group: GroupPreviewItem = {
            name: groupName,
            type: 'group',
            children: []
        }

        // Build nested hierarchy: each handling unit becomes child of previous
        let currentParent = group

        // Add base units first (they are the foundation)
        if (baseUnits.length > 0) {
            baseUnits.forEach(baseUnit => {
                const baseItem: GroupPreviewItem = {
                    name: baseUnit.name,
                    type: 'base',
                    units: baseUnit.volume,
                    children: []
                }
                currentParent.children?.push(baseItem)
                currentParent = baseItem // This becomes the parent for handling units
            })
        }

        // Add handling units in sequence, each containing the previous
        handlingUnits.forEach(handlingUnit => {
            const handlingItem: GroupPreviewItem = {
                name: handlingUnit.name,
                type: 'handling',
                quantity: handlingUnit.quantity,
                units: handlingUnit.containedWith + 's',
                children: currentParent.children ? [...currentParent.children] : []
            }

            // Replace current parent's children with this handling unit
            currentParent.children = [handlingItem]
            currentParent = handlingItem
        })

        return [group]
    }

    const handleNextFromGroupDetails = () => {
        if (groupName.trim()) {
            setIsGroupDetailsOpen(false)
            setIsBaseLevelOpen(true)
            // Update preview immediately
            setGroupPreview(buildGroupPreview())
        }
    }

    const handleAddBaseUnit = () => {
        if (currentBaseUnit.name.trim() && currentBaseUnit.volume.trim()) {
            setBaseUnits([...baseUnits, currentBaseUnit])
            // setCurrentBaseUnit({ name: '', volume: '' })
            setIsBaseLevelOpen(false)
            setIsHandlingUnitOpen(true)
            // Update preview with new base unit
            setGroupPreview(buildGroupPreview())
        }
    }

    const handleAddHandlingUnit = () => {
        if (currentHandlingUnit.name.trim() && currentHandlingUnit.containedWith.trim() && currentHandlingUnit.quantity.trim()) {
            setHandlingUnits([...handlingUnits, currentHandlingUnit])
            setCurrentHandlingUnit({ name: '', containedWith: '', quantity: '' })
            // Update preview with new handling unit
            setGroupPreview(buildGroupPreview())
        }
    }

    const handleToggleSection = (section: 'group' | 'base' | 'handling') => {
        // Only allow opening previous sections if they have data
        if (section === 'group') {
            setIsGroupDetailsOpen(!isGroupDetailsOpen)
            if (isGroupDetailsOpen) {
                setIsBaseLevelOpen(false)
                setIsHandlingUnitOpen(false)
            }
        } else if (section === 'base' && groupName.trim()) {
            setIsBaseLevelOpen(!isBaseLevelOpen)
            if (isBaseLevelOpen) {
                setIsHandlingUnitOpen(false)
            }
        } else if (section === 'handling' && baseUnits.length > 0) {
            setIsHandlingUnitOpen(!isHandlingUnitOpen)
        }
    }

    const renderGroupPreviewItem = (item: GroupPreviewItem, level: number = 0) => {
        // Create tree-like structure with proper Unicode characters
        const getTreePrefix = (level: number) => {
            if (level === 0) return ''
            return '└── '
        }

        const indentStyle = {
            paddingLeft: `${level * 24}px`,
            borderLeft: level > 0 ? `2px solid ${customStyles.colors._E1E7EC}` : 'none',
            marginLeft: level > 0 ? '12px' : '0px'
        }

        return (
            <Box key={`${item.name}-${level}`}>
                <Box style={indentStyle} py={4}>
                    <Group align="center" gap={8}>
                        <Text
                            size={level === 0 ? "xl" : "md"}
                            fw={level === 0 ? 600 : 500}
                            c={customStyles.colors._4D4D4D}
                            style={{
                                fontFamily: 'monospace',
                                whiteSpace: 'pre'
                            }}
                        >
                            {getTreePrefix(level)}{item.name}
                        </Text>
                        {item.quantity && item.units ? (
                            <Text size="sm" c={customStyles.colors._909090}>
                                ({item.quantity} {item.units})
                            </Text>
                        ) : item.units && (
                            <Text size="sm" c={customStyles.colors._909090}>
                                ({item.units})
                            </Text>
                        )}
                        {level === 0 && (
                            <ActionIcon
                                variant="light"
                                size="md"
                                c={customStyles.colors._1B59F8}
                                onClick={() => {
                                    // Handle remove group
                                    setGroupName('')
                                    setBaseUnits([])
                                    setHandlingUnits([])
                                    setGroupPreview([])
                                    setIsBaseLevelOpen(false)
                                    setIsHandlingUnitOpen(false)
                                }}
                                ml="auto"
                            >
                                <IconMinus size={16} />
                            </ActionIcon>
                        )}
                    </Group>
                </Box>
                {/* Render children */}
                {item.children && item.children.map(child =>
                    renderGroupPreviewItem(child, level + 1)
                )}
            </Box>
        )
    }

    return (
        <Box>
            <TitleComponent
                title="Add Handling Unit"
                description="Create and manage Handling Unit for your products."
            />

            <Stack gap={24} mt={24}>
                {/* Group Details Section */}
                <Card radius={16} p={24}>
                    <Stack>
                        <Group
                            justify="space-between"
                            align="center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleToggleSection('group')}
                        >
                            <Text size="lg" fw={600} c={customStyles.colors._4D4D4D}>
                                Group Details
                            </Text>
                            <ActionIcon
                                variant="light"
                                size="md"
                                c={customStyles.colors._1B59F8}
                            >
                                <IconMinus size={16} />
                            </ActionIcon>
                        </Group>

                        {isGroupDetailsOpen && (
                            <Box
                                p={16}
                                bg={customStyles.colors._F5F7FA}
                                style={{
                                    borderRadius: '8px'
                                }}
                            >
                                <Stack gap="md">
                                    <TextInput
                                        radius={8}
                                        size='md'
                                        label="Group Name"
                                        placeholder="Enter Group Name"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        required
                                    />
                                    <Group justify="flex-end">
                                        <Button
                                            variant="transparent"
                                            className={!groupName.trim() ? "filledButtonDisabled" : "filledButton"}
                                            size="sm"
                                            radius={8}
                                            onClick={handleNextFromGroupDetails}
                                            disabled={!groupName.trim()}
                                        >
                                            Next
                                        </Button>
                                    </Group>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Card>

                {/* Base Level Details Section */}
                <Card radius={16} p={24}>
                    <Stack>
                        <Group
                            justify="space-between"
                            align="center"
                            style={{
                                cursor: groupName.trim() ? 'pointer' : 'not-allowed',
                                opacity: groupName.trim() ? 1 : 0.6
                            }}
                            onClick={() => handleToggleSection('base')}
                        >
                            <Text size="lg" fw={600} c={customStyles.colors._4D4D4D}>
                                Base Level Details
                            </Text>
                            <ActionIcon
                                variant="light"
                                size="md"
                                c={customStyles.colors._1B59F8}
                                disabled={!groupName.trim()}
                            >
                                <IconMinus size={16} />
                            </ActionIcon>
                        </Group>

                        {isBaseLevelOpen && (
                            <Box
                                p={16}
                                bg={customStyles.colors._F5F7FA}
                                style={{
                                    borderRadius: '8px'
                                }}
                            >
                                <Stack gap="md">
                                    <Group grow>
                                        <TextInput
                                            radius={8}
                                            size='md'
                                            label="Base Unit Name"
                                            placeholder="e.g., Bottle, Piece, Item"
                                            value={currentBaseUnit.name}
                                            onChange={(e) => setCurrentBaseUnit(prev => ({
                                                ...prev,
                                                name: e.target.value
                                            }))}
                                            required
                                        />
                                        <TextInput
                                            radius={8}
                                            size='md'
                                            label="Volume (Liters)"
                                            placeholder="5 Liter"
                                            value={currentBaseUnit.volume}
                                            onChange={(e) => setCurrentBaseUnit(prev => ({
                                                ...prev,
                                                volume: e.target.value
                                            }))}
                                            required
                                        />
                                    </Group>
                                    <Group justify="flex-end">
                                        <Button
                                            variant="transparent"
                                            className={!currentBaseUnit.name.trim() || !currentBaseUnit.volume.trim() ? "filledButtonDisabled" : "filledButton"}
                                            size="sm"
                                            radius={8}
                                            onClick={handleAddBaseUnit}
                                            disabled={!currentBaseUnit.name.trim() || !currentBaseUnit.volume.trim()}
                                        >
                                            Add Base Unit
                                        </Button>
                                    </Group>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Card>

                {/* Create Handling Unit Groups Section */}
                <Card radius={16} p={24}>
                    <Stack>
                        <Group
                            justify="space-between"
                            align="center"
                            style={{
                                cursor: baseUnits.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: baseUnits.length > 0 ? 1 : 0.6
                            }}
                            onClick={() => handleToggleSection('handling')}
                        >
                            <Text size="lg" fw={600} c={customStyles.colors._4D4D4D}>
                                Create Handling Unit Groups
                            </Text>
                            <ActionIcon
                                variant="light"
                                size="md"
                                c={customStyles.colors._1B59F8}
                                disabled={baseUnits.length === 0}
                            >
                                <IconMinus size={16} />
                            </ActionIcon>
                        </Group>

                        {isHandlingUnitOpen && (
                            <Box
                                p={16}
                                bg={customStyles.colors._F5F7FA}
                                style={{
                                    borderRadius: '8px'
                                }}
                            >
                                <Stack gap="md">
                                    <Group grow>
                                        <TextInput
                                            radius={8}
                                            size='md'
                                            label="Unit Name"
                                            placeholder="e.g., Box Pallet, Truck"
                                            value={currentHandlingUnit.name}
                                            onChange={(e) => setCurrentHandlingUnit(prev => ({
                                                ...prev,
                                                name: e.target.value
                                            }))}
                                            required
                                        />

                                        <Select
                                            radius={8}
                                            size='md'
                                            label="Contained With"
                                            placeholder="Select Parent Unit"
                                            data={[
                                                // Include base units as options
                                                ...baseUnits.map(unit => ({
                                                    value: unit.name.toLowerCase(),
                                                    label: unit.name
                                                })),
                                                // Include previously created handling units
                                                ...handlingUnits.map(unit => ({
                                                    value: unit.name.toLowerCase(),
                                                    label: unit.name
                                                }))
                                            ]}
                                            value={currentHandlingUnit.containedWith}
                                            onChange={(value) => setCurrentHandlingUnit(prev => ({
                                                ...prev,
                                                containedWith: value || ''
                                            }))}
                                            required
                                            clearable
                                        />
                                    </Group>
                                    <TextInput
                                        radius={8}
                                        size='md'
                                        label="Quantity of Base/Child Units"
                                        placeholder="Enter Quantity"
                                        value={currentHandlingUnit.quantity}
                                        onChange={(e) => setCurrentHandlingUnit(prev => ({
                                            ...prev,
                                            quantity: e.target.value
                                        }))}
                                        required
                                    />
                                    <Group justify="flex-end">
                                        <Button
                                            variant="transparent"
                                            className={
                                                !currentHandlingUnit.name.trim() ||
                                                    !currentHandlingUnit.containedWith.trim() ||
                                                    !currentHandlingUnit.quantity.trim() ? "filledButtonDisabled" : "filledButton"
                                            }
                                            size="sm"
                                            radius={8}
                                            onClick={handleAddHandlingUnit}
                                            disabled={
                                                !currentHandlingUnit.name.trim() ||
                                                !currentHandlingUnit.containedWith.trim() ||
                                                !currentHandlingUnit.quantity.trim()
                                            }
                                        >
                                            Add Handling Unit
                                        </Button>
                                    </Group>
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                </Card>

                {/* Grouping Preview Section */}
                {groupName.trim() && (
                    <Card radius={8} p={24} style={{ backgroundColor: customStyles.colors.white }}>
                        <Stack gap="md">
                            <Text size="lg" fw={600} c={customStyles.colors._4D4D4D}>
                                Grouping Preview
                            </Text>
                            <Box
                                p="md"
                                style={{
                                    backgroundColor: customStyles.colors._F5F7FA,
                                    borderRadius: '8px',
                                }}
                            >
                                {buildGroupPreview().map(item => renderGroupPreviewItem(item))}
                            </Box>
                            {(baseUnits.length > 0 || handlingUnits.length > 0) && (
                                <Group justify="space-between" mt="lg">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={() => {
                                            // Handle cancel - reset all form data
                                            setGroupName('')
                                            setBaseUnits([])
                                            setHandlingUnits([])
                                            setCurrentBaseUnit({ name: '', volume: '' })
                                            setCurrentHandlingUnit({ name: '', containedWith: '', quantity: '' })
                                            setGroupPreview([])
                                            setIsGroupDetailsOpen(true)
                                            setIsBaseLevelOpen(false)
                                            setIsHandlingUnitOpen(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color={customStyles.colors._1B59F8}
                                        onClick={() => {
                                            // Handle create
                                            const finalGroupStructure = buildGroupPreview()
                                            console.log('Creating handling unit...', {
                                                groupName,
                                                baseUnits,
                                                handlingUnits,
                                                finalStructure: finalGroupStructure
                                            })
                                        }}
                                    >
                                        Create
                                    </Button>
                                </Group>
                            )}
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Box>
    )
}

export default AddHandlingUnitComponent