// Note: Configuration screen...!

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
import ConfigAccessComponent from "@/components/config-access-component/config-access-component";

const Configuration = () => {

    // Note: Handeling states here...!
    const [formData, setFormData] = useState({
        erp: '',
        database: '',
        dbUsername: '',
        dbPassword: '',
        url: '',
        sysUsername: '',
        sysPassword: '',
        warehouse: '',
        loading: false
    });

    // Note: Handeling redxu here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { isSAPConfigExist } = useAppSelector(({ sapStates }) => { return sapStates });
    // const isSAPConfigExist = false;

    // Note: Fucntion to clear all states...!
    const clearAllStates = () => {
        setFormData({
            erp: '',
            database: '',
            dbUsername: '',
            dbPassword: '',
            url: '',
            sysUsername: '',
            sysPassword: '',
            warehouse: '',
            loading: false
        });
    };

    // Note: Handle onchnage...!
    const handleChange = (field: string, value: any) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    // Note: Add SAP configuration api response handler...!
    const handleResponse = (response: any): void => {
        
        if (response && response.status == 200) {
            // Note: Stop loading...!
            setFormData({
                ...formData,
                loading: false
            });
            showNotificationToast("Configuration Saved", "information saved successfully", customStyles.colors._408CCE);
            clearAllStates();
            return;
        }

        if (response && response.status == 403) {
            // Note: Stop loading...!
            setFormData({
                ...formData,
                loading: false
            });
            showNotificationToast("Unauthorized User", "You are not authorized to save this information!", customStyles.colors.red);
            return;
        };

        if (response && response.status != 200) {
            // Note: Stop loading...!
            setFormData({
                ...formData,
                loading: false
            });
            return;
        };
    };

    // Note: Handle submit form...!
    const handleSubmitForm = () => {
        const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/[^\s]*)?$/i;

        const {
            erp,
            database,
            dbUsername,
            dbPassword,
            url,
            sysUsername,
            sysPassword,
            warehouse,
        } = formData;

        try {
            if (!erp) throw "Please select ERP";
            else if (!database) throw "Please select Database";
            else if (dbUsername.trim().length < 1) throw "DB Name is required";
            else if (dbPassword.length < 6) throw "DB Password must be at least 6 characters";
            else if (!url.match(urlRegex)) throw "URL is required or Invalid URL";
            else if (sysUsername.trim().length < 1) throw "System Name is required";
            else if (sysPassword.length < 6) throw "System Password must be at least 6 characters";
            else if (warehouse.trim().length < 1) throw "Warehouse is required";
            else {
                const configObj = {
                    erp,
                    database,
                    databaseUsername: dbUsername,
                    databasePassword: dbPassword,
                    url,
                    systemUsername: sysUsername,
                    systemPassword: sysPassword,
                    inTransitWarehouse: warehouse
                };

                // Note: Enable loader...!
                setFormData({
                    ...formData,
                    loading: true
                });

                dispatch(addSAPConfiguration({
                    token: authenticatedUser?.token as string,
                    sapConfigData: configObj,
                    resHandler: handleResponse
                }));
            };
        }

        catch (error) {
            if (error) {
                const errMessage = error as string
                showNotificationToast("Validation Error", errMessage, customStyles.colors.red);
            };
        };
    };

    // Note: This hook will run when this component mounts...!
    useEffect(() => {
        authenticatedUser && dispatch(checkSAPConfigExist(authenticatedUser?.token));
    }, []);

    if (isSAPConfigExist) return <ConfigAccessComponent />

    return (
        <Box>

            {/* Note: Loading Component */}
            <Loader loadingState={formData.loading} />

            {/* Note: Screen Head section */}
            <Group
                justify={customStyles.alignment.spaceBetween}
                align="flex-start"
                p="md"
            >
                <Stack gap={0}>
                    <Title
                        order={3}
                        style={{
                            color: customStyles.colors._4D4D4D,
                            fontSize: "24px",
                            fontWeight: 700
                        }}
                    >
                        Configuration
                    </Title>

                    <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
                        Customizable Integration
                    </Text>
                </Stack>
            </Group>

            {/* Note: Form section */}
            <div style={{ padding: '10px' }}>
                <Paper shadow="md" radius="md" p="xl" withBorder>
                    <Title
                        order={4}
                        mb="lg"
                        style={{ color: customStyles.colors._4D4D4D }}
                    >
                        User Information
                    </Title>

                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Select ERP"
                                placeholder="Select ERP"
                                data={["SAP", "Oracle", "Microsoft"]}
                                value={formData.erp}
                                onChange={(value) => handleChange('erp', value)}
                                withAsterisk
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <Select
                                label="Select Database"
                                placeholder="Select Database"
                                data={["MySQL", "PostgreSQL", "MongoDB"]}
                                value={formData.database}
                                onChange={(value) => handleChange('database', value)}
                                withAsterisk
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="Database Username"
                                placeholder="Type Database Username"
                                value={formData.dbUsername}
                                onChange={(event) => handleChange('dbUsername', event.currentTarget.value)}
                                withAsterisk
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <PasswordInput
                                type='password'
                                label="Database Password"
                                placeholder="Type Database Password"
                                value={formData.dbPassword}
                                onChange={(event) => handleChange('dbPassword', event.currentTarget.value)}
                                withAsterisk
                                visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                type='url'
                                label="URL"
                                placeholder="Type URL"
                                value={formData.url}
                                onChange={(event) => handleChange('url', event.currentTarget.value)}
                                withAsterisk
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="System Username"
                                placeholder="Type System Username"
                                value={formData.sysUsername}
                                onChange={(event) => handleChange('sysUsername', event.currentTarget.value)}
                                withAsterisk
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <PasswordInput
                                type='password'
                                label="System Password"
                                placeholder="Type System Password"
                                value={formData.sysPassword}
                                onChange={(event) => handleChange('sysPassword', event.currentTarget.value)}
                                withAsterisk
                                visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                            />
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                            <TextInput
                                label="In transit Warehouse"
                                placeholder="Type In Transit Warehouse"
                                value={formData.warehouse}
                                onChange={(event) => handleChange('warehouse', event.currentTarget.value)}
                                withAsterisk
                            />
                        </Grid.Col>

                        <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                size="md"
                                leftSection={<IconSend size={18} />}
                                variant="gradient"
                                gradient={{ from: 'indigo', to: 'cyan' }}
                                onClick={handleSubmitForm}
                                disabled={isSAPConfigExist}
                            >
                                Submit
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Paper>
            </div>
        </Box>
    );
};

export default Configuration;