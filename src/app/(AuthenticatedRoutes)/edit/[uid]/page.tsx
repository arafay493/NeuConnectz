// Note: EditUser screen...!

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
  Switch
} from '@mantine/core';
import { IconUpload, IconTrash, IconUserPlus, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Loader from '@/components/loader/loader';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import { userDepartments } from '@/constants/user-data';
import { fetchAllUsers, updateUser } from '@/redux/actions/user-actions/user-actions';
import { fetchAllRolesList } from '@/redux/actions/roles-actions/roles-actions';
import { routes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';
import axios from 'axios';
// import UserIcon from "@/assets/images/user.png";
const userIcon = "https://res.cloudinary.com/dxhp0pmrw/image/upload/v1757448710/lwvnmz1516dwacf90hyh.png";

const EditUserScreen = () => {

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
  const [isUserActiveState, setIsUserActiveState] = useState(false);

  // Note: Handle routing here...!
  const router = useRouter();
  const { uid } = useParams();

  // Note: Handeling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetching data from redux...!
  const { authenticatedUser, } = useAppSelector(({ authStates }) => { return authStates });
  const { listRoles } = useAppSelector(({ rolesStates }) => { return rolesStates });
  const { usersList } = useAppSelector(({ userStates }) => userStates);
  const token = authenticatedUser?.token as string;

  // Note: Handle on change...!
  const handleChange = (field: string, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://zconnectstaging.qbscocloud.net:31155/ZCAPI/IUserManagementFeature/GetUserDataByUserId?userId=${uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData((prev: any) => ({
          ...prev,
          department: response?.data?.data?.department,
          role: response?.data?.data?.role,
          userName: response?.data?.data?.userName,
          email: response?.data?.data?.email,
          phone: response?.data?.data?.phone,
        }));
        setIsUserActiveState(response?.data?.data?.isActive)
      } catch (err: any) {
        console.log(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, [uid])

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

  const handleResponse = (response: any): void => {
    setUserData({
      ...userData,
      loading: true
    });

    if (response?.status === 201) {
      showNotificationToast("Status Updated", "User status changed successfully", customStyles.colors._408CCE);
      dispatch(fetchAllUsers({ authToken: authenticatedUser?.token || "" }));
      router.push(routes.usersList);
    }

    else if (response?.status === 403) {
      showNotificationToast("Unauthorized", "You are not authorized to perform this action!", customStyles.colors.red);
    };
  };

  // Note: Function to update user...!
  const updateUserHandler = () => {
    setUserData({
      ...userData,
      loading: true
    });
    dispatch(updateUser({
      editUserData: {
        userId: uid as string,
        isActive: isUserActiveState
      },
      token: authenticatedUser?.token || "",
      resHandler: handleResponse,
    }));
  };

  // Note: Fetch all roles list...!
  useEffect(() => {
    authenticatedUser && dispatch(fetchAllRolesList({
      authToken: token
    }))
  }, [authenticatedUser]);

  // Note: This hook is used to set roles options...!
  useEffect(() => {
    if (listRoles && listRoles.length > 0) {
      const options = listRoles.map((role) => ({
        value: role.name,
        label: role.name
      }));
      setRolesOptions(options);
    };
  }, [listRoles]);

  // Note: This hook will isActiveUser state...!
  useEffect(() => {
    if (usersList.users.length > 0 && authenticatedUser && uid) {
      const targetUser = [...usersList.users].find((item) => { return item?.userId == uid });

      setUserData({
        userName: targetUser?.userName || "",
        email: targetUser?.email || "",
        department: targetUser?.department || "",
        role: targetUser?.role || "",
        phone: targetUser?.phone || "",
        password: '',
        confirmPassword: '',
        image: null,
        preview: null,
        loading: false
      });
      setIsUserActiveState(targetUser?.isActive || false);
    };
  }, [usersList.users]);

  return (
    <Container
      size="xl"
      py="md"
    >
      {/* Note: Loading Component */}
      <Loader loadingState={userData.loading} />

      <Title
        order={2}
        style={{
          color: customStyles.colors._4D4D4D,
          textTransform: customStyles.textTransformation.capitalize
        }}
      >
        update user
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
                  disabled
                />

                <TextInput
                  label="Email"
                  placeholder="Email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  disabled
                />
              </Group>

              <Group grow>
                <TextInput
                  label="Department"
                  placeholder="Department"
                  type="text"
                  value={userData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  required
                  disabled
                />

                <TextInput
                  label="User Role"
                  placeholder="User Role"
                  type="text"
                  value={userData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  required
                  disabled
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
                  disabled
                />

                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                  disabled
                />
              </Group>

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm Password"
                value={userData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
                visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                disabled
              />

              <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center', gap: 10, marginTop: 10 }}>
                <Switch
                  size="md"
                  // onLabel="ON"
                  // offLabel="OFF"
                  checked={isUserActiveState}
                  onChange={(event) => setIsUserActiveState(event.currentTarget.checked)}
                />

                <Text size="sm" c="dimmed" style={{ color: customStyles.colors._909090 }}>
                  Activate User
                </Text>
              </div>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="lg" p="lg" shadow="sm" style={{ height: '100%' }}>
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
                    //   src={UserIcon}
                    //   alt="User Icon"
                    //   style={{ width: "auto", height: "180px", objectFit: 'cover', marginBottom: 10 }}
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
                    disabled
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
          onClick={updateUserHandler}
        >
          Update User
        </Button>
      </Group>
    </Container>
  );
};

export default EditUserScreen;