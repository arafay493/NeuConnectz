// Note: Add Delivery order component...!

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
    TagsInput
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { customStyles } from '@/styles/custom-theme';
import { IconUserPlus } from '@tabler/icons-react';
import { apiGet, apiPost } from '@/lib/api-service';
import { useRouter } from 'next/navigation';
import { routes } from '@/constants/routes';
import { DatePickerInput } from "@mantine/dates";
import AddDeliveryOrderDraftedTable from "./ado-drafted-table";
import ListAllSaleOrderItemsTableModal from "./SaleOrderModal";
import SaleOrderModal from './SaleOrderModal';
import ListCompletedSOItemsTableModal from "./ListCompletedSOItemsTableModal";

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

const AddDeliveryOrderComponent = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        transportMode: "",
        contractorId: "",
        vehicle: "",
        driverName: "",
        driverContact: "",
        cnic: ""
    });
    const [openCompletedSOItemsModal, setOpenCompletedSOItemsModal] = useState(false);
    const [contarctorsList, setContarctorsList] = useState<ContractorDataProps[]>([]);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [driversList, setDriversList] = useState([]);
    const [openSaleOrderModal, setOpenSaleOrderModal] = useState(false);
    const [selectedSaleOrder, setSelectedSaleOrder] = useState<any | null>(null);
    const [wh, setWh] = useState<string>('');
    const [loader, setLoader] = useState(false);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // DO Main functionality...!
    // fetch all contractors...!
    const fetchAllContarctors = async () => {
        try {
            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_CONTRACTORS}`, authenticatedUser?.token);
            console.log('Contractors', response);

            const { status, data } = response;
            if (status == 200) {
                setContarctorsList(data?.data?.data || []);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all contractors', error);
        };
    };

    // fetch all vehicles by contractor id...!
    const fetchAllVehiclesByContarctorId = async () => {
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_ALL_VEHICLES_BY_CONTRACTOR_ID}?ContractorId=${formData?.contractorId}`, authenticatedUser?.token);
            console.log('Vehicles', response);

            const { status, data } = response;
            if (status == 200) {
                setVehiclesList(data?.data?.data || []);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all vehicles by contractor id', error);
        };
    };

    useEffect(() => {
        if (formData.driverName) {

            const fetchDrivers: any = [...driversList];
            const targetDriver: any = fetchDrivers.find((item: any) => {
                return item.id == formData.driverName
            });
            setFormData({
                ...formData,
                driverContact: targetDriver?.phone
            });
        };
    }, [formData.driverName]);

    useEffect(() => {
        if (formData.vehicle) {
            console.log('Selected vehicle: ', formData.vehicle);
            const fetchVehicleDrivers: any = vehiclesList.find((item: any) => {
                return item.vehicleNumber == formData.vehicle
            });
            const fetchDrivers: any = [...fetchVehicleDrivers?.drivers];
            console.log('Vehicle Data: ', fetchDrivers);
            setDriversList(fetchDrivers);
        };
    }, [formData.vehicle]);

    useEffect(() => {
        if (formData.contractorId) {
            fetchAllVehiclesByContarctorId();
        };
    }, [formData.contractorId]);

    useEffect(() => {
        if (formData.transportMode == "ContractorVehicle") {
            fetchAllContarctors();
        };
    }, [formData.transportMode == "ContractorVehicle"]);

    // This hook will run when sale order selected...!
    useEffect(() => {
        if (selectedSaleOrder) {
            console.log('Selected sale order: ', selectedSaleOrder);
            setWh(selectedSaleOrder?.warehouse?.whsCode);
        }
    }, [selectedSaleOrder]);

    // Note: Function to complete completeDeliveryOrder order...!
    const completeDeliveryOrder = async (doData: any) => {
        console.log('DO Data:', doData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_COMPLETE_DELIVERY_ORDER}`, doData, authenticatedUser?.token);
            console.log(response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Delivery order created successfully", customStyles.colors._1B59F8);
                setFormData({
                    transportMode: "",
                    contractorId: "",
                    vehicle: "",
                    driverName: "",
                    driverContact: "",
                    cnic: ""
                });
                setContarctorsList([]);
                setVehiclesList([]);
                setDriversList([]);
                setSelectedSaleOrder(null);
                setOpenSaleOrderModal(false);
                setOpenCompletedSOItemsModal(false);
                setLoader(false);
                router.push(routes.deliveryOrder);
                //     setDraftedItems([]);
            };
        }

        catch (error) {
            console.log('Something went wrong while completing sale order:', error);
            setOpenCompletedSOItemsModal(false);
            setLoader(false);
        };
    };

    const handleSubmit = () => {

        try {
            // if (selectedSaleOrder) throw "Please select sale order";
            // if (!formData?.vehicle) throw "Please select vehicle";
            // if (draftedItems.length < 1) throw "No drafted sale order items available!";

            const obj = {
                wareHouseCode: selectedSaleOrder?.warehouse?.whsCode,
                vehicleNumber: formData?.vehicle
            };
            setLoader(true);
            completeDeliveryOrder(obj);
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
            {/* Modal */}
            <SaleOrderModal
                open={openSaleOrderModal}
                close={() => setOpenSaleOrderModal(false)}
                fetchSaleOrderData={(saleOData: any) => setSelectedSaleOrder(saleOData)}
            />

            <ListCompletedSOItemsTableModal
                customerReferenceId={selectedSaleOrder?.customer?.customerCode}
                deliveryDate={selectedSaleOrder?.deliveryDate}
                whsCode={selectedSaleOrder?.warehouse?.whsCode}
                open={openCompletedSOItemsModal}
                close={() => setOpenCompletedSOItemsModal(false)}
                salesOrderId={selectedSaleOrder?.id}
                contractorId={formData?.contractorId}
                driverId={formData?.driverName}
                transportMode={formData?.transportMode}
                vehicleNumber={formData?.vehicle}
                cnic={formData?.cnic}
            />

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Add Delivery Order</Text>
                </Stack>
                <Button
                    leftSection={<IconUserPlus size={24} />}
                    className='filledButton'
                    variant="transparent"
                    size="md"
                    radius={8}
                    onClick={handleSubmit}
                    loading={loader}
                    disabled={loader}
                >
                    Save Delivery Order
                </Button>
            </Group>

            {/* Note: Form section */}
            <div style={{ padding: '10px' }}>
                <Paper shadow="md" radius="md" p="xl" withBorder>
                    <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }}>
                        <Title
                            order={4}
                            mb="lg"
                            style={{ color: customStyles.colors._4D4D4D }}
                        >
                            Delivery Order Information
                        </Title>

                        <Button
                            leftSection={<IconUserPlus size={24} />}
                            className='outlineButton'
                            variant="transparent"
                            size="sm"
                            radius={8}
                            onClick={() => setOpenSaleOrderModal(true)}
                        >
                            Add Sale Order
                        </Button>
                    </Group>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Warehouse"
                                placeholder="Enter Warehouse Code"
                                withAsterisk
                                value={wh}
                                onChange={(e) => setWh(e.target.value)}
                                disabled
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

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Vehicle No"
                                placeholder="Select Vehicle"
                                withAsterisk
                                data={
                                    vehiclesList.map((vehicleData: any) => ({
                                        value: vehicleData.vehicleNumber,
                                        label: `${vehicleData.vehicleType} - ${vehicleData.vehicleNumber}`
                                    }))
                                }
                                value={formData.vehicle}
                                onChange={(value) => handleChange("vehicle", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Driver Name"
                                placeholder="Select Driver"
                                withAsterisk
                                data={
                                    driversList.map((driverData: any) => ({
                                        value: driverData.id,
                                        label: driverData.firstName
                                    }))
                                }
                                value={formData.driverName}
                                onChange={(value) => handleChange("driverName", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Driver Contact No"
                                placeholder="Enter Driver Contact No"
                                withAsterisk
                                value={formData.driverContact}
                                onChange={(e) => handleChange("driverContact", e.currentTarget.value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="CNIC"
                                placeholder="Enter CNIC"
                                withAsterisk
                                value={formData.cnic}
                                onChange={(e) => handleChange("cnic", e.currentTarget.value)}
                            />
                        </Grid.Col>
                    </Grid>

                    <AddDeliveryOrderDraftedTable
                        openCompletedSOItemsModal={() => setOpenCompletedSOItemsModal(true)}
                        whsCode={selectedSaleOrder?.warehouse?.whsCode}
                        vehicleNumber={formData?.vehicle}
                        modalClose={openCompletedSOItemsModal}
                    />
                </Paper>
            </div>
        </Box>
    );
};

export default AddDeliveryOrderComponent;