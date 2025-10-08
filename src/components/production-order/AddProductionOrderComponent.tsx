'use client';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { getHandlingUnitByItemId } from '@/redux/actions/handling-unit-actions/handling-unit-actions';
import { addProductionOrder } from '@/redux/actions/production-order-actions/production-order-actions';
import { listItemCodes } from '@/redux/actions/sap-actions/sap-actions';
import { fetchAllWareHouses } from '@/redux/actions/warehouse-actions/warehouse-actions';
import { RESET_HANDLING_UNIT_BY_ITEM_ID } from '@/redux/reducers/handling-unit-reducer/handling-unit-reducer';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import { ItemDataProps, ListProductionOrder } from '@/types/redux-types';
import { ActionIcon, Box, Button, Card, Grid, GridCol, Group, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { IconBox, IconBuilding, IconMinus, IconPackage, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import TitleComponent from '../common/component-title';

const initialFormData: ListProductionOrder = {
    groupId: '',
    qty: 0,
    actualQty: 0,
    itemCode: '',
    itemName: '',
    productionLine: '',
    unitOfMeasurement: '',
    warehouse: '',
}

const AddProductionOrderComponent = () => {
    const [formData, setFormData] = useState<ListProductionOrder>(initialFormData);

    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const [itemSelected, setItemSelected] = useState<ItemDataProps | null>(null);

    const router = useRouter();

    const dispatch = useAppDispatch()

    // Warehouse List State
    const { wareHousesList: {
        data: warehouses
    } } = useAppSelector(({ wareHouseStates }) => wareHouseStates);

    // Item Code List State
    const { list_Item_Code_Data } = useAppSelector(({ sapStates }) => sapStates);

    // Handling Unit States
    const { handlingUnitByItemId } = useAppSelector(({ handlingUnitStates }) => { return handlingUnitStates; })

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // // Helper function to get all stage IDs in hierarchical order
    // const getAllStageIds = (handlingUnit: any): string[] => {
    //     if (!handlingUnit) return [];

    //     const stageIds = [handlingUnit.groupStages.id];

    //     const collectSubStageIds = (subStages: any[]): string[] => {
    //         let ids: string[] = [];
    //         subStages.forEach(subStage => {
    //             ids.push(subStage.id);
    //             if (subStage.subStages && subStage.subStages.length > 0) {
    //                 ids = ids.concat(collectSubStageIds(subStage.subStages));
    //             }
    //         });
    //         return ids;
    //     };

    //     if (handlingUnit.groupStages.subStages) {
    //         stageIds.push(...collectSubStageIds(handlingUnit.groupStages.subStages));
    //     }

    //     return stageIds;
    // };

    // // Helper function to get parent stages for a given stage ID
    // const getParentStages = (targetStageId: string, handlingUnit: any): string[] => {
    //     if (!handlingUnit) return [];

    //     const allStageIds = getAllStageIds(handlingUnit);
    //     const targetIndex = allStageIds.indexOf(targetStageId);

    //     if (targetIndex === -1) return [];

    //     // Return all stages up to and including the target stage
    //     return allStageIds.slice(0, targetIndex + 1);
    // };

    // const handleStageSelection = (stageId: string) => {
    //     if (!handlingUnitByItemId) return;

    //     // If clicking on already selected stage, unselect the entire group
    //     if (formData.selectedStageId === stageId) {
    //         setFormData(prev => ({
    //             ...prev,
    //             selectedStageId: ''
    //         }));
    //         return;
    //     }

    //     // Get all parent stages that should be selected
    //     const stagesToSelect = getParentStages(stageId, handlingUnitByItemId);

    //     // For now, we'll just store the clicked stage ID, but the UI will show hierarchy
    //     setFormData(prev => ({
    //         ...prev,
    //         selectedStageId: stageId
    //     }));
    // };

    // // Helper function to check if a stage should be visually selected (highlighted)
    // const isStageSelected = (stageId: string): boolean => {
    //     if (!formData.selectedStageId || !handlingUnitByItemId) return false;

    //     const selectedParents = getParentStages(formData.selectedStageId, handlingUnitByItemId);
    //     return selectedParents.includes(stageId);
    // };

    // Handle response from API
    const handleResponse = (status: number) => {
        const errorResponseCodes = {
            400: "Bad Request - Invalid data provided",
            500: "Server Error - Please try again later",
            409: "Conflict - Production Order with this name already exists"
        }

        if (status === 200 || status === 201) {
            showNotificationToast("Production Order Added", "Production Order added successfully", customStyles.colors._408CCE);
            dispatch(RESET_HANDLING_UNIT_BY_ITEM_ID())
            setFormData(initialFormData);
            setItemSelected(null);
            router.back();
            return;
        }

        if (errorResponseCodes[status as keyof typeof errorResponseCodes]) {
            showNotificationToast("Error Adding Production Order", errorResponseCodes[status as keyof typeof errorResponseCodes], customStyles.colors.red);
            return;
        }
    }

    const handleSave = () => {
        dispatch(addProductionOrder({ body: formData, resHandler: handleResponse }));
    };

    const handleCancel = () => {
        setFormData(initialFormData);
        router.back();
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
            setItemSelected(selectedItem || null);

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
    }, [dispatch])

    useEffect(() => {
        if (itemSelected) {
            dispatch(getHandlingUnitByItemId({ itemId: itemSelected.id }))
        }
    }, [itemSelected])

    useEffect(() => {
        setFormData(prev => ({ ...prev, groupId: handlingUnitByItemId?.groupId || '' }));
    }, [handlingUnitByItemId])

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
                                        label: `${item.itemCode}`
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
                                <NumberInput
                                    size='md'
                                    placeholder="Enter your answer"
                                    value={formData.actualQty}
                                    onChange={(value) => handleInputChange('actualQty', value)}
                                    min={0}
                                    hideControls
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
                                            border: formData.warehouse === warehouse.whsCode ? `2px solid ${customStyles.colors._1B59F8}` : '1px solid #e9ecef',
                                            backgroundColor: formData.warehouse === warehouse.whsCode ? '#f3f8fe' : '#fff',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() => handleInputChange('warehouse', warehouse.whsCode)}
                                    >
                                        <Stack gap="xs" align="center">
                                            <IconBuilding
                                                size={32}
                                                color={formData.warehouse === warehouse.whsCode ? customStyles.colors._1B59F8 : customStyles.colors._4A4A4A}
                                            />
                                            <Text size="sm" fw={600} c={formData.warehouse === warehouse.whsCode ? customStyles.colors._1B59F8 : customStyles.colors._4A4A4A}>
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

                {handlingUnitByItemId && (
                    <Card padding={24} radius={16}>
                        {/* Handling Units */}
                        <Box>
                            <Text size="xl" fw={500} mb="md">Handling Unit</Text>
                            <Box style={{ border: `2px solid ${customStyles.colors._1B59F8}`, backgroundColor: customStyles.colors._1B59F81A, borderRadius: '16px', padding: '16px', height: '100%', }}>
                                <Text size="md" fw={600} mb="sm" c={customStyles.colors._1B59F8}>
                                    {handlingUnitByItemId.groupName}
                                </Text>

                                {/* Main Stage */}
                                <Card
                                    mb={12}
                                    padding="md"
                                    radius={8}
                                    shadow='none'
                                    withBorder
                                    style={{
                                        cursor: 'pointer',
                                        // border: isStageSelected(handlingUnitByItemId.groupStages.id || '') ? `2px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._ECECEC}`,
                                        // backgroundColor: isStageSelected(handlingUnitByItemId.groupStages.id || '') ? customStyles.colors._1B59F81A : '#fff',
                                        border: `1px solid ${customStyles.colors._1B59F8}`,
                                        // backgroundColor: customStyles.colors._1B59F81A,
                                        transition: 'all 0.2s ease',
                                    }}
                                // onClick={() => handleStageSelection(handlingUnitByItemId.groupStages.id || '')}
                                >
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <IconPackage
                                                size={24}
                                                // color={isStageSelected(handlingUnitByItemId.groupStages.id || '') ? customStyles.colors._1B59F8 : customStyles.colors._909090}
                                                color={customStyles.colors._1B59F8}
                                            />
                                            <Box>
                                                <Text size="sm" fw={600}>
                                                    {handlingUnitByItemId.groupStages.name}
                                                </Text>
                                                <Text size="xs" c="gray.6">
                                                    Level {handlingUnitByItemId.groupStages.level} • Capacity: {handlingUnitByItemId.groupStages.capacity}
                                                </Text>
                                            </Box>
                                        </Group>
                                    </Group>
                                </Card>

                                {/* Sub Stages */}
                                {handlingUnitByItemId.groupStages.subStages && handlingUnitByItemId.groupStages.subStages.length > 0 && (
                                    <Box ml="md">
                                        <Text size="sm" fw={500} mb="xs" c="gray.7">
                                            Sub Stages:
                                        </Text>
                                        <Grid>
                                            {handlingUnitByItemId.groupStages.subStages.map((subStage: any) => (
                                                <GridCol key={subStage.id} span={{ base: 12, md: 6 }}>
                                                    <Card
                                                        padding="sm"
                                                        radius="md"
                                                        withBorder
                                                        shadow='none'
                                                        style={{
                                                            cursor: 'pointer',
                                                            // border: isStageSelected(subStage.id) ? `2px solid ${customStyles.colors._1B59F8}` : `1px solid ${customStyles.colors._ECECEC}`,
                                                            // backgroundColor: isStageSelected(subStage.id) ? customStyles.colors._1B59F81A : '#fff',
                                                            border: `1px solid ${customStyles.colors._1B59F8}`,
                                                            // backgroundColor: customStyles.colors._1B59F81A,
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                    // onClick={() => handleStageSelection(subStage.id)}
                                                    >
                                                        <Group gap="sm">
                                                            <IconBox
                                                                size={20}
                                                                // color={isStageSelected(subStage.id) ? customStyles.colors._1B59F8 : customStyles.colors._909090}
                                                                color={customStyles.colors._1B59F8}
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
                            {(!handlingUnitByItemId) && (
                                <Text size="sm" c="gray.6" ta="center" py="xl">
                                    No handling units available
                                </Text>
                            )}
                        </Box>
                    </Card>
                )
                }

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