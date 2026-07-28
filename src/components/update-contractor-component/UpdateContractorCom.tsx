// Note: Update contractor component...!

"use client";

import React, { useState, memo , useEffect } from 'react';
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
import { apiPost , apiGet , apiPut } from '@/lib/api-service';
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

const UpdateContractorComponent = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const contractorId = searchParams.get('contractorId');
    console.log('Contractor ID:', contractorId);

    const [formData, setFormData] = useState({
        contractorerName: "",
        address: "",
        city: "",
        country: "",
        loading: false,
    });
    const [contarctorsList, setContarctorsList] = useState<ContractorDataProps[]>([]);

    // Note: Redux States...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Update Contractor in DB using API call...!
    const updateContarctorHandler = async (contractorData: any) => {

        // console.log('Update Contractor Data:', contractorData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPut(`/neu-connect/v2${process.env.NEXT_PUBLIC_UPDATE_CONTRACTOR}`, contractorData, authenticatedUser?.token);
            // console.log('Update Contractor Response:', response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Contractor updated successfully", customStyles.colors._1B59F8);
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
            console.log('Update Contractor Error:', error);
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
                contractorId: contractorId,
                contractorerName: contractorerName,
                address: address,
                city: city,
                country: country,
            };
            updateContarctorHandler(contractorData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            }
        };
    };

    // Note: Fetch all contractors...!
    const fetchAllContarctors = async () => {
        try {
            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_CONTRACTORS}`, authenticatedUser?.token);
            console.log('Contractors:', response);

            const { status, data, error } = response;
            if (status == 200) {
                setContarctorsList(data?.data?.data || []);
            }

            else if (!String(status).startsWith('2')) {
                showNotificationToast('Something went wrong', error, customStyles.colors.red);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching all contractors', error);
        };
    };

    useEffect(() => {
        if (authenticatedUser) {
            fetchAllContarctors();
        };
    }, [authenticatedUser]);

    useEffect(() => {
        if (contarctorsList.length > 0 && contractorId) {
            const contractorDetails = contarctorsList.find((contractor) => contractor.id === contractorId);
            if (contractorDetails) {
                setFormData((prev) => ({
                    ...prev,
                    contractorerName: contractorDetails.contractorName,
                    address: contractorDetails.address,
                    city: contractorDetails.city,
                    country: contractorDetails.country,
                }));
            }
        };
    }, [contarctorsList || contractorId]);

    return (
        <Box>

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Update Contractor</Text>
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
                    Update Contractor
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
                        Update Contractor Information
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
                                label="Address"
                                placeholder="Enter Address"
                                withAsterisk
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.currentTarget.value)}
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
                                label="Country"
                                placeholder="Enter Country Name"
                                withAsterisk
                                value={formData.country}
                                onChange={(e) => handleChange("country", e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default memo(UpdateContractorComponent);