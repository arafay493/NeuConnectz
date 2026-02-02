// Note: Add sale order component...!

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
import AddSaleOrderDraftedTable from "./aso-drafted-table";
import ListAllItemsByUidTableModal from "./ListAllItemsByUIDTableModal";

const AddSaleOrderComponent = () => {

    const router = useRouter();

    const [formData, setFormData] = useState({
        salesPerson: "",
        customerName: "",
        whName: "",
        deliveryDate: "",
        loading: false,
        distributor: ""
    });
    const [customersList, setCustomersList] = useState([]);
    const [whList, setWHList] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [draftedItems, setDraftedItems] = useState<any[]>([]);

    const [distributorsList, setDistributorsList] = useState<any[]>([]);

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Function to fetch drafted items data...!
    const fetchDraftedItemsData = (arr: any[]) => {
        // console.log('Drafted Items: ', arr);
        setDraftedItems(arr);
    }

    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    // Note: Fetch list all customers of user...!
    const fetchListAllCustomersOfUser = async () => {

        try {
            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_CUSTOMERS_OF_USER}?userId=${authenticatedUser?.userId}`, authenticatedUser?.token);
            console.log('Customers: ', response);

            const { status, data } = response;
            if (status == 200) {
                setCustomersList(data?.data?.data || []);
            }
        }

        catch (error) {
            console.log('Something went wrong while fetching list all customers of user', error);
        };
    };

    // Note: Fetch list all warehouses of user...!
    const fetchListAllWarehousesOfUser = async () => {

        try {
            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_WAREHOUSES_OF_USER}?userId=${authenticatedUser?.userId}`, authenticatedUser?.token);
            // console.log('WH List: ', response);

            const { status, data } = response;
            if (status == 200) {
                const mergeWHData: any = [...data?.data?.destinationWarehouses, ...data?.data?.sourceWarehouses];
                setWHList(mergeWHData || []);
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching list all warehouses of user', error);
        };
    };

    // Note: THis hook will run when the component is mounted...!
    useEffect(() => {
        if (authenticatedUser) {
            setFormData({
                ...formData,
                salesPerson: authenticatedUser?.name
            });
            fetchListAllCustomersOfUser();
            fetchListAllWarehousesOfUser();
        };
    }, []);

    // Note: Function to complete sale order...!
    const completeSaleOrder = async (soData: any) => {
        console.log('Sale Order Data:', soData);

        // Enable loader...!
        setFormData((prev) => ({ ...prev, loading: true }));

        try {
            const response = await apiPost(`/neu-connect/v2${process.env.NEXT_PUBLIC_COMPLETE_SALE_ORDER}`, soData, authenticatedUser?.token);
            // console.log(response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Sale order complete successfully", customStyles.colors._1B59F8);
                setFormData({
                    salesPerson: "",
                    customerName: "",
                    whName: "",
                    deliveryDate: "",
                    loading: false,
                    distributor: ""
                });
                setCustomersList([]);
                setWHList([]);
                setOpenModal(false);
                router.push(routes.salesOrder);
                setDraftedItems([]);
            };
        }

        catch (error) {
            console.log('Something went wrong while completing sale order:', error);
            setOpenModal(false);
        };
    };

    const handleSubmit = () => {

        try {
            if (!formData?.customerName) throw "Please select customer";
            if (!formData?.whName) throw "Please select warehouse";
            if (!formData?.deliveryDate) throw "Please select delivery date";
            if (draftedItems.length < 1) throw "No drafted sale order items available!";

            const obj = {
                wareHouseCode: formData?.whName,
                customerReferenceId: formData?.customerName
            };
            completeSaleOrder(obj);
        }

        catch (error: any) {
            if (error) {
                console.log('Validation Error:', error);
                showNotificationToast("Validation Error", String(error), customStyles.colors.red);
            };
        }
    };

    // Note: his hook will run when customer selected...!
    useEffect(() => {
        if (formData.customerName) {
            // console.log('Selected customer: ', formData.customerName);

            setFormData({
                ...formData,
                distributor: ""
            });

            const targetCustomer: any = [...customersList]?.find((item: any) => {
                return item?.customerCode == formData.customerName;
            });
            const fetchDistributors: string[] = targetCustomer?.distributerNames;
            console.log('Distributors: ', fetchDistributors);
            fetchDistributors && setDistributorsList(fetchDistributors)
        }
    }, [formData.customerName]);

    return (
        <Box>
            {/* Modal */}
            <ListAllItemsByUidTableModal
                open={openModal}
                close={() => setOpenModal(false)}
                customerReferenceId={formData.customerName}
                whsCode={formData.whName}
                deliveryDate={formData.deliveryDate}
            />

            {/* Note: Screen Head section */}
            <Group justify="space-between" align="center" style={{ flexShrink: 0, marginBottom: '16px' }} p={'md'}>
                <Stack gap={0}>
                    <Title order={2} c={customStyles.colors._4D4D4D}>Master Data</Title>
                    <Text c={customStyles.colors._909090}>Add Sale Order</Text>
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
                    Save Sale Order
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
                        Sales Order Information
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Sales Person"
                                placeholder="Enter Sales Person"
                                withAsterisk
                                value={formData.salesPerson}
                                onChange={(e) => handleChange("salesPerson", e.currentTarget.value)}
                                disabled
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Customer Name"
                                placeholder="Select Customer"
                                withAsterisk
                                data={
                                    customersList.map((customer: any) => ({
                                        value: customer.customerCode,
                                        label: customer.customerName
                                    }))
                                }
                                value={formData.customerName || null}
                                onChange={(value) => handleChange("customerName", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Sub Customer"
                                placeholder="Select Sub Customer"
                                withAsterisk
                                data={
                                    distributorsList.map((distributor: any) => ({
                                        value: distributor,
                                        label: distributor
                                    }))
                                }
                                value={formData.distributor || null}
                                onChange={(value) => handleChange("distributor", value)}
                                disabled={formData.customerName == ""}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Warehouse"
                                placeholder="Select Warehouse"
                                withAsterisk
                                data={
                                    whList.map((wh: any) => ({
                                        value: wh.whsCode,
                                        label: wh.whsName
                                    }))
                                }
                                value={formData.whName || null}
                                onChange={(value) => handleChange("whName", value)}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Text size="md" mb={8} fw={500}>Delivery Date</Text>
                            <DatePickerInput
                                placeholder="Select Order Date"
                                withAsterisk
                                value={formData.deliveryDate || null}
                                onChange={(value) => handleChange("deliveryDate", value)}
                                radius={8}
                                size='sm'
                                clearable
                                minDate={new Date()}
                            />
                        </Grid.Col>
                    </Grid>

                    <AddSaleOrderDraftedTable
                        openListItemsModal={() => setOpenModal(true)}
                        customerReferenceId={formData.customerName}
                        whsCode={formData.whName}
                        DeliveryDate={formData.deliveryDate}
                        modalClose={openModal}
                        draftedData={fetchDraftedItemsData}
                    />

                </Paper>
            </div>
        </Box>
    );
};

export default AddSaleOrderComponent;