// Note: Add Contractor component...!

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

const AddContractorComponent = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        contractorerName: "",
        address: "",
        city: "",
        country: "",
        loading: false,
    });

    // Note: Redux States...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Add Contractor in DB using API call...!
    const addContarctorHandler = async (contractorData: any) => {

        // console.log('Add Contractor Data:', contractorData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_ADD_CONTRACTOR}`, contractorData, authenticatedUser?.token);
            // console.log(response);

            const { status, data } = response;
            if (status == 201) {
                showNotificationToast("Success", "Contractor added successfully", customStyles.colors._1B59F8);
                setFormData({
                    contractorerName: "",
                    address: "",
                    city: "",
                    country: "",
                    loading: false,
                });
                // router.push(routes.contractorMaster);
            };
        }

        catch (error) {
            console.log('Add Contractor Error:', error);
        };
    };

    // Handle form submission...!
    const handleSubmit = () => {
        const {
            contractorerName,
            address,
            city,
            country,
        } = formData;

        try {
            if (!contractorerName.trim()) throw "Contractor Name is required";
            if (!address.trim()) throw "Address is required";
            if (!city.trim()) throw "City Name is required";
            if (!country.trim()) throw "Country Name is required";

            const contractorData = {
                contractorerName: contractorerName,
                address: address,
                city: city,
                country: country,
            };
            addContarctorHandler(contractorData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            }
        };
    };

    return (
        <Box>

            {/* Note: Loading Component */}
            {/* <Loader loadingState={formData.loading} /> */}

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Add Contractor</Text>
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
                    Save Contractor
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
                        Contractor Information
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Contractor Name"
                                placeholder="Enter Contractor Name"
                                withAsterisk
                                value={formData.contractorerName}
                                onChange={(e) => handleChange("contractorerName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Country"
                                placeholder="Enter Country Name"
                                withAsterisk
                                value={formData.country}
                                onChange={(e) => handleChange("country", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="City"
                                placeholder="Enter City Name"
                                withAsterisk
                                value={formData.city}
                                onChange={(e) => handleChange("city", e.currentTarget.value)}
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
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default memo(AddContractorComponent);