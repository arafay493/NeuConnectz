// Note: Add Item Master Component...!

"use client";

import React, { useState, memo } from 'react';
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
import { apiPost } from '@/lib/api-service';
import { useRouter } from 'next/navigation';
import { routes } from '@/constants/routes';

const AddItemMasterComponent = () => {

    const router = useRouter();

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

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Add item master in DB using API call...!
    const addItemHandler = async (itemData: any) => {
        console.log('Item Data:', itemData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_ADD_ITEM_MASTER}`, itemData, authenticatedUser?.token);
            console.log(response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Item added successfully", customStyles.colors._1B59F8);
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
            };
        }

        catch (error) {
            console.log('Something went wrong while adding item: ', error);
        };
    };

    const handleSubmit = () => {
        const itemData = {
            itemCode: formData.itemCode,
            itemName: formData.itemName,
            productCategory: formData.productCategory,
            litres: formData.litres,
            canQTY: formData.canQuantity,
            cartonSize: formData.cartonSize,
            uom: formData.uom,
            subUOM: formData.subUOM,
            groupCode: 101
        };

        const values = Object.values(itemData);
        const allFieldsFilled = values.every(value => value !== "");

        try {
            if (!allFieldsFilled) {
                showNotificationToast("Validation Error", "Please fill in all required fields.", customStyles.colors.red);
                return;
            };

            addItemHandler(itemData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            };
        };
    };

    return (
        <Box>

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Add Item</Text>
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
                    Save Item
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
                        Item Master
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Item Code"
                                placeholder="Enter Item Code"
                                withAsterisk
                                value={formData.itemCode}
                                onChange={(e) => handleChange("itemCode", e.currentTarget.value)}
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

export default memo(AddItemMasterComponent);