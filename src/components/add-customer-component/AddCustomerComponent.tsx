// Note: Add Customer Master Component...!

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

const AddCustomerMasterComponent = () => {

    const [formData, setFormData] = useState({
        customerCode: "",
        customerName: "",
        address: "",
        contactPerson: "",
        phoneNumber: "",
        gst_taxNumber: "",
        paymentTerms: "",
        loading: false,
    });

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        const {
            customerCode,
            customerName,
            address,
            contactPerson,
            phoneNumber,
            gst_taxNumber,
            paymentTerms,
        } = formData;

        try {
            if (!customerCode.trim()) throw "Customer Code is required";
            if (!customerName.trim()) throw "Customer Name is required";
            if (!address.trim()) throw "Address is required";
            if (!contactPerson.trim()) throw "Contact Person is required";
            if (!phoneNumber.trim()) throw "Phone Number is required";
            if (!gst_taxNumber.trim()) throw "GST / Tax Number is required";
            if (!paymentTerms.trim()) throw "Payment Terms are required";

            // Submit form (API logic here)
            console.log("Submitted Data:", formData);
        }

        catch (error) {
            alert(error); // You can replace it with toast
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
                    <Text c={customStyles.colors._909090}>Add customer</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                >
                    Save Customer
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
                        Customer Information
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Customer Code"
                                placeholder="Enter Customer Code"
                                withAsterisk
                                value={formData.customerCode}
                                onChange={(e) => handleChange("customerCode", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Customer Name"
                                placeholder="Enter Customer Name"
                                withAsterisk
                                value={formData.customerName}
                                onChange={(e) => handleChange("customerName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Address"
                                placeholder="Enter Address"
                                withAsterisk
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Contact Person"
                                placeholder="Enter Contact Person"
                                withAsterisk
                                value={formData.contactPerson}
                                onChange={(e) => handleChange("contactPerson", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Phone Number"
                                placeholder="Enter Phone Number"
                                withAsterisk
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange("phoneNumber", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="GST / Tax Number"
                                placeholder="Enter GST / Tax Number"
                                withAsterisk
                                value={formData.gst_taxNumber}
                                onChange={(e) => handleChange("gst_taxNumber", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Payment Terms"
                                placeholder="E.g. Net 30, Advance, etc."
                                withAsterisk
                                value={formData.paymentTerms}
                                onChange={(e) => handleChange("paymentTerms", e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default AddCustomerMasterComponent;