// Note: Add User screen...!

"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    TextInput,
    PasswordInput,
    Select,
    Button,
    FileButton,
    Group,
    Container,
    Grid,
    Card,
    Title,
    Text,
    Stack,
} from '@mantine/core';
import { IconUpload, IconTrash, IconUserPlus, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
// import { userDepartments } from '@/constants/user-data';
import { addUser, fetchAllUsers, fetchAllListDepartments } from '@/redux/actions/user-actions/user-actions';
import { fetchAllRolesList } from '@/redux/actions/roles-actions/roles-actions';
import { routes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';
import { FadeLoader } from "react-spinners";
// import UserIcon from "@/assets/images/user.png";
const userIcon = "https://res.cloudinary.com/dxhp0pmrw/image/upload/v1757448710/lwvnmz1516dwacf90hyh.png";

const AddUserScreen = () => {

    // Note: Handling states here...!
    const [userData, setUserData] = useState({
        userName: '',
        email: '',
        department: '',
        role: '',
        phone: '',
        password: '',
        confirmPassword: '',
        image: null as File | null,
        preview: null as string | null,
        loading: false
    });
    const [rolesOptions, setRolesOptions] = useState<{ value: string, label: string }[]>([]);
    const [rolesOptionsLoading, setRolesOptionsLoading] = useState<boolean>(false);
    const [depOptions, setDepOptions] = useState<{ value: string, label: string }[]>([]);
    // Note: State for pagination
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    // Note: Handle routing here...!
    const router = useRouter();

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetching data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
    const { listRoles, totalRolesCount } = useAppSelector(({ rolesStates }) => { return rolesStates });
    const { listDepartmentData } = useAppSelector(({ userStates }) => { return userStates });
    const token = authenticatedUser?.token as string;

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
            image: null,
            preview: null,
            loading: false
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
            router.push(routes.usersList);
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
            showNotificationToast(`Error with the status code: ${response?.status}`, response?.data?.error, customStyles.colors.red);
            return;
        };
    };

    // Note: Function to create / add user...!
    const addUserHandler = () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const phoneRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

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
            else if (!phone.match(phoneRegex)) throw "Invalid phone number format";
            else if (!password.match(passwordRegex)) throw "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character";
            else if (password.trim().length < 1) throw "Password is required";
            else if (confirmPassword.trim().length < 1) throw "Confirm password is required";
            else if (confirmPassword !== password) throw "Passwords do not match";
            else {
                const user = {
                    userName,
                    phone,
                    email,
                    password,
                    departmentId: department,
                    role
                };

                // Note: Enable loader...!
                setUserData({
                    ...userData,
                    loading: true
                });

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
                showNotificationToast("Validation Error", errMessage, customStyles.colors.red);
            };
        };
    };

    // Note: Fetch all roles list...!
    useEffect(() => {
        if (authenticatedUser) {
            // dispatch(fetchAllRolesList(token));
            const skipRecord = 0;
            dispatch(fetchAllRolesList({
                authToken: token,
                LastCount: pagination.pageSize,
                skipRecord: skipRecord,
            }))
            dispatch(fetchAllListDepartments(token));
        }
    }, [authenticatedUser]);

    // Note: This hook is used to set roles options...!
    useEffect(() => {
        if (listRoles && listRoles.length > 0) {
            console.log('List roles: ', listRoles);

            const options = listRoles
                .filter((item) => { return item?.name != "SuperAdmin" })
                .map((role: any) => ({
                    value: role.tag,
                    label: role.name
                }));
            // console.log('Options: ', options);
            setRolesOptions(options);
        };
    }, [listRoles]);

    // Note: This hook is used to set departments options...!
    useEffect(() => {
        if (listDepartmentData != null && listDepartmentData?.departments) {
            // console.log('List deps: ' , listDepartmentData);

            const options = listDepartmentData?.departments.map((dep: any) => ({
                value: dep.id,
                label: dep.departmentName
            }));
            setDepOptions(options);
        };
    }, [listDepartmentData?.departments]);

    const OnScrollEndPaginate = (e: any) => {
        const target = e.currentTarget;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5 && listRoles?.length < totalRolesCount) {
            // const newSkip = (pagination.pageIndex + 1) * pagination.pageSize;
            setRolesOptionsLoading(true)
            const newSkip = 0;
            setPagination((prev) => ({
                pageSize: prev.pageSize + 5,
                pageIndex: prev.pageIndex + 1,
            }));
            dispatch(fetchAllRolesList({
                authToken: token,
                LastCount: pagination.pageSize + 5,
                skipRecord: newSkip,
            })).finally(() => {
                setRolesOptionsLoading(false)
            });
        }
    }

    return (
        <Container
            size="xl"
            py="md"
        >
            {/* Note: Loading Component */}
            <Loader loadingState={userData.loading} />

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
                    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: "auto" }}>
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
                                    data={depOptions}
                                    value={userData.department}
                                    onChange={(val) => handleChange("department", val)}
                                    required
                                />

                                <Select
                                    label="User Role"
                                    placeholder="User Role"
                                    data={rolesOptions}
                                    value={userData.role}
                                    onChange={(val) => handleChange("role", val)}
                                    required
                                    maxDropdownHeight={100}
                                    rightSection={rolesOptionsLoading ? <FadeLoader
                                        height={15}
                                        width={3}
                                        margin={1}
                                        radius={1}
                                        color="#1b59f8" /> : null}
                                    scrollAreaProps={{
                                        onScrollEndCapture: (e) => OnScrollEndPaginate(e),
                                    }}
                                />
                            </Group>

                            <Group grow>
                                <TextInput
                                    type='text'
                                    inputMode='numeric'
                                    label="Phone Number"
                                    placeholder="Phone Number"
                                    value={userData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    maxLength={13}
                                    required
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Password"
                                    value={userData.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    required
                                    visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                                />
                            </Group>

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                value={userData.confirmPassword}
                                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                required
                                visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                            />
                        </Stack>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: "auto" }}>
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
                                                height: 150,
                                                objectFit: 'cover'
                                            }}
                                            width={200}
                                            height={150}
                                            unoptimized
                                        />
                                    )
                                    :
                                    (
                                        // <Image
                                        //     src={UserIcon}
                                        //     alt="User Icon"
                                        //     style={{ width: "auto", height: "180px", objectFit: 'cover', marginBottom: 10 }}
                                        // />
                                        <Image
                                            src={userIcon}
                                            alt="User Icon"
                                            style={{ objectFit: 'cover', marginBottom: 10 }}
                                            unoptimized={true}
                                            priority={true}
                                            height={180}
                                            width={200}
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
                    fullWidth
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