// Note: Add User screen...!

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
    TextInput,
    PasswordInput,
    Select,
    Button,
    FileButton,
    Checkbox,
    Group,
    Container,
    Grid,
    Card,
    Title,
    Text,
    Stack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconUpload, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { userRoles, userDepartments } from '@/constants/user-data';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';
import { addUser, fetchAllUsers } from '@/redux/actions/user-actions/user-actions';

const AddUserScreen = () => {

    // Note: Handle Mantine Ui Integration...!
    const isLargeScreen = useMediaQuery('(min-width: 992px)');

    // Note: Handling states here...!
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        department: '',
        role: '',
        phone: '',
        password: '',
        confirmPassword: '',
        isActive: false,
        image: null as File | null,
        preview: null as string | null,
    });

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const token = authenticatedUser?.token as string;
    // console.log("User: ", authenticatedUser);

    // Note: Clear all states handler...!
    const clearAllStates = () => {
        setUserData({
            userName: '',
            email: '',
            department: '',
            role: '',
            phone: '',
            password: '',
            confirmPassword: '',
            isActive: false,
            image: null,
            preview: null
        });
    };

    // Note: Handle on change...!
    const handleChange = (field: string, value: any) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    // Note: Image on chnage handler...!
    const handleImageChange = (file: File | null) => {
        if (file) {
            console.log('File: ', file);
            const reader = new FileReader();
            console.log('Image reader result: ', reader);

            reader.onloadend = () => {
                setUserData({
                    ...userData,
                    image: file,
                    preview: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        };
    };

    // Note: Remove uploaded image handler...!
    const removeUploadedImage = () => {
        setUserData({
            ...userData,
            image: null,
            preview: null
        });
    };

    // Note: Add / Create user response handler...!
    const handleResponse = (response: any): void => {
        console.log("Add user api response: ", response);

        if (response && response.status == 201) {
            // setLoading(false); // Note: Stop loading...!
            showNotificationToast("User Created", "User created successfully", customStyles.colors._408CCE);
            dispatch(fetchAllUsers(token));
            clearAllStates();
            return;
        }

        if (response && response.status != 200) {
            // setLoading(false); // Note: Stop loading...!
            return;
        };
    };

    // Note: Function to create / add user...!
    const addUserHandler = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(?:\+92|92)?(03[0-9]{2})[0-9]{7}$/;
        const {
            userName,
            email,
            department,
            role,
            phone,
            password,
            confirmPassword,
        } = userData;

        try {
            if (userName.trim().length < 1) throw "Username is required";
            else if (!email.match(emailRegex)) throw "Email is required";
            else if (!department) throw "Department is required";
            else if (!role) throw "Role is required";
            else if (!phone.match(phoneRegex)) throw "Phone Number is required";
            else if (password.length < 6) throw "Password must be at least 6 characters";
            else if (confirmPassword !== password) throw "Passwords do not match";
            else {
                const user = {
                    userName,
                    phone,
                    email,
                    password,
                    department,
                    role
                };
                // console.log('User data: ', userData);
                dispatch(addUser({
                    userData: user,
                    token,
                    resHandler: handleResponse
                }));
            };
        }

        catch (error) {
            if (error) {
                const errMessage = error as string
                // console.log("Error: ", errMessage);
                showNotificationToast("Validation Error", errMessage, customStyles.colors.red);
            };
        };
    };

    return (
        <Container size="xl" py="md">
            <Title order={2} style={{
                color: customStyles.colors._4D4D4D,
                textTransform: customStyles.textTransformation.capitalize
            }}>
                add user
            </Title>

            <Text size="sm" c="dimmed" mb="xl" style={{ color: customStyles.colors._909090 }}>
                Username, email, phone, upload picture
            </Text>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: isLargeScreen ? '50vh' : "auto" }}>
                        <Stack gap="md">
                            <Group grow>
                                <TextInput
                                    label="User Name"
                                    placeholder="User Name"
                                    value={userData.userName}
                                    onChange={(e) => handleChange("userName", e.target.value)}
                                    required
                                />

                                <TextInput
                                    label="Email"
                                    placeholder="Email"
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                />
                            </Group>

                            <Group grow>
                                <Select
                                    label="Department"
                                    placeholder="Department"
                                    data={userDepartments}
                                    value={userData.department}
                                    onChange={(val) => handleChange("department", val)}
                                    required
                                />

                                <Select
                                    label="User Role"
                                    placeholder="User Role"
                                    data={userRoles}
                                    value={userData.role}
                                    onChange={(val) => handleChange("role", val)}
                                    required
                                />
                            </Group>

                            <Group grow>
                                <TextInput
                                    type='number'
                                    label="Phone Number"
                                    placeholder="Phone Number"
                                    value={userData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    required
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Password"
                                    value={userData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    required
                                />
                            </Group>

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                value={userData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                required
                            />

                            <Checkbox
                                label="Active"
                                checked={userData.isActive}
                                onChange={(e) => handleChange("isActive", e.currentTarget.checked)}
                            />
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: isLargeScreen ? '50vh' : "auto" }}>
                        <Stack align="center" gap="md">
                            {
                                userData.preview
                                    ?
                                    (
                                        <Image
                                            src={userData.preview}
                                            alt="Profile Preview"
                                            style={{
                                                width: "auto",
                                                height: 200,
                                                objectFit: 'cover'
                                            }}
                                            width={200}
                                            height={200}
                                            unoptimized
                                        />
                                    )
                                    :
                                    (
                                        <Image
                                            src={localAssets.userIcon}
                                            alt="User Icon"
                                            style={{ width: "auto", height: "auto", objectFit: 'cover', marginBottom: 10 }}
                                        />
                                    )
                            }

                            <FileButton onChange={handleImageChange} accept="image/png,image/jpeg">
                                {(props) => (
                                    <Button
                                        fullWidth
                                        leftSection={<IconUpload size={16} />}
                                        {...props}
                                        color={customStyles.colors._1B59F8}
                                    >
                                        Upload Picture
                                    </Button>
                                )}
                            </FileButton>

                            <Button
                                variant="light"
                                color={customStyles.colors.red}
                                fullWidth
                                leftSection={<IconTrash size={16} />}
                                onClick={removeUploadedImage}
                                disabled={!userData.image}
                            >
                                Delete Picture
                            </Button>
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="xl">
                <Button
                    size="md"
                    leftSection={<IconUserPlus size={18} />}
                    fullWidth={!isLargeScreen}
                    style={{ width: isLargeScreen ? "408px" : "" }}
                    color={customStyles.colors._1B59F8}
                    onClick={addUserHandler}
                >
                    Save User
                </Button>
            </Group>
        </Container>
    );
};

export default AddUserScreen;