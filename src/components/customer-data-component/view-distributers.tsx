"use client";

import { FC, memo, useMemo, useState, useEffect } from "react";
import {
    Modal,
    Paper,
    Group,
    Title,
    Button,
    Box,
    Text,
    Badge,
    ActionIcon,
    Tooltip
} from "@mantine/core";
import {
    IconX,
    IconTrash,
    IconEdit
} from "@tabler/icons-react";
import { customStyles } from "@/styles/custom-theme";
import { apiPut, apiGet } from '@/lib/api-service';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { useAppSelector } from '@/redux/store';

interface Props {
    open: boolean;
    close: () => void;
    data: any;
}

const SubCustomersModal: FC<Props> = ({
    open,
    close,
    data,
}) => {
    const rows = useMemo(
        () =>
            data.distributerNames.map((name: string, index: number) => ({
                sn: index + 1,
                distributorName: name,
                customerCode: data.customerCode,
                customerName: data.customerName,
                city: data.city,
                province: data.province,
                country: data.country,
                isActive: data.isActive
            })),
        [data]
    );

    // States...!
    const [provinceId, setProvinceId] = useState<string>("");
    const [cityId, setCityId] = useState<string>("");

    // Note: State for Authentication
    const { authenticatedUser } = useAppSelector(({ authStates }) => authStates);

    // Update Customer master in DB using API call...!
    const updateCustomerHandler = async (customerData: any) => {
        console.log('Customer Data:', customerData);

        try {
            const response = await apiPut(`/neu-connect/v2${process.env.NEXT_PUBLIC_UPDATE_CUSTOMER}`, customerData, authenticatedUser?.token);
            console.log('Update Customer Response:', response);

            const { status, data } = response;
            if (status == 200) {
                showNotificationToast("Success", "Sub customer deleted successfully", customStyles.colors._1B59F8);
                close();
            };
        }

        catch (error) {
            console.log('Something went wrong while updating customer:', error);
        };
    };

    // Note: Function to delete a distributer...!
    const handleDelete = (distributorName: string) => {
        const fetchDistributors = data.distributerNames.filter(
            (name: string) => name !== distributorName
        );
        data.distributerNames = fetchDistributors;
        console.log("Delete distributor: ", data.distributerNames);

        const customerData = {
            customerId: data?.id,
            customerName: data?.customerName,
            country: data?.country,
            provinceId: provinceId,
            cityId: cityId,
            address: data?.address,
            customerType: "subcustomer",
            distributerNames: data?.distributerNames,
        };
        updateCustomerHandler(customerData);
    };

    // Note: Fetch all cities by pronince id...!
    const fetchAllCitiesByProvince = async () => {
        const cityName = data?.city;
        try {

            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_CITIES}?provinceId=${provinceId}`, authenticatedUser?.token);
            // console.log("Cities Response: ", response);

            const { status, data } = response;
            if (status == 200) {
                const city = data?.data?.data?.find((ct: any) => ct?.cityName === cityName);
                setCityId(city ? city.id : "");
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all cities', error);
            showNotificationToast("Something went wrong", String(error), customStyles.colors.red);
        };
    };

    // Note: Fetch all provinces...!
    const fetchAllProvinces = async (provinceName : string) => {
        // console.log("Fetching province name: ", provinceName);
        try {
            const response = await apiGet(`/neu-connect/v2${process.env.NEXT_PUBLIC_LIST_All_PROVINCES}`, authenticatedUser?.token);
            // console.log("Provinces Response: ", response);

            const { status, data, error } = response;
            if (status == 200) {
                const province = data?.data?.data?.find((prov: any) => prov?.provinceName == provinceName);
                setProvinceId(province ? province.id : "");
                fetchAllCitiesByProvince();
            }

            if (!String(status).startsWith('2')) {
                setProvinceId("");
                throw error || "Failed to fetch provinces";
            };
        }

        catch (error) {
            console.log('Something went wrong while fetching all provinces', error);
            showNotificationToast("Something went wrong", String(error), customStyles.colors.red);
        };
    };

    useEffect(() => {
        fetchAllProvinces(data.province);
    }, [data.province]);

    return (
        <Modal
            opened={open}
            onClose={close}
            withCloseButton={false}
            size="70%"
            centered
            radius={5}
        >
            <Paper shadow="md" radius="md" p="xl" withBorder>

                {/* Header */}
                <Group justify="space-between" mb="md">
                    <Title order={3} c={customStyles.colors._4D4D4D}>
                        Sub Customers
                    </Title>

                    <Button variant="transparent" onClick={close}>
                        <IconX size={22} color="red" />
                    </Button>
                </Group>

                {/* Table */}
                <Box
                    mah={600}
                    style={{
                        overflow: "auto",
                        borderRadius: 12,
                        border: `1px solid ${customStyles.colors._E1E7EC}`
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "max-content"
                        }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "S.No",
                                    "Sub Customer",
                                    "Customer Name",
                                    "City",
                                    "Province",
                                    "Status",
                                    "Actions"
                                ].map(header => (
                                    <th
                                        key={header}
                                        style={{
                                            padding: "12px",
                                            textAlign: "left",
                                            background: "#F8FAFC",
                                            borderBottom: `1px solid ${customStyles.colors._E1E7EC}`
                                        }}
                                    >
                                        <Text fw={600}>{header}</Text>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((row: any, index: number) => (
                                <tr
                                    key={index}
                                    style={{
                                        borderBottom: `1px solid ${customStyles.colors._E1E7EC}`,
                                        transition: "0.2s"
                                    }}
                                >
                                    <td style={{ padding: "12px" }}>{row.sn}</td>
                                    <td style={{ padding: "12px" }}>{row.distributorName}</td>
                                    <td style={{ padding: "12px" }}>{row.customerName}</td>
                                    <td style={{ padding: "12px" }}>{row.city}</td>
                                    <td style={{ padding: "12px" }}>{row.province}</td>

                                    <td style={{ padding: "12px" }}>
                                        <Badge
                                            color={row.isActive ? "green" : "red"}
                                            variant="light"
                                        >
                                            {row.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: "12px" }}>
                                        <Group gap="xs">
                                            {/* <Tooltip label="Update Distributor">
                                                <ActionIcon
                                                    variant="light"
                                                    color="blue"
                                                    radius="md"
                                                    onClick={() => onUpdate(row.distributorName)}
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                            </Tooltip> */}

                                            <Tooltip label="Delete Distributor">
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    radius="md"
                                                    onClick={() => handleDelete(row.distributorName)}
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

            </Paper>
        </Modal>
    );
};

export default memo(SubCustomersModal);