// Note: Update Vehicle Component...!

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
    MultiSelect
} from "@mantine/core";
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import { IconUserPlus } from '@tabler/icons-react';
import { apiGet, apiPost , apiPut } from '@/lib/api-service';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/constants/routes';
import { useAppSelector } from '@/redux/store';

interface VehicleDataProps {
    "createdBy": string,
    "updatedBy": string,
    "createdDate": string,
    "updatedDate": string,
    "isActive": boolean,
    "isArchived": boolean,
    "id": string,
    "vehicleNumber": string,
    "description": string,
    "vehicleType": string,
    "capacity": string,
    "contractorName": string,
    "transportMode": string,
    "drivers": [
        {
            "createdBy": string,
            "updatedBy": string,
            "createdDate": string,
            "updatedDate": string,
            "isActive": boolean,
            "isArchived": boolean,
            "id": string,
            "firstName": string,
            "lastName": string,
            "email": string,
            "phone": string,
            "address": string,
            "licenseNumber": string,
            "transportMode": string,
            "contractorId": string
        }
    ]
}

interface VehicleTypesProps {
    id: string,
    vehicleType: string,
    createdBy: string,
    updatedBy: string,
    createdDate: string,
    updatedDate: string,
    isActive: boolean,
    isArchived: boolean
};

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

interface FormDataProps {
    vehicleNumber: string,
    vehicleName: string,
    vehicleType: string,
    capacity: string,
    selectedContractor: string,
    selectedTransporterMode: string,
    drivers: string[],
    loading: boolean,
}

