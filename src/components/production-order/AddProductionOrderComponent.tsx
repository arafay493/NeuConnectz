'use client';
import TitleComponent from '../common/component-title'
import { ActionIcon, Box, Button, Card, Grid, GridCol, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core'
import { IconBuilding, IconMinus, IconPlus, IconPackage, IconBox } from '@tabler/icons-react'
import { useEffect, useState, useCallback } from 'react';
import { customStyles } from '@/styles/custom-theme';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import { listItemCodes } from '@/redux/actions/sap-actions/sap-actions';
import { fetchHandlingUnits } from '@/redux/actions/handling-unit-actions/handling-unit-actions';

interface ProductionOrderFormData {
    qty: number;
    groupId: string;
    actualQty: number;
    itemCode: string;
    itemName: string;
    unitOfMeasurement: string;
    productionLine: string;
    warehouse: string;
    selectedStageId: string;
}

const AddProductionOrderComponent = () => {
    const [formData, setFormData] = useState<ProductionOrderFormData>({
        groupId: '',
        qty: 0,
        actualQty: 0,
        itemCode: '',
        itemName: '',
        productionLine: '',
        unitOfMeasurement: '',
        warehouse: '',
        selectedStageId: ''
    });
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const dispatch = useAppDispatch()

    // Warehouse List State
    const { wareHousesList: {
        data: warehouses
    } } = useAppSelector(({ wareHouseStates }) => wareHouseStates);

    // Item Code List State
    const { list_Item_Code_Data } = useAppSelector(({ sapStates }) => sapStates);

    // Handling Unit States
    const { handlingUnit, totalCount } = useAppSelector(({ handlingUnitStates }) => { return handlingUnitStates; })


    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        console.log('Save production order:', formData);
        console.log('Selected Stage ID for payload:', formData.selectedStageId);
        // API call to save production order with selectedStageId in payload
    };

    const handleCancel = () => {
        console.log('Cancel');
        // Navigate back or reset form
    };

    // Debounced search function
    const debouncedSearch = useCallback((searchTerm: string) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            if (searchTerm.trim()) {
                dispatch(listItemCodes({ keywords: searchTerm }));
            }
        }, 1000); // 2 seconds delay

        setSearchTimeout(timeout);
    }, [dispatch, searchTimeout]);

    const handleItemCodeChange = (itemCode: string | null) => {
        if (itemCode) {
            // Find the selected item from the list to get item name
            const selectedItem = list_Item_Code_Data?.find(item => item.itemCode === itemCode);

            setFormData(prev => ({
                ...prev,
                itemCode: itemCode,
                itemName: selectedItem?.itemName || '',
                unitOfMeasurement: selectedItem?.uoms?.[0]?.uomCode || ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                itemCode: '',
                itemName: '',
                unitOfMeasurement: ''
            }));
        }
    };

    const handleItemCodeSearch = (searchTerm: string) => {
        debouncedSearch(searchTerm);
    };

    useEffect(() => {
        dispatch(fetchAllWareHouses({}))
        dispatch(listItemCodes({}));
        dispatch(fetchHandlingUnits({
            // lastCount: pagination.pageSize,
            // skipRecords: pagination.pageIndex * pagination.pageSize
        }))
    }, [dispatch])

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout])


    return (
        <Box>
            <TitleComponent
                title='Add Production Order'
                description='Create a new production order for your products.'
            />
            <Stack gap={24}>
                <Card padding={24} radius={16}>
                    <Stack gap={24}>
                        {/* Header */}
                        <Group align="center">
                            <Group gap="sm">
                                <Text size="sm" c="gray.6">Date:</Text>
                                <Text size="lg" fw={500}>{new Date().toLocaleDateString()}</Text>
                            </Group>
                        </Group>

                        {/* Basic Information */}
                        <Grid>
                            <GridCol span={{ base: 12, md: 4 }}>
                                <Text size="md" mb={8} fw={500}>Item Code</Text>
                                <Select
                                    data={list_Item_Code_Data ? list_Item_Code_Data.map(item => ({
                                        value: item.itemCode,
                                        label: `${item.itemCode} - ${item.itemName}`
                                    })) : []}
                                    size='md'
                                    placeholder="Select or Search Item Code"
                                    value={formData.itemCode}
                                    onChange={(value) => handleItemCodeChange(value)}
                                    onSearchChange={(searchTerm) => handleItemCodeSearch(searchTerm)}
                                    radius={8}
                                    searchable
                                    clearable
                                    nothingFoundMessage="No items found"
                                />
                            </GridCol>
                            <GridCol span={{ base: 12, md: 4 }}>
                                <Text size="md" mb={8} fw={500}>Item Name</Text>
                                <TextInput
                                    size='md'
                                    placeholder="Item Name"
                                    value={formData.itemName}
                                    radius={8}
                                    readOnly
                                />
                            </GridCol>
                            <GridCol span={{ base: 12, md: 4 }}>
                                <Text size="md" mb={8} fw={500}>Unit of Measurement</Text>
                                <TextInput
                                    size='md'
                                    placeholder="Unit of Measurement"
                                    value={formData.unitOfMeasurement}
                                    radius={8}
                                    readOnly
                                />
                            </GridCol>
                        </Grid>

                        {/* Production and Quantity */}
                        <Grid>
                            <GridCol span={{ base: 12, md: 4 }}>
                                <Text size="md" mb={8} fw={500}>Production Line</Text>
                                <TextInput
                                    size='md'
                                    placeholder='Enter Production Line'
                                    onChange={(e) => handleInputChange('productionLine', e.target.value)}
                                    value={formData.productionLine}
                                    radius={8}
                                />
                            </GridCol>
                            <GridCol span={{ base: 12, md: 4 }}>
                                <Box>
                                    <Text size="md" mb={8} fw={500}>Quantity</Text>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="light"
                                            color="gray"
                                            onClick={() => handleInputChange('qty', formData.qty > 0 ? formData.qty - 1 : 0)}
                                        >
                                            <IconMinus size={16} />
                                        </ActionIcon>
                                        <NumberInput
                                            size='md'
                                            flex={1}
                                            value={formData.qty}
                                            onChange={(value) => handleInputChange('qty', value || 0)}
                                            min={0}
                                            hideControls
                                            radius={8}
                                            styles={{ input: { textAlign: 'center' } }}
                                        />
                                        <ActionIcon
                                            variant="light"
                                            color="blue"
                                            onClick={() => handleInputChange('planQuantity', formData.qty + 1)}
                                        >
                                            <IconPlus size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Box>
                            </GridCol>
                            <GridCol span={{ base: 12, md: 4 }}>
                                <Text size="md" mb={8} fw={500}>Actual Quantity</Text>
                                <TextInput
                                    size='md'
                                    placeholder="Enter your answer"
                                    value={formData.actualQty}
                                    onChange={(e) => handleInputChange('actualQuantity', e.target.value)}
                                    radius={8}
                                />
                            </GridCol>
                        </Grid>
                    </Stack>
                </Card>

                {/* Warehouse Selection */}
                <Card padding={24} radius={16}>
                    <Box>
                        <Group mb="md">
                            <Text size="xl" fw={500}>Warehouse</Text>
                        </Group>

                        <Grid gutter={24}>
                            {warehouses.map((warehouse) => (
                                <GridCol key={warehouse.id} span={{ base: 6, sm: 4, md: 3, lg: 2 }}>
                                    <Card
                                        padding="md"
                                        radius="md"
                                        shadow='none'
                                        withBorder
                                        style={{
                                            cursor: 'pointer',
                                            border: formData.warehouse === warehouse.id ? `2px solid ${customStyles.colors._1B59F8}` : '1px solid #e9ecef',
                                            backgroundColor: formData.warehouse === warehouse.id ? '#f3f8fe' : '#fff',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() => handleInputChange('warehouse', warehouse.id)}
                                    >
                                        <Stack gap="xs" align="center">
                                            <IconBuilding
                                                size={32}
                                                color={formData.warehouse === warehouse.id ? customStyles.colors._1B59F8 : customStyles.colors._4A4A4A}
                                            />
                                            <Text size="sm" fw={600} c={formData.warehouse === warehouse.id ? customStyles.colors._1B59F8 : customStyles.colors._4A4A4A}>
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
                </Card>

                <Card padding={24} radius={16}>
                    {/* Handling Units */}
                    <Box>
                        <Text size="xl" fw={500} mb="md">Handling Unit</Text>

                        {handlingUnit && handlingUnit.length > 0 && (
                            <Grid gutter={24}>
                                {handlingUnit.map((group) => (
                                    <GridCol key={group.groupId} span={{ base: 12, md: 6 }}>
                                        <Box style={{ border: `1px solid ${customStyles.colors._ECECEC}`, borderRadius: '16px', padding: '16px', height: '100%', }}>
                                            <Text size="md" fw={600} mb="sm" c={customStyles.colors._1B59F8}>
                                                {group.groupName}
                                            </Text>

                                            {/* Main Stage */}
                                            <Grid mb="sm">
                                                <GridCol span={12}>
                                                    <Card
                                                        padding="md"
                                                        radius="md"
                                                        shadow='none'
                                                        withBorder
                                                        style={{
                                                            cursor: 'pointer',
                                                            border: formData.selectedStageId === group.groupStages.id ? `2px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._ECECEC}`,
                                                            backgroundColor: formData.selectedStageId === group.groupStages.id ? customStyles.colors._1B59F81A : '#fff',
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                        onClick={() => handleInputChange('selectedStageId', group.groupStages.id)}
                                                    >
                                                        <Group justify="space-between">
                                                            <Group gap="sm">
                                                                <IconPackage
                                                                    size={24}
                                                                    color={formData.selectedStageId === group.groupStages.id ? customStyles.colors._1B59F8 : customStyles.colors._909090}
                                                                />
                                                                <Box>
                                                                    <Text size="sm" fw={600}>
                                                                        {group.groupStages.name}
                                                                    </Text>
                                                                    <Text size="xs" c="gray.6">
                                                                        Level {group.groupStages.level} • Capacity: {group.groupStages.capacity}
                                                                    </Text>
                                                                </Box>
                                                            </Group>
                                                        </Group>
                                                    </Card>
                                                </GridCol>
                                            </Grid>

                                            {/* Sub Stages */}
                                            {group.groupStages.subStages && group.groupStages.subStages.length > 0 && (
                                                <Box ml="md">
                                                    <Text size="sm" fw={500} mb="xs" c="gray.7">
                                                        Sub Stages:
                                                    </Text>
                                                    <Grid>
                                                        {group.groupStages.subStages.map((subStage: any) => (
                                                            <GridCol key={subStage.id} span={{ base: 12, md: 6 }}>
                                                                <Card
                                                                    padding="sm"
                                                                    radius="md"
                                                                    withBorder
                                                                    shadow='none'
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                        border: formData.selectedStageId === subStage.id ? `2px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._ECECEC}`,
                                                                        backgroundColor: formData.selectedStageId === subStage.id ? customStyles.colors._1B59F81A : '#fff',
                                                                        transition: 'all 0.2s ease',
                                                                    }}
                                                                    onClick={() => handleInputChange('selectedStageId', subStage.id)}
                                                                >
                                                                    <Group gap="sm">
                                                                        <IconBox
                                                                            size={20}
                                                                            color={formData.selectedStageId === subStage.id ? '#4c6ef5' : customStyles.colors._909090}
                                                                        />
                                                                        <Box>
                                                                            <Text size="sm" fw={500}>
                                                                                {subStage.name}
                                                                            </Text>
                                                                            <Text size="xs" c="gray.6">
                                                                                Level {subStage.level} • Capacity: {subStage.capacity}
                                                                            </Text>
                                                                        </Box>
                                                                    </Group>
                                                                </Card>
                                                            </GridCol>
                                                        ))}
                                                    </Grid>
                                                </Box>
                                            )}
                                        </Box>
                                    </GridCol>
                                ))}
                            </Grid>
                        )}

                        {(!handlingUnit || handlingUnit.length === 0) && (
                            <Text size="sm" c="gray.6" ta="center" py="xl">
                                No handling units available
                            </Text>
                        )}
                    </Box>
                </Card>

                {/* Action Buttons */}
                <Group justify="flex-end" gap="md" pt="md">
                    <Button
                        className='outlineButton'
                        radius={8}
                        size="md"
                        variant="transparent"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className='filledButton'
                        radius={8}
                        size="md"
                        variant="transparent"
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </Group>
            </Stack >
            {/*
            </Card > */}
        </Box >
    )
}

export default AddProductionOrderComponent