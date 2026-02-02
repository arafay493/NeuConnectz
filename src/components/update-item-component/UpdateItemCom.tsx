// Note: Update Item Master Component...!

"use client";

import React, { useState, memo, useEffect } from 'react';
import {
    Group,
    Text,
    Paper,
    Stack,
    Title,
    Button,
    TextInput,
    Grid,
    Box,
} from "@mantine/core";
import { useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import { IconUserPlus } from '@tabler/icons-react';
import { apiPost, apiGet , apiPut } from '@/lib/api-service';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/constants/routes';

interface ItemMasterDataProps {
    id: string,
    itemCode: string,
    itemName: string,
    productCategory: string,
    litres: string,
    canQTY: string,
    cartonSize: string,
    uom: string,
    subUOM: string,
    groupCode: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
};

const UpdateItemMasterComponent = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const itemMasterId = searchParams.get('itemMasterId');
    console.log('Item Master ID:', itemMasterId);

    const [formData, setFormData] = useState({
        itemCode: "",
        itemName: "",
        productCategory: "",
        litres: "",
        canQuantity: "",
        cartonSize: "",
        uom: "",
        subUOM: "",
        loading: false,
    });
    const [itemsList, setItemsList] = useState<ItemMasterDataProps[]>([]);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Update item master in DB using API call...!
    const updateItemHandler = async (itemData: any) => {
        console.log('Update Item Data:', itemData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPut(`/neu-connect/v2${process.env.NEXT_PUBLIC_UPDATE_ITEM_MASTER}`, itemData, authenticatedUser?.token);
            console.log('Update Item Response:', response);

            const { status, data, error } = response;
            if (status == 200) {
                showNotificationToast("Success", "Item updated successfully", customStyles.colors._1B59F8);
                setFormData({
                    itemCode: "",
                    itemName: "",
                    productCategory: "",
                    litres: "",
                    canQuantity: "",
                    cartonSize: "",
                    uom: "",
                    subUOM: "",
                    loading: false,
                });
                router.push(routes.productMaster);
            }

            else if (!String(status).startsWith('2')) {
                showNotificationToast("Something went wrong", error, customStyles.colors.red);
                setFormData({
                    ...formData,
                    loading: false,
                });
            }
        }

        catch (error) {
            console.log('Something went wrong while updating item: ', error);
        };
    };

    const handleSubmit = () => {
        const itemData = {
            itemMasterId: itemMasterId,
            itemCode: formData.itemCode,
            itemName: formData.itemName,
            productCategory: formData.productCategory,
            litres: formData.litres,
            canQTY: formData.canQuantity,
            cartonSize: formData.cartonSize,
            uom: formData.uom,
            subUOM: formData.subUOM,
            groupCode: 101,

        };

        const values = Object.values(itemData);
        const allFieldsFilled = values.every(value => value !== "");

        try {
            if (!allFieldsFilled) {
                showNotificationToast("Validation Error", "Please fill in all required fields.", customStyles.colors.red);
                return;
            };

            updateItemHandler(itemData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            };
        };
    };

    // Note: Fetch all items master...!
    const fetchAllItems = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_ITEMS}`, authenticatedUser?.token);
            console.log(response);

            const { status, data, error } = response;
            if (status == 200) {
                setItemsList(data?.data?.items || []);
            }

            else if (!String(status).startsWith('2')) {
                showNotificationToast('Something went wrong', error, customStyles.colors.red);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching all items', error);
        };
    };

    useEffect(() => {
        if (authenticatedUser) {
            fetchAllItems();
        };
    }, [authenticatedUser]);

    useEffect(() => {
        if (itemsList.length > 0 && itemMasterId) {
            const itemDetails = itemsList.find(item => item.id === itemMasterId);
            if (itemDetails) {
                setFormData({
                    ...formData,
                    itemCode: itemDetails.itemCode,
                    itemName: itemDetails.itemName,
                    productCategory: itemDetails.productCategory,
                    litres: itemDetails.litres,
                    canQuantity: itemDetails.canQTY,
                    cartonSize: itemDetails.cartonSize,
                    uom: itemDetails.uom,
                    subUOM: itemDetails.subUOM
                });
            }
        }
    }, [itemsList, itemMasterId]);

    return (
        <Box>

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Update Item</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                    onClick={handleSubmit}
                    loading={formData.loading}
                    disabled={formData.loading}
                >
                    Update Item
                </Button>
            </Group>

            {/* Note: Form section */}
            <div style={{ padding: '10px' }}>
                <Paper shadow="md" radius="md" p="xl" withBorder>
                    <Title
                        order={4}
                        mb="lg"
                        style={{ color: customStyles.colors._4D4D4D }}
                    >
                        Update Item Master
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Item Code"
                                placeholder="Enter Item Code"
                                withAsterisk
                                value={formData.itemCode}
                                onChange={(e) => handleChange("itemCode", e.currentTarget.value)}
                                disabled
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Item Name"
                                placeholder="Enter Item Name"
                                withAsterisk
                                value={formData.itemName}
                                onChange={(e) => handleChange("itemName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Product Category"
                                placeholder="Enter Product Category"
                                withAsterisk
                                value={formData.productCategory}
                                onChange={(e) => handleChange("productCategory", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type='number'
                                label="litres"
                                placeholder="Enter Litres"
                                withAsterisk
                                value={formData.litres}
                                onChange={(e) => handleChange("litres", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type='number'
                                label="Can Quantity"
                                placeholder="Enter Can Quantity"
                                withAsterisk
                                value={formData.canQuantity}
                                onChange={(e) => handleChange("canQuantity", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Carton Size"
                                placeholder="Enter Carton Size"
                                withAsterisk
                                value={formData.cartonSize}
                                onChange={(e) => handleChange("cartonSize", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="UOM"
                                placeholder="Enter UOM"
                                withAsterisk
                                value={formData.uom}
                                onChange={(e) => handleChange("uom", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Sub UOM"
                                placeholder="Enter Sub UOM"
                                withAsterisk
                                value={formData.subUOM}
                                onChange={(e) => handleChange("subUOM", e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default memo(UpdateItemMasterComponent);