const UpdateVehicletComponent = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const vehicleId = searchParams.get('vehicleId');
    console.log('Vehicle ID:', vehicleId);

    const [formData, setFormData] = useState<FormDataProps>({
        vehicleNumber: "",
        vehicleName: "",
        vehicleType: "",
        capacity: "",
        selectedContractor: "",
        selectedTransporterMode: "",
        drivers: [],
        loading: false,
    });
    const [vehicleTypes, setVehicleTypes] = useState<VehicleTypesProps[]>([]);
    const [contarctorsList, setContarctorsList] = useState<ContractorDataProps[]>([]);
    const [driversList, setDriversList] = useState([]);

    const [vehiclesList, setVehiclesList] = useState<VehicleDataProps[]>([]);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Note: Fetch all vehicle types...!
    const fetchAllVehicleTypes = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_VEHICLE_TYPES}`, authenticatedUser?.token);
            // console.log(response);

            const { status, data } = response;
            if (status == 200) {
                setVehicleTypes(data?.data?.data || []);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all vehicle tyoes', error);
        };
    };

    // Note: Fetch all contractors...!
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
        if (formData.selectedTransporterMode == "ContractorVehicle") {
            fetchAllContarctors();
        }

        else {
            setContarctorsList([]);
            handleChange("selectedContractor", "");
            fetchAllDriversByContarctorId();
        }
    }, [formData.selectedTransporterMode == "ContractorVehicle"]);

    useEffect(() => {
        if (authenticatedUser) {
            fetchAllVehicleTypes();
        };
    }, [authenticatedUser]);

    // Note: Fetch all drivers by contractor id...!
    const fetchAllDriversByContarctorId = async () => {

        try {
            const apiUrl = (formData.selectedTransporterMode == "ContractorVehicle") ? (`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_DRIVERS_BY_CONTRACTOR_ID}?ContractorId=${formData.selectedContractor}`) : (`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_DRIVERS_BY_CONTRACTOR_ID}`)

            const response = await apiGet(apiUrl, authenticatedUser?.token);
            // console.log(response);

            const { status, data } = response;
            if (status == 200) {
                setDriversList(data?.data?.data || []);
            }

            if (!String(status).startsWith("2")) {
                setDriversList([]);
                handleChange("drivers", []);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching all drivers by contractor id', error);
        };
    };

    useEffect(() => {
        if (formData.selectedContractor) {
            fetchAllDriversByContarctorId();
        }

        else {
            setDriversList([]);
            handleChange("drivers", []);
        }
    }, [formData.selectedContractor]);

    // Update Vehicle in DB using API call...!
    const updateVehicleHandler = async (vehicleData: any) => {
        console.log('Vehicle Data:', vehicleData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPut(`/neu-connect/v2${process.env.NEXT_PUBLIC_UPDATE_VEHICLE}`, vehicleData, authenticatedUser?.token);
            console.log('Update Vehicle Response:', response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Vehicle updated successfully", customStyles.colors._1B59F8);
                setFormData({
                    vehicleNumber: "",
                    vehicleName: "",
                    vehicleType: "",
                    capacity: "",
                    selectedContractor: "",
                    selectedTransporterMode: "",
                    drivers: [],
                    loading: false,
                });
                setContarctorsList([]);
                setDriversList([]);
                setVehiclesList([]);
                // router.push(routes.vehicleMaster);
            }

            else if (!String(status).startsWith('2')) {
                showNotificationToast('Something went wrong', data?.error || 'Unable to update vehicle', customStyles.colors.red);
                setFormData((prev) => ({ ...prev, loading: false }));
            }
        }

        catch (error) {
            console.log('Add Vehicle Error:', error);
        };
    };

    const handleSubmit = () => {
        const { vehicleNumber, vehicleName, vehicleType, capacity, selectedTransporterMode, selectedContractor, drivers } = formData;

        try {
            if (!vehicleNumber.trim()) throw "Vehicle Number is required";
            if (!vehicleName.trim()) throw "Vehicle Name is required";
            if (!capacity.trim()) throw "Capacity is required";
            if (!vehicleType) throw "Please select vehicle type";
            if (!selectedTransporterMode) throw "Please select transportation mode";
            if (drivers.length < 1) throw "Please select atleast 1 driver";
            if (formData.selectedTransporterMode == "ContractorVehicle" && !selectedContractor) throw "Please select Contractor";

            const veghicleData = {
                vehicleId: vehicleId,
                vehicleNumber: vehicleNumber,
                description: vehicleName,
                vehicleTypeId: vehicleType,
                capacity: capacity,
                contractorId: (selectedTransporterMode == "ContractorVehicle") ? selectedContractor : null,
                transportMode: selectedTransporterMode,
                driverIds: drivers
            };
            updateVehicleHandler(veghicleData);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            };
        };
    };

    // Note: Fetch all vehicles...!
    const fetchAllVehicles = async () => {
        try {
            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_VEHICLES}`, authenticatedUser?.token);
            console.log('Vehicles: ', response);

            const { status, data, error } = response;
            if (status == 200) {
                setVehiclesList(data?.data?.data || []);
            }

            else if (!String(status).startsWith('2')) {
                showNotificationToast('Something went wrong', error, customStyles.colors.red);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching all vehicles', error);
        };
    };

    useEffect(() => {
        if (authenticatedUser) {
            fetchAllVehicles();
        };
    }, [authenticatedUser]);

    useEffect(() => {
        if (!vehiclesList.length || !vehicleId || !vehicleTypes.length) return;

        const vehicle = vehiclesList.find(v => v.id === vehicleId);
        if (!vehicle) return;

        // Find matching vehicleType ID
        const matchedVehicleType = vehicleTypes.find(
            (t: any) => t.vehicleType === vehicle.vehicleType
        );

        console.log(vehicle.drivers.map(d => d.id, '<<-- Driver IDs'));

        setFormData({
            ...formData,
            drivers: vehicle.drivers.map(d => d.id),
        });

        setFormData((prev) => ({
            ...prev,
            vehicleNumber: vehicle.vehicleNumber,
            vehicleName: vehicle.description,
            vehicleType: matchedVehicleType?.id || "",
            capacity: vehicle.capacity,
            selectedTransporterMode: vehicle.transportMode,
            loading: false,
        }));

    }, [vehiclesList, vehicleId, vehicleTypes]);

    useEffect(() => {
        if (
            !formData.selectedTransporterMode ||
            formData.selectedTransporterMode !== "ContractorVehicle" ||
            !vehiclesList.length ||
            !contarctorsList.length ||
            !vehicleId
        ) return;

        const vehicle = vehiclesList.find(v => v.id === vehicleId);
        if (!vehicle) return;

        const matchedContractor = contarctorsList.find(
            (c: any) => c.contractorName === vehicle.contractorName
        );

        if (matchedContractor) {
            handleChange("selectedContractor", matchedContractor.id);
        }

    }, [contarctorsList, vehiclesList, vehicleId, formData.selectedTransporterMode]);

    return (
        <Box>

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Update vehicle</Text>
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
                    Update Vehicle
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
                        Update Vehicle Master
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
                            <TextInput
                                label="Vehicle Name"
                                placeholder="Enter Vehicle Name"
                                withAsterisk
                                value={formData.vehicleName}
                                onChange={(e) => handleChange("vehicleName", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Vehicle Type"
                                placeholder="Select Vehicle Type"
                                withAsterisk
                                data={vehicleTypes.map((type: any) => ({
                                    value: type.id,
                                    label: type.vehicleType,
                                }))}
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
                            <Select
                                label="Transportation Mode"
                                placeholder="Select Transportation Mode"
                                withAsterisk
                                data={[
                                    { value: "CompanyVehicle", label: "Company Vehicle" },
                                    { value: "ContractorVehicle", label: "ContractorVehicle" },
                                ]}
                                value={formData.selectedTransporterMode}
                                onChange={(value) => handleChange("selectedTransporterMode", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Contractor"
                                placeholder="Select Contractor"
                                withAsterisk
                                data={
                                    contarctorsList.map((contarctor: any) => ({
                                        value: contarctor.id,
                                        label: contarctor.contractorName,
                                    }))
                                }
                                value={formData.selectedContractor}
                                onChange={(value) => handleChange("selectedContractor", value)}
                                disabled={formData.selectedTransporterMode !== "ContractorVehicle"}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <MultiSelect
                                label="Drivers"
                                placeholder="Select Drivers"
                                withAsterisk
                                data={driversList.map((driver: any) => ({
                                    value: driver.id,
                                    label: `${driver.firstName} ${driver.lastName}`
                                }))}
                                value={formData.drivers}
                                onChange={(value) => handleChange("drivers", value)}
                            />
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default memo(UpdateVehicletComponent);