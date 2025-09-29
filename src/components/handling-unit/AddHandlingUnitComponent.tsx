'use client';

import { customStyles } from '@/styles/custom-theme';
import { ActionIcon, Box, Button, Card, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import { IconMinus } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import TitleComponent from '../common/component-title';
import { addHandlingUnit } from '@/redux/actions/handling-unit-actions/handling-unit-actions';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { useAppDispatch } from '@/redux/store';

interface BaseUnit {
    name: string;
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
    const dispatch = useAppDispatch();
    // Simplified section state - only one active section at a time
    const [activeSection, setActiveSection] = useState<'group' | 'base' | 'handling' | null>('group')

    const [isGroupPreviewVisible, setIsGroupPreviewVisible] = useState(true)
    // Form data states
    const [groupName, setGroupName] = useState('')
    const [baseUnits, setBaseUnits] = useState<BaseUnit[]>([])
    const [handlingUnits, setHandlingUnits] = useState<HandlingUnit[]>([])

    // Current form inputs
    const [currentBaseUnit, setCurrentBaseUnit] = useState<BaseUnit>({ name: '' })
    const [currentHandlingUnit, setCurrentHandlingUnit] = useState<HandlingUnit>({
        name: '',
        containedWith: '',
        quantity: ''
    })

    const handleGroupPreviewToggle = () => {
        setIsGroupPreviewVisible(!isGroupPreviewVisible)
    }

    // Reset all form data
    const resetForm = () => {
        setGroupName('')
        setBaseUnits([])
        setHandlingUnits([])
        setCurrentBaseUnit({ name: '' })
        setCurrentHandlingUnit({ name: '', containedWith: '', quantity: '' })
        setActiveSection('group')
    }

    // Memoized preview data - recalculates only when dependencies change
    const groupPreviewData = useMemo(() => {
        if (!groupName.trim()) return []

        const group: GroupPreviewItem = {
            name: groupName,
            type: 'group',
            children: []
        }

        // Create a map to store all units for easy lookup
        const unitsMap = new Map<string, GroupPreviewItem>()

        // Add base units first
        baseUnits.forEach(baseUnit => {
            const baseItem: GroupPreviewItem = {
                name: baseUnit.name,
                type: 'base',
                units: '1',
                children: []
            }
            unitsMap.set(baseUnit.name.toLowerCase(), baseItem)
            group.children?.push(baseItem)
        })

        // Add handling units based on their "Contained With" relationship, sorted by quantity
        handlingUnits
            .sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity)) // Sort by quantity ascending
            .forEach(handlingUnit => {
                const handlingItem: GroupPreviewItem = {
                    name: handlingUnit.name,
                    type: 'handling',
                    quantity: handlingUnit.quantity,
                    units: handlingUnit.containedWith + 's',
                    children: []
                }

                // Find the parent unit (what this handling unit is contained with)
                const parentUnit = unitsMap.get(handlingUnit.containedWith.toLowerCase())

                if (parentUnit) {
                    // Add this handling unit as a child of its parent
                    parentUnit.children?.push(handlingItem)
                    // Sort children by quantity after adding
                    if (parentUnit.children) {
                        parentUnit.children.sort((a, b) => {
                            const aQty = parseInt(a.quantity || '0')
                            const bQty = parseInt(b.quantity || '0')
                            return aQty - bQty
                        })
                    }
                } else {
                    // If parent not found, add to group level (fallback)
                    group.children?.push(handlingItem)
                }

                // Add this handling unit to the map for future references
                unitsMap.set(handlingUnit.name.toLowerCase(), handlingItem)
            })

        return [group]
    }, [groupName, baseUnits, handlingUnits])

    // Memoized API payload - recalculates only when dependencies change  
    const apiPayload = useMemo(() => {
        if (!groupName.trim() || baseUnits.length === 0) return null

        const baseUnit = baseUnits[0] // Assuming first base unit is the main stage

        const buildSubStages = (parentName: string, currentLevel: number = 2): any[] => {
            return handlingUnits
                .filter(hu => hu.containedWith.toLowerCase() === parentName.toLowerCase())
                .sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity)) // Sort by quantity ascending
                .map((hu, index) => {
                    return {
                        name: hu.name,
                        level: currentLevel,
                        description: hu.name,
                        capacity: parseInt(hu.quantity),
                        subStages: buildSubStages(hu.name, currentLevel + 1)
                    }
                })
        }

        const stage = {
            name: baseUnit.name,
            level: 1,
            description: baseUnit.name,
            capacity: 1,
            subStages: buildSubStages(baseUnit.name, 2)
        }

        return {
            name: groupName,
            stage: stage
        }
    }, [groupName, baseUnits, handlingUnits])

    // Memoized options for "Contained With" select - now only base units for first level
    const availableUnits = useMemo(() => [
        // Include base units as options
        ...baseUnits.map(unit => ({
            value: unit.name.toLowerCase(),
            label: unit.name
        }))
    ], [baseUnits])

    // Computed validation states
    const isGroupNameValid = groupName.trim().length > 0
    const isBaseUnitValid = currentBaseUnit.name.trim().length > 0
    const isHandlingUnitValid = currentHandlingUnit.name.trim().length > 0 &&
        currentHandlingUnit.containedWith.trim().length > 0 &&
        currentHandlingUnit.quantity.trim().length > 0

    const handleNextFromGroupDetails = () => {
        if (isGroupNameValid) {
            setActiveSection('base')
        }
    }

    const handleAddBaseUnit = () => {
        if (isBaseUnitValid) {
            setBaseUnits([...baseUnits, currentBaseUnit])
            // Auto-select the base unit in the "Contained With" field
            setCurrentHandlingUnit(prev => ({
                ...prev,
                containedWith: currentBaseUnit.name
            }))
            setActiveSection('handling')
        }
    }

    const handleAddHandlingUnit = () => {
        if (isHandlingUnitValid) {
            setHandlingUnits([...handlingUnits, currentHandlingUnit])
            setCurrentHandlingUnit({ name: '', containedWith: currentBaseUnit.name, quantity: '' })
        }
    }

    const handleToggleSection = (section: 'group' | 'base' | 'handling') => {
        // Only allow opening sections based on progression
        if (section === 'group') {
            setActiveSection(activeSection === 'group' ? null : 'group')
        } else if (section === 'base' && isGroupNameValid) {
            setActiveSection(activeSection === 'base' ? null : 'base')
        } else if (section === 'handling' && baseUnits.length > 0) {
            setActiveSection(activeSection === 'handling' ? null : 'handling')
        }
    }

    // Delete handlers for individual items
    const handleDeleteBaseUnit = (unitName: string) => {
        // Remove the base unit
        const updatedBaseUnits = baseUnits.filter(unit => unit.name !== unitName)
        setBaseUnits(updatedBaseUnits)

        // Get all handling units that will be affected by this deletion
        const getChildUnits = (parentName: string): string[] => {
            const children = handlingUnits
                .filter(hu => hu.containedWith.toLowerCase() === parentName.toLowerCase())
                .map(hu => hu.name)

            const allChildren = [...children]
            children.forEach(child => {
                allChildren.push(...getChildUnits(child))
            })

            return allChildren
        }

        const unitsToDelete = getChildUnits(unitName)

        // Remove all affected handling units
        const updatedHandlingUnits = handlingUnits.filter(unit =>
            !unitsToDelete.includes(unit.name)
        )
        setHandlingUnits(updatedHandlingUnits)
    }

    const handleDeleteHandlingUnit = (unitName: string) => {
        // Get all units that will be affected by this deletion (the unit itself + its children)
        const getChildUnits = (parentName: string): string[] => {
            const children = handlingUnits
                .filter(hu => hu.containedWith.toLowerCase() === parentName.toLowerCase())
                .map(hu => hu.name)

            const allChildren = [...children]
            children.forEach(child => {
                allChildren.push(...getChildUnits(child))
            })

            return allChildren
        }

        const unitsToDelete = [unitName, ...getChildUnits(unitName)]

        // Remove the handling unit and any units that were contained with it (cascading delete)
        const updatedHandlingUnits = handlingUnits.filter(unit =>
            !unitsToDelete.includes(unit.name)
        )
        setHandlingUnits(updatedHandlingUnits)
    }

    // Handle response from API
    const handleResponse = (status: number) => {
        const errorResponseCodes = {
            400: "Bad Request - Invalid data provided",
            500: "Server Error - Please try again later",
            409: "Conflict - Handling Unit with this name already exists"
        }

        if (status === 200 || status === 201) {
            showNotificationToast("Handling Unit Added", "Handling Unit added successfully", customStyles.colors._408CCE);
            resetForm();
            return;
        }

        if (errorResponseCodes[status as keyof typeof errorResponseCodes]) {
            showNotificationToast("Error Adding Handling Unit", errorResponseCodes[status as keyof typeof errorResponseCodes], customStyles.colors.red);
            return;
        }
    }

    // Add handling unit to API
    const onAddHandlingUnit = () => {
        if (apiPayload) {
            dispatch(addHandlingUnit({ body: apiPayload, resHandler: handleResponse }))
        }
    }

    const renderGroupPreviewItem = (item: GroupPreviewItem, level: number = 0) => {
        // Create tree-like structure with proper Unicode characters
        const getTreePrefix = (level: number) => {
            if (level === 0) return ''
            return '└── '
        }

        // Check if this item has children (for cascading delete warning)
        const hasChildren = item.children && item.children.length > 0

        const indentStyle = {
            paddingLeft: `${level * 24}px`,
            borderLeft: level > 0 ? `2px solid ${customStyles.colors._E1E7EC}` : 'none',
            marginLeft: level > 0 ? '12px' : '0px'
        }

        return (
            <Stack gap={4} key={`${item.name}-${level}`}>
                <Box style={indentStyle} py={4}>
                    <Group align="center" gap={8} justify="space-between">
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
                        </Group>

                        <Group gap={4}>
                            {/* Delete button for individual items (base and handling units) */}
                            {level > 0 && (
                                <ActionIcon
                                    variant="light"
                                    size="sm"
                                    color="red"
                                    onClick={() => {
                                        if (item.type === 'base') {
                                            handleDeleteBaseUnit(item.name)
                                        } else if (item.type === 'handling') {
                                            handleDeleteHandlingUnit(item.name)
                                        }
                                    }}
                                    title={hasChildren
                                        ? `Delete ${item.name} and all its children`
                                        : `Delete ${item.name}`
                                    }
                                    style={{
                                        transition: 'all 0.2s ease',
                                        opacity: 0.7
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = '1'
                                        e.currentTarget.style.transform = 'scale(1.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = '0.7'
                                        e.currentTarget.style.transform = 'scale(1)'
                                    }}
                                >
                                    <IconMinus size={14} />
                                </ActionIcon>
                            )}

                            {/* Reset all button for group level (level 0) */}
                            {level === 0 && (
                                <ActionIcon
                                    variant="light"
                                    size="md"
                                    color={customStyles.colors.red}
                                    onClick={resetForm}
                                    title="Reset all"
                                >
                                    <IconMinus size={16} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Group>
                </Box>
                {/* Render children */}
                {item.children && item.children.map(child =>
                    renderGroupPreviewItem(child, level + 1)
                )}
            </Stack>
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

                        {activeSection === 'group' && (
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
                                            className={!isGroupNameValid ? "filledButtonDisabled" : "filledButton"}
                                            size="sm"
                                            radius={8}
                                            onClick={handleNextFromGroupDetails}
                                            disabled={!isGroupNameValid}
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
                                cursor: isGroupNameValid ? 'pointer' : 'not-allowed',
                                opacity: isGroupNameValid ? 1 : 0.6
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
                                disabled={!isGroupNameValid}
                            >
                                <IconMinus size={16} />
                            </ActionIcon>
                        </Group>

                        {activeSection === 'base' && (
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
                                        label="Base Unit Name"
                                        placeholder="e.g., Bottle, Piece, Item"
                                        value={currentBaseUnit.name}
                                        onChange={(e) => setCurrentBaseUnit(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        required
                                    />
                                    <Group justify="flex-end">
                                        <Button
                                            variant="transparent"
                                            className={!isBaseUnitValid ? "filledButtonDisabled" : "filledButton"}
                                            size="sm"
                                            radius={8}
                                            onClick={handleAddBaseUnit}
                                            disabled={!isBaseUnitValid}
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

                        {activeSection === 'handling' && (
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

                                        <TextInput
                                            radius={8}
                                            size='md'
                                            label="Contained With"
                                            placeholder="Base Unit"
                                            value={currentHandlingUnit.containedWith}
                                            readOnly
                                            required
                                        />
                                    </Group>
                                    <TextInput
                                        radius={8}
                                        size='md'
                                        label="Quantity"
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
                                            className={!isHandlingUnitValid ? "filledButtonDisabled" : "filledButton"}
                                            size="sm"
                                            radius={8}
                                            onClick={handleAddHandlingUnit}
                                            disabled={!isHandlingUnitValid}
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
                            <Group justify="space-between" align="center">
                                <Text size="lg" fw={600} c={customStyles.colors._4D4D4D}>
                                    Grouping Preview
                                </Text>
                                <ActionIcon
                                    variant="light"
                                    size="md"
                                    c={customStyles.colors._1B59F8}
                                    onClick={handleGroupPreviewToggle}
                                    title="Reset all"
                                >
                                    <IconMinus size={16} />
                                </ActionIcon>
                            </Group>
                            {
                                isGroupPreviewVisible && <Box
                                    p="md"
                                    style={{
                                        backgroundColor: customStyles.colors._F5F7FA,
                                        borderRadius: '8px',
                                    }}
                                >
                                    {groupPreviewData.map(item => renderGroupPreviewItem(item))}
                                </Box>
                            }
                            {(baseUnits.length > 0 || handlingUnits.length > 0) && (
                                <Group justify="space-between" mt="lg">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color={customStyles.colors._1B59F8}
                                        onClick={onAddHandlingUnit}
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