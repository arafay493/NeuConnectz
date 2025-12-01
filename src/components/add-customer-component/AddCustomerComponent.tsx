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
    Grid,
    Box,
    TagsInput
} from "@mantine/core";
import { IconSend, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { addSAPConfiguration } from '@/redux/actions/sap-actions/sap-actions';
import { customStyles } from '@/styles/custom-theme';
import { checkSAPConfigExist } from '@/redux/actions/sap-actions/sap-actions';
import { IconUserPlus } from '@tabler/icons-react';
import { apiGet, apiPost } from '@/lib/api-service';
import { useRouter } from 'next/navigation';
import { routes } from '@/constants/routes';

const AddCustomerMasterComponent = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        customerName: "",
        address: "",
        selectedCountry: "",
        selectedProvince: "",
        selectedCity: "",
        customerType: "",
        subCustomers: "",
        loading: false,
    });
    const [tags, setTags] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleTagChange = (newTags: any) => {
        // console.log('New Tag:', newTags);
        setTags(newTags);
    };

    // Note: Fetch all provinces...!
    const fetchAllProvinces = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_PROVINCES}`, authenticatedUser?.token);
            // console.log(response);

            const { status, data, error } = response;
            if (status == 200) {
                setProvinces(data?.data?.data || []);
            }

            if (!String(status).startsWith('2')) {
                setProvinces([]);
                throw error || "Failed to fetch provinces";
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all provinces', error);
            showNotificationToast("Something went wrong", String(error), customStyles.colors.red);
        };
    };

    // Note: Fetch all cities by pronince id...!
    const fetchAllCitiesByProvince = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_CITIES}?provinceId=${formData?.selectedProvince}`, authenticatedUser?.token);
            // console.log(response);

            const { status, data } = response;
            if (status == 200) {
                setCities(data?.data?.data || []);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all cities', error);
            showNotificationToast("Something went wrong", String(error), customStyles.colors.red);
        };
    };

    // Note: THis hook will run when the component is mounted...!
    useEffect(() => {
        if (authenticatedUser) {
            fetchAllProvinces();
        };
    }, []);

    // Note: THis hook will run when the component is mounted...!
    useEffect(() => {
        if (formData?.selectedProvince) {
            fetchAllCitiesByProvince();
            setFormData({
                ...formData,
                selectedCity: "",
            });
        };
    }, [formData?.selectedProvince]);

    // Add Customer master in DB using API call...!
    const addCustomerHandler = async (customerData: any) => {
        console.log('Customer Data:', customerData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_ADD_CUSTOMER}`, customerData, authenticatedUser?.token);
            // console.log(response);

            const { status, data } = response;
            if (status == 201) {
                showNotificationToast("Success", "Customer added successfully", customStyles.colors._1B59F8);
                setFormData({
                    customerName: "",
                    address: "",
                    selectedCountry: "",
                    selectedProvince: "",
                    selectedCity: "",
                    customerType: "",
                    subCustomers: "",
                    loading: false,
                });
                setTags([]);
                setCities([]);
                router.push(routes.customerMaster);
            };
        }

        catch (error) {
            console.log('Add Vehicle Error:', error);
        };
    };

    const handleSubmit = () => {
        const {
            customerName,
            address,
            selectedCountry,
            selectedProvince,
            selectedCity,
            customerType,
        } = formData;

        try {
            if (!customerName.trim()) throw "Customer Name is required";
            if (!address.trim()) throw "Address is required";
            if (!selectedCountry) throw "Please select a Country";
            if (!selectedProvince) throw "Please select a Province";
            if (!selectedCity) throw "Please select a City";
            if (customerType == "SubCustomer" && tags.length < 1) throw "Please add at least one Sub Customer";

            const customerData = {
                customerName: customerName,
                country: selectedCountry,
                provinceId: selectedProvince,
                cityId: selectedCity,
                address: address,
                customerType: "subcustomer",
                distributerNames: tags,
            };
            addCustomerHandler(customerData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            };
        }
    };

    return (
        <Box>

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
                    onClick={handleSubmit}
                    loading={formData.loading}
                    disabled={formData.loading}
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
                            <Select
                                label="Country"
                                placeholder="Select Country"
                                withAsterisk
                                data={[
                                    { value: "Pakistan", label: "Pakistan" }
                                ]}
                                value={formData.selectedCountry || null}
                                onChange={(value) => handleChange("selectedCountry", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Province"
                                placeholder="Select Province"
                                withAsterisk
                                data={
                                    provinces.map((province: any) => ({
                                        value: province.id,
                                        label: province.provinceName
                                    }))
                                }
                                value={formData.selectedProvince || null}
                                onChange={(value) => handleChange("selectedProvince", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="City"
                                placeholder="Select City"
                                withAsterisk
                                data={
                                    cities.map((city: any) => ({
                                        value: city.id,
                                        label: city.cityName
                                    }))
                                }
                                value={formData.selectedCity || null}
                                onChange={(value) => handleChange("selectedCity", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Sub Customer"
                                placeholder="Select Sub Customer"
                                withAsterisk
                                data={[
                                    { value: "SubCustomer", label: "Sub Customer" }
                                ]}
                                value={formData.customerType || null}
                                onChange={(value) => handleChange("customerType", value)}
                            />
                        </Grid.Col>

                        {
                            formData.customerType === "SubCustomer" && (
                                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                                    <div>
                                        <Text size="sm" mb={4}>
                                            Sub Customers
                                        </Text>
                                        <TagsInput
                                            label="Press Enter to submit a Sub Customer"
                                            placeholder="Enter Sub Customer"
                                            clearable
                                            value={tags}
                                            onChange={handleTagChange}
                                        />

                                        {/* <TagsInput
                                            value={tags}
                                            onChange={handleTagChange}
                                            inputProps={{ placeholder: 'Add sub customer' }}
                                        /> */}
                                    </div>
                                </Grid.Col>
                            )
                        }
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default AddCustomerMasterComponent;