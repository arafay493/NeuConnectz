// Note: Add User screen...!

"use client";

import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
    Button,
    Card,
    Container,
    FileButton,
    Grid,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { IconEye, IconEyeOff, IconTrash, IconUpload, IconUserPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { userDepartments } from '@/constants/user-data';
import { routes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { addQtrackUser, fetchAllUsers } from '@/redux/actions/user-actions/user-actions';
import { customStyles } from '@/styles/custom-theme';

const AddUserScreen = () => {

    // Note: Handling states here...!
    const [userData, setUserData] = useState({
        userName: "",
        phone: "",
        password: "",
        confirmPassword: "",
        image: null as File | null,
        preview: null as string | null,
        loading: false,
    });

    // Note: Handle routing here...!
    const router = useRouter();

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const token = authenticatedUser?.token as string;

    // Note: Clear all states handler...!
    const clearAllStates = () => {
        setUserData({
            userName: "",
            phone: "",
            password: "",
            confirmPassword: "",
            image: null,
            preview: null,
            loading: false,
        });
    };

    // Note: Handle on change...!
    const handleChange = (field: string, value: any) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
    };

    // Note: Image on chnage handler...!
    const handleImageChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();

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
        if (response && response.status == 201) {
            // Note: Stop loading...!
            setUserData({
                ...userData,
                loading: false
            });
            showNotificationToast("User Created", "User created successfully", customStyles.colors._408CCE);
            dispatch(fetchAllUsers({ authToken: token }));
            clearAllStates();
            router.push(routes.qTrackUsersList);
            return;
        }

        if (response && response.status == 403) {
            // Note: Stop loading...!
            setUserData({
                ...userData,
                loading: false
            });
            showNotificationToast("Unauthorized User", "You are not authorized to create a user!", customStyles.colors.red);
            return;
        };

        if (response && response.status != 201) {
            // Note: Stop loading...!
            setUserData({
                ...userData,
                loading: false
            });
            showNotificationToast(`Error`, response?.error, customStyles.colors.red);
            return;
        };
    };

    // Note: Function to create / add user...!
    const addUserHandler = () => {
        const phoneRegex = /^03\d{9}$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

        const {
            userName,
            phone,
            password,
            confirmPassword,
        } = userData;

        try {
            if (userName.trim().length < 1)
                throw "Username is required";

            else if (!phone.match(phoneRegex))
                throw "Invalid phone number format";

            else if (!password.match(passwordRegex))
                throw "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character";

            else if (confirmPassword.trim().length < 1)
                throw "Confirm password is required";

            else if (password !== confirmPassword)
                throw "Passwords do not match";

            const formattedPhone = `92${phone.substring(1)}`;

            const user = {
                userName,
                contactNo: formattedPhone,
                password,
                confirmedPassword: confirmPassword,
                roleIds: [
                    "52181cb0-eadc-450a-a371-a8616d026c91",
                ],
                userType: "Auditor",
            };

            setUserData({
                ...userData,
                loading: true,
            });

            dispatch(
                addQtrackUser({
                    userData: user,
                    token,
                    resHandler: handleResponse,
                })
            );
        } catch (error) {
            showNotificationToast(
                "Validation Error",
                error as string,
                customStyles.colors.red
            );
        }
    };

    return (
        <Container size="xl" py="md">
            {/* Note: Loading Component */}
            <Loader loadingState={userData.loading} />

            <Title
                order={2}
                style={{
                    color: customStyles.colors._4D4D4D,
                    textTransform: customStyles.textTransformation.capitalize,
                }}
            >
                Add QTrack User
            </Title>

            <Text
                size="sm"
                c="dimmed"
                mb="xl"
                style={{ color: customStyles.colors._909090 }}
            >
                Username, phone number, password and upload picture
            </Text>

            <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm">
                        <Stack gap="md">
                            <TextInput
                                label="User Name"
                                autoComplete='off'
                                type="text"
                                placeholder="User Name"
                                value={userData.userName}
                                onChange={(e) =>
                                    handleChange("userName", e.target.value)
                                }
                                required
                            />

                            <TextInput
                                type="text"
                                inputMode="numeric"
                                label="Phone Number"
                                placeholder="03001234567"
                                value={userData.phone}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                maxLength={11}
                                required
                                autoComplete="off"
                            />

                            <PasswordInput
                                label="Password"
                                placeholder="Password"
                                value={userData.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                required
                                visibilityToggleIcon={({ reveal }) =>
                                    reveal ? (
                                        <IconEye size={16} />
                                    ) : (
                                        <IconEyeOff size={16} />
                                    )
                                }
                            />

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                value={userData.confirmPassword}
                                onChange={(e) =>
                                    handleChange("confirmPassword", e.target.value)
                                }
                                required
                                visibilityToggleIcon={({ reveal }) =>
                                    reveal ? (
                                        <IconEye size={16} />
                                    ) : (
                                        <IconEyeOff size={16} />
                                    )
                                }
                            />
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm">
                        <Stack align="center" gap="md">
                            {userData.preview ? (
                                <Image
                                    src={userData.preview}
                                    alt="Profile Preview"
                                    width={200}
                                    height={150}
                                    unoptimized
                                    style={{
                                        width: "auto",
                                        height: 150,
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <Image
                                    src={localAssets.userIcon}
                                    alt="User Icon"
                                    style={{
                                        width: "auto",
                                        height: "180px",
                                        objectFit: "cover",
                                        marginBottom: 10,
                                    }}
                                />
                            )}

                            <FileButton
                                onChange={handleImageChange}
                                accept="image/png,image/jpeg"
                            >
                                {(props) => (
                                    <Button
                                        {...props}
                                        fullWidth
                                        leftSection={<IconUpload size={16} />}
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
                    fullWidth
                    leftSection={<IconUserPlus size={18} />}
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