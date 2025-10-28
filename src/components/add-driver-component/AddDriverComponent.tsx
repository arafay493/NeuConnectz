// Note: Add Driver Master Component...!

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

const AddDriverMasterComponent = () => {

    const [formData, setFormData] = useState({
        driverFirstName: "",
        driverLastName: "",
        driverLicense: "",
        driverEmail: "",
        driverContact: "",
        driverAddress: "",
        loading: false,
    });

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        const { driverFirstName, driverLastName, driverLicense, driverEmail, driverContact, driverAddress } = formData;

        try {
            if (!driverFirstName.trim()) throw "Driver First Name is required";
            if (!driverLastName.trim()) throw "Driver Last Name is required";
            if (!driverLicense.trim()) throw "Driver License is required";
            if (!driverEmail.trim()) throw "Driver Email Address is required";
            if (!driverContact.trim()) throw "Driver Contact is required";
            if (!driverAddress.trim()) throw "Driver Address is required";

            console.log("Submitted Data:", formData);
        }

        catch (error) {
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
                    <Text c={customStyles.colors._909090}>Add Driver</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                >
                    Save Driver
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
                        Driver Master
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Driver First Name"
                                placeholder="Enter First Name"
                                withAsterisk
                                value={formData.driverFirstName}
                                onChange={(e) => handleChange("driverFirstName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Driver Last Name"
                                placeholder="Enter Last Name"
                                withAsterisk
                                value={formData.driverLastName}
                                onChange={(e) => handleChange("driverLastName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Driver License"
                                placeholder="Enter License Number"
                                withAsterisk
                                value={formData.driverLicense}
                                onChange={(e) => handleChange("driverLicense", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type="email"
                                label="Driver Email Address"
                                placeholder="Enter Email Address"
                                withAsterisk
                                value={formData.driverEmail}
                                onChange={(e) => handleChange("driverEmail", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type="number"
                                label="Driver Contact"
                                placeholder="Enter Contact Number"
                                withAsterisk
                                value={formData.driverContact}
                                onChange={(e) => handleChange("driverContact", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Driver Address"
                                placeholder="Enter Full Address"
                                withAsterisk
                                value={formData.driverAddress}
                                onChange={(e) => handleChange("driverAddress", e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default AddDriverMasterComponent;