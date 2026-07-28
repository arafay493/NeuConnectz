// Note: Update Driver Master Component...!

"use client";

import React, { useState, useEffect, memo } from 'react';
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
import { useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import { IconUserPlus } from '@tabler/icons-react';
import { apiGet, apiPost , apiPut } from '@/lib/api-service';
import { useRouter, useSearchParams } from 'next/navigation';
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
interface DriverDataProps {
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    licenseNumber: string,
    transportMode: string,
    contractorId: string,
};

const UpdateDriverComponent = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const driverId = searchParams.get('driverId');
    console.log('Driver ID:', driverId);

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
    const [driversList, setDriversList] = useState<DriverDataProps[]>([]);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Update Driver in DB using API call...!
    const updateDriverHandler = async (driverData: any) => {
        // console.log('Driver Data:', driverData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPut(`/neu-connect/v2${process.env.NEXT_PUBLIC_UPDATE_DRIVER}`, driverData, authenticatedUser?.token);
            // console.log('Update Driver Response:', response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Driver updated successfully", customStyles.colors._1B59F8);
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
                setDriversList([]);
                // router.push(routes.driverMaster);
            };
        }

        catch (error) {
            console.log('Update Driver Error:', error);
        };
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
            if (!formData.transportMode) throw "Please seleect Transportation Mode";
            if (formData.transportMode == "ContractorVehicle" && !formData.contractorId) throw "Please select Contractor";

            // console.log("Submitted Data:", formData);

            const driverData = {
                driverId: driverId,
                firstName: driverFirstName,
                lastName: driverLastName,
                email: driverEmail,
                phone: driverContact,
                address: driverAddress,
                licenseNumber: driverLicense,
                transportMode: formData.transportMode,
                contractorId: formData.contractorId ? formData.contractorId : null,
            };
            updateDriverHandler(driverData);
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

    // Note: Fetch all drivers...!
    const fetchAllDrivers = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_DRIVERS}`, authenticatedUser?.token);
            console.log("All Drivers Response:", response);

            const { status, data, error } = response;
            if (status == 200) {
                setDriversList(data?.data?.data || []);
            }

            else if (!String(status).startsWith('2')) {
                showNotificationToast('Something went wrong', error, customStyles.colors.red);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching all drivers', error);
        };
    };

    useEffect(() => {
        if (authenticatedUser) {
            fetchAllDrivers();
        };
    }, [authenticatedUser]);

    useEffect(() => {
        if (driversList.length > 0 && driverId) {
            const driverDetails = driversList.find((driver) => driver.id === driverId);
            console.log('Driver Details:', driverDetails);
            if (driverDetails) {
                setFormData({
                    ...formData,
                    driverFirstName: driverDetails.firstName,
                    driverLastName: driverDetails.lastName,
                    driverLicense: driverDetails.licenseNumber,
                    driverEmail: driverDetails.email,
                    driverContact: driverDetails.phone,
                    driverAddress: driverDetails.address,
                    transportMode: driverDetails.transportMode,
                    contractorId: driverDetails.contractorId,
                    loading: false,
                });
            };
        };
    }, [driversList, driverId]);

    return (
        <Box>

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Update Driver</Text>
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
                    Update Driver
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
                        Update Driver
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

export default memo(UpdateDriverComponent);