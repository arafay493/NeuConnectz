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
    Grid,
    Box,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import { IconUserPlus } from '@tabler/icons-react';
import { apiGet, apiPost } from '@/lib/api-service';
import { useRouter } from 'next/navigation';
import { routes } from '@/constants/routes';

interface ContractorDataProps {
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean,
    id: string,
    contractorName: string,
    address: string,
    city: string,
    country: string
};

const AddDriverMasterComponent = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        driverFirstName: "",
        driverLastName: "",
        driverLicense: "",
        driverEmail: "",
        driverContact: "",
        driverAddress: "",
        transportMode: "",
        contractorId: "",
        loading: false,
    });
    const [contarctorsList, setContarctorsList] = useState<ContractorDataProps[]>([]);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Add Driver in DB using API call...!
    const addDriverHandler = async (driverData: any) => {
        console.log('Driver Data:', driverData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_ADD_DRIVER}`, driverData, authenticatedUser?.token);
            console.log(response);

            const { status, data } = response;
            if (status == 201) {
                showNotificationToast("Success", "Driver added successfully", customStyles.colors._1B59F8);
                setFormData({
                    driverFirstName: "",
                    driverLastName: "",
                    driverLicense: "",
                    driverEmail: "",
                    driverContact: "",
                    driverAddress: "",
                    transportMode: "",
                    contractorId: "",
                    loading: false,
                });
                setContarctorsList([]);
                // router.push(routes.driverMaster);
            };
        }

        catch (error) {
            console.log('Add Driver Error:', error);
        };
    };

    const handleSubmit = () => {
        const { driverFirstName, driverLastName, driverLicense, driverEmail, driverContact, driverAddress } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const pakPhoneRegex = /^(?:03\d{9}|923\d{9})$/;

        try {
            if (!driverFirstName.trim()) throw "Driver First Name is required";
            if (!driverLastName.trim()) throw "Driver Last Name is required";
            if (!driverLicense.trim()) throw "Driver License is required";
            if (!driverEmail.trim()) throw "Driver Email is required";
            if (!driverEmail.match(emailRegex)) throw "Invalid email format";
            if (!driverContact.trim()) throw "Driver Contact is required";
            if (!driverContact.match(pakPhoneRegex)) throw "Invalid phone number format";
            if (!driverAddress.trim()) throw "Driver Address is required";
            if (!formData.transportMode) throw "Please seleect Transportation Mode";
            if (formData.transportMode == "ContractorVehicle" && !formData.contractorId) throw "Please select Contractor";

            console.log("Submitted Data:", formData);

            const driverData = {
                firstName: driverFirstName,
                lastName: driverLastName,
                email: driverEmail,
                phone: driverContact,
                address: driverAddress,
                licenseNumber: driverLicense,
                transportMode: formData.transportMode,
                contractorId: formData.contractorId ? formData.contractorId : null,
            };
            addDriverHandler(driverData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            };
        };
    };

    const fetchAllContarctors = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_CONTRACTORS}`, authenticatedUser?.token);
            console.log(response);

            const { status, data } = response;
            if (status == 200) {
                setContarctorsList(data?.data?.data || []);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all contractors', error);
        };
    };

    useEffect(() => {
        if (formData.transportMode == "ContractorVehicle") {
            fetchAllContarctors();
        };
    }, [formData.transportMode == "ContractorVehicle"]);

    return (
        <Box>

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
                    onClick={handleSubmit}
                    loading={formData.loading}
                    disabled={formData.loading}
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

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Transportation Mode"
                                placeholder="Select Transportation Mode"
                                withAsterisk
                                data={[
                                    { value: "CompanyVehicle", label: "Company Vehicle" },
                                    { value: "ContractorVehicle", label: "ContractorVehicle" },
                                ]}
                                value={formData.transportMode}
                                onChange={(value) => handleChange("transportMode", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Contractor"
                                placeholder="Select Contractor"
                                withAsterisk
                                data={
                                    contarctorsList.map((contractor) => ({
                                        value: contractor.id,
                                        label: contractor.contractorName,
                                    }))
                                }
                                value={formData.contractorId}
                                onChange={(value) => handleChange("contractorId", value)}
                                disabled={formData.transportMode !== "ContractorVehicle"}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default AddDriverMasterComponent;