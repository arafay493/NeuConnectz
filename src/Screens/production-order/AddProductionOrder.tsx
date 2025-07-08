'use client';

import AddHandlingUnitCard from '@/components/handling-units/AddHandlingUnitCard';
import HandlingUnitCard from '@/components/handling-units/HandlingUnitCard';
import CheckboxDropdownSelect from '@/components/input-components/CheckboxDropdownSelect';
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Container,
    Grid,
    GridCol,
    Group,
    NumberInput,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import {
    IconBuilding,
    IconMinus,
    IconPlus,
    IconSearch
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface Warehouse {
    id: string;
    whsCode: string;
    whsName: string;
    isReceiver: boolean;
}

interface HandlingUnitLevel {
    id: string;
    level: string;
    size: string;
}

const AddProductionOrder = () => {
    const [formData, setFormData] = useState({
        docNumber: '',
        date: new Date(),
        itemCode: '',
        itemName: '',
        unitOfMeasurement: '',
        productionLine: '',
        planQuantity: 0,
        actualQuantity: 0,
        warehouse: '',
    });

    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [handlingUnits, setHandlingUnits] = useState<HandlingUnitLevel[]>(
        [{ id: '1', level: 'Level 01', size: 'Size 1 x 1"' },
        { id: '2', level: 'Level 02', size: 'Size 1 x 1"' },
        { id: '3', level: 'Level 03', size: 'Size 1 x 1"' },
        { id: '4', level: 'Level 04', size: 'Size 1 x 1"' },
        { id: '5', level: 'Level 05', size: 'Size 1 x 1"' },
        ]);

    // Mock API call to fetch warehouses
    useEffect(() => {
        const fetchWarehouses = async () => {
            // This would be your actual API call
            const mockWarehouses: Warehouse[] = [
                { id: '1', whsCode: '12345', whsName: 'Warehouse 01', isReceiver: false },
                { id: '2', whsCode: '56647', whsName: 'Warehouse 02', isReceiver: false },
                { id: '3', whsCode: '65765', whsName: 'Warehouse 03', isReceiver: false },
                { id: '4', whsCode: '43222', whsName: 'Warehouse 04', isReceiver: true },
                { id: '5', whsCode: '43222', whsName: 'Warehouse 04', isReceiver: true },
                { id: '6', whsCode: '43222', whsName: 'Warehouse 04', isReceiver: true },
                { id: '7', whsCode: '43222', whsName: 'Warehouse 04', isReceiver: true },
            ];
            setWarehouses(mockWarehouses);
        };

        fetchWarehouses();
    }, []);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddLevel = () => {
        const newLevel = {
            id: (handlingUnits.length + 1).toString(),
            level: `Level ${String(handlingUnits.length + 1).padStart(2, '0')}`,
            size: 'Size 1 x 1"'
        };
        setHandlingUnits([...handlingUnits, newLevel]);
    };

    const handleRemoveLevel = (id: string) => {
        setHandlingUnits(handlingUnits.filter(unit => unit.id !== id));
    };

    const handleEditLevel = (id: string) => {
        console.log('Edit level:', id);
    };

    const handleSave = () => {
        console.log('Save production order:', formData, handlingUnits);
        // API call to save production order
    };

    const handleCancel = () => {
        console.log('Cancel');
        // Navigate back or reset form
    };

    return (
        <Container size="xl" p="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xl">
                    {/* Header */}
                    <Group justify="space-between" align="center">
                        <Group gap="sm">
                            <Text size="sm" c="gray.6">Document No:</Text>
                            <Text size="lg" fw={600} c="#4c6ef5">#12345</Text>
                        </Group>
                        <Group gap="sm">
                            <Text size="sm" c="gray.6">Date:</Text>
                            <Text size="lg" fw={500}>5/30/2025</Text>
                        </Group>
                    </Group>

                    {/* Basic Information */}
                    <Grid>
                        <GridCol span={{ base: 12, md: 4 }}>
                            <TextInput
                                size='md'
                                label="Item Code"
                                placeholder="Enter your answer"
                                value={formData.itemCode}
                                onChange={(e) => handleInputChange('itemCode', e.target.value)}
                                radius={8}
                            // leftSection={<IconBarcode size={16} />}
                            />
                        </GridCol>
                        <GridCol span={{ base: 12, md: 4 }}>
                            <TextInput
                                size='md'
                                label="Item Name"
                                placeholder="Enter your answer"
                                value={formData.itemName}
                                onChange={(e) => handleInputChange('itemName', e.target.value)}
                                radius={8}
                            />
                        </GridCol>
                        <GridCol span={{ base: 12, md: 4 }}>
                            <TextInput
                                size='md'
                                label="Unit of Measurement"
                                placeholder="Enter your answer"
                                value={formData.unitOfMeasurement}
                                onChange={(e) => handleInputChange('unitOfMeasurement', e.target.value)}
                                radius={8}
                            />
                        </GridCol>
                    </Grid>

                    {/* Production and Quantity */}
                    <Grid>
                        <GridCol span={{ base: 12, md: 4 }}>
                            <CheckboxDropdownSelect
                                options={['Production Line 1', 'Production Line 2', 'Production Line 3']}
                                placeholder='Select Production Line'
                                isFlex
                                label='Production Line'
                                selectedValue={formData.productionLine}
                                setSelectedValue={(value) => handleInputChange('productionLine', value)}
                            />
                        </GridCol>
                        <GridCol span={{ base: 12, md: 4 }}>
                            <Box>
                                <Text size="sm" fw={500} mb="2px">Plan Quantity</Text>
                                <Group gap="xs">
                                    <ActionIcon
                                        variant="light"
                                        color="gray"
                                        onClick={() => handleInputChange('planQuantity', formData.planQuantity > 0 ? formData.planQuantity - 1 : 0)}
                                    >
                                        <IconMinus size={16} />
                                    </ActionIcon>
                                    <NumberInput
                                        size='md'
                                        flex={1}
                                        value={formData.planQuantity}
                                        onChange={(value) => handleInputChange('planQuantity', value || 0)}
                                        min={0}
                                        hideControls
                                        radius={8}
                                        styles={{ input: { textAlign: 'center' } }}
                                    />
                                    <ActionIcon
                                        variant="light"
                                        color="blue"
                                        onClick={() => handleInputChange('planQuantity', formData.planQuantity + 1)}
                                    >
                                        <IconPlus size={16} />
                                    </ActionIcon>
                                </Group>
                            </Box>
                        </GridCol>
                        <GridCol span={{ base: 12, md: 4 }}>
                            <TextInput
                                size='md'
                                label="Actual Quantity"
                                placeholder="Enter your answer"
                                value={formData.actualQuantity}
                                onChange={(e) => handleInputChange('actualQuantity', e.target.value)}
                                radius={8}
                            />
                        </GridCol>
                    </Grid>

                    {/* Warehouse Selection */}
                    <Box bg="#00000002" p={16} style={{ border: "1px solid #d9d7db", borderRadius: '8px' }}>
                        <Group justify="space-between" mb="md">
                            <Text size="lg" fw={500}>Warehouse</Text>
                            <TextInput
                                size="md"
                                value={formData.warehouse}
                                onChange={(e) => handleInputChange('warehouse', e.target.value)}
                                placeholder="Search"
                                leftSection={<IconSearch size={16} />}
                                w={200}
                                radius={8}
                            />
                        </Group>

                        <Grid>
                            {warehouses.map((warehouse) => (
                                <GridCol key={warehouse.id} span={{ base: 6, sm: 4, md: 3, lg: 2 }}>
                                    <Card
                                        padding="md"
                                        radius="md"
                                        withBorder
                                        style={{
                                            cursor: 'pointer',
                                            border: formData.warehouse === warehouse.id ? '2px solid #4c6ef5' : '1px solid #e9ecef',
                                            backgroundColor: formData.warehouse === warehouse.id ? '#f3f8fe' : '#fff',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() => handleInputChange('warehouse', warehouse.id)}
                                    >
                                        <Stack gap="xs" align="center">
                                            <IconBuilding
                                                size={32}
                                                color={formData.warehouse === warehouse.id ? '#4c6ef5' : '#868e96'}
                                            />
                                            <Text size="sm" fw={600} c="#4c6ef5">
                                                {warehouse.whsCode}
                                            </Text>
                                            <Text size="xs" ta="center" c="gray.6">
                                                {warehouse.whsName}
                                            </Text>
                                        </Stack>
                                    </Card>
                                </GridCol>
                            ))}
                        </Grid>
                    </Box>

                    {/* Handling Units */}
                    <Box>
                        <Box mb="md" bg="#00000002" p={16} style={{ border: "1px solid #d9d7db", borderRadius: '8px' }}>
                            <Text size="lg" fw={500} mb="md">Handling Unit</Text>

                            <Grid>
                                {handlingUnits.map((unit) => (
                                    <GridCol key={unit.id} span={{ base: 12, sm: 6, md: 4 }}>
                                        <HandlingUnitCard
                                            title={unit.level}
                                            size={unit.size}
                                        />
                                    </GridCol>
                                ))}

                                {/* Add Level Card */}
                                <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                                    <AddHandlingUnitCard
                                        label='Add Level'
                                    />
                                </GridCol>
                            </Grid>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Group justify="flex-end" gap="md" pt="md">
                        <Button
                            variant="outline"
                            color="gray"
                            size="md"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="filled"
                            color="#4c6ef5"
                            size="md"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Card>
        </Container>
    );
};

export default AddProductionOrder;