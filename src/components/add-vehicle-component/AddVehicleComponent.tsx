// Note: Add Vehicle Master Component...!

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

const AddVehicletMasterComponent = () => {

    const [formData, setFormData] = useState({
        vehicleNumber: "",
        vehicleType: "",
        capacity: "",
        driverName: "",
        driverContact: "",
        transporter: "",
        transporterType: "",
        loading: false,
    });

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = () => {
        const { vehicleNumber, vehicleType, capacity, driverName, driverContact, transporter, transporterType } = formData;

        try {
            if (!vehicleNumber.trim()) throw "Vehicle Number is required";
            if (!vehicleType.trim()) throw "Vehicle Type is required";
            if (!capacity.trim()) throw "Capacity is required";
            if (!driverName.trim()) throw "Driver Name is required";
            if (!driverContact.trim()) throw "Driver Contact is required";
            if (!transporter.trim()) throw "Transporter is required";
            if (!transporterType.trim()) throw "Transporter Type is required";

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
                    <Text c={customStyles.colors._909090}>Add vehicle</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                >
                    Save Vehicle
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
                        Vehicle Master
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Vehicle Number"
                                placeholder="Enter Vehicle Number"
                                withAsterisk
                                value={formData.vehicleNumber}
                                onChange={(e) => handleChange("vehicleNumber", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Vehicle Type"
                                placeholder="Select Vehicle Type"
                                withAsterisk
                                data={[
                                    { value: "Truck", label: "Truck" },
                                    { value: "Van", label: "Van" },
                                    { value: "Container", label: "Container" },
                                ]}
                                value={formData.vehicleType}
                                onChange={(value) => handleChange("vehicleType", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Capacity"
                                placeholder="Select Capacity"
                                withAsterisk
                                data={[
                                    { value: "1 Ton", label: "1 Ton" },
                                    { value: "2 Ton", label: "2 Ton" },
                                    { value: "5 Ton", label: "5 Ton" },
                                ]}
                                value={formData.capacity}
                                onChange={(value) => handleChange("capacity", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Driver Name"
                                placeholder="Enter Driver Name"
                                withAsterisk
                                value={formData.driverName}
                                onChange={(e) => handleChange("driverName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type="number"
                                label="Driver Contact"
                                placeholder="Enter Driver Contact Number"
                                withAsterisk
                                value={formData.driverContact}
                                onChange={(e) => handleChange("driverContact", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Transporter"
                                placeholder="Enter Transporter"
                                withAsterisk
                                value={formData.transporter}
                                onChange={(e) => handleChange("transporter", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Transporter Type"
                                placeholder="Select Transporter Type"
                                withAsterisk
                                data={[
                                    { value: "Company Owned", label: "Company Owned" },
                                    { value: "Third Party", label: "Third Party" },
                                ]}
                                value={formData.transporterType}
                                onChange={(value) => handleChange("transporterType", value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default AddVehicletMasterComponent;