// Note: Add Product Master Component...!

"use client";

import React, { useState, useEffect } from 'react';
import {
    Select,
    Group,
    Text,
    Paper,
    Stack,
    Title,
    Button,
    TextInput,
    PasswordInput,
    Grid,
    Box,
} from "@mantine/core";
import { IconSend, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { addSAPConfiguration } from '@/redux/actions/sap-actions/sap-actions';
import { customStyles } from '@/styles/custom-theme';
import { checkSAPConfigExist } from '@/redux/actions/sap-actions/sap-actions';
import { IconUserPlus } from '@tabler/icons-react';

const AddProductMasterComponent = () => {

    const [formData, setFormData] = useState({
        productCode: "",
        productName: "",
        packagingType: "",
        uom: "",
        batch_expiry: "",
        loading: false,
    });

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        const { productCode, productName, uom, packagingType, batch_expiry } = formData;

        try {
            if (!productCode.trim()) throw "Product Code is required";
            if (!productName.trim()) throw "Product Name is required";
            if (!packagingType.trim()) throw "Packaging Type is required";
            if (!uom.trim()) throw "Unit of Measurement (UOM) is required";
            if (!batch_expiry.trim()) throw "Batch Expiry date is required";

            console.log("Submitted Data:", formData);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <Box>

            {/* Note: Loading Component */}
            <Loader loadingState={formData.loading} />

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Add product</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                >
                    Save Product
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
                        Product Information
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Product Code"
                                placeholder="Enter Product Code"
                                withAsterisk
                                value={formData.productCode}
                                onChange={(e) => handleChange("productCode", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Product Name"
                                placeholder="Enter Product Name"
                                withAsterisk
                                value={formData.productName}
                                onChange={(e) => handleChange("productName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Packaging Type"
                                placeholder="Select Packaging Type"
                                withAsterisk
                                data={[
                                    { value: "SAP Business 1", label: "SAP Business 1" },
                                    { value: "SAP S4 HANA", label: "SAP S4 HANA" },
                                    { value: "Fusion", label: "Fusion" }
                                ]}
                                value={formData.packagingType}
                                onChange={(value) => handleChange("packagingType", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type="date"
                                label="Batch Expiry Date"
                                placeholder="Select batch expiry date"
                                withAsterisk
                                value={formData.batch_expiry}
                                onChange={(e) => handleChange("batch_expiry", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Unit of Measurement (UOM)"
                                placeholder="e.g. PCS, KG, LTR"
                                withAsterisk
                                value={formData.uom}
                                onChange={(e) => handleChange("uom", e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default AddProductMasterComponent;