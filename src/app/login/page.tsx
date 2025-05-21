// Note: LoginScreen page...!

"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';
import { TextInput, PasswordInput, Button, Box, Paper, Text, Group } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { setCookie } from "cookies-next";
import { useAppDispatch } from '@/redux/store';
import { logInUser } from '@/redux/actions/auth-actions/auth-actions';
import { localAssets } from '@/lib/file-paths/file-paths';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '@/components/loader/loader';
import styles from "./login.module.css";
import { customStyles } from "@/styles/custom-theme";

const LoginScreen = () => {

    // Note: handle styling hook...!
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Note: handeling states here...!
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Note: Handeling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fucntion to clear states...!
    const clearStates = () => {
        setLoading(false);
        setEmail("");
        setPassword("");
        setLoading(false);
    };

    // Note: Login api response handler...!
    const handleResponse = (response: any): void => {
        // console.log("Login response: ", response);

        if (response && response.status == 200) {
            setLoading(false); // Note: Stop loading...!
            showNotificationToast("Login Success", "You have logged in successfully", customStyles.colors._408CCE);
            setCookie("UserAuthenticated", true);
            setCookie("AuthToken", response?.data?.data?.token);
            clearStates();
            window.location.reload();
            return;
        }

        if (response && response.status != 200) {
            setLoading(false); // Note: Stop loading...!
            showNotificationToast("Something went wrong!", response?.data?.error, customStyles.colors._408CCE);
            return;
        };
    };

    // Note: Function to login user...!
    const handleLogin = (): void => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.match(emailRegex)) {
            showNotificationToast("Invalid email", "Please enter a valid email address.", customStyles.colors.red);
            return;
        };

        if (password.trim().length < 6) {
            showNotificationToast("Invalid password", "Password must be at least 6 characters long.", customStyles.colors.red);
            return;
        };

        setLoading(true); // Note: Start loading...!
        const dataObj = {
            email,
            password
        };
        // console.log("Login data: ", dataObj);
        dispatch(logInUser({
            loginData: dataObj,
            resHandler: handleResponse
        }));
    };

    return (
        <Box
            style={{
                display: customStyles.elementDirection.displayFlex,
                flexDirection: isMobile ? customStyles.elementDirection.column : customStyles.elementDirection.row,
                height: customStyles.sizeWidthAndHeight.viewHeight,
                width: customStyles.sizeWidthAndHeight.viewWidth,
                margin: 0,
                padding: 0,
            }}
        >

            {/* Note: Left side container */}
            <Box
                className={styles.loginLeftContainer}
                style={{
                    flex: 1,
                    display: customStyles.elementDirection.displayFlex,
                    flexDirection: customStyles.elementDirection.column,
                    justifyContent: customStyles.alignment.center,
                    alignItems: customStyles.alignment.center,
                }}
            >
                {/* Note: Logo image */}
                <Image
                    src={localAssets.whiteLogo}
                    alt="Logo"
                    style={{
                        width: "40%",
                        height: "auto",
                        marginBottom: customStyles.size.size_40
                    }}
                    priority={true}
                />

                {/* Note: Product image */}
                <Image
                    src={localAssets.productImage}
                    alt="Product Design Image"
                    style={{
                        width: "70%",
                        height: "auto",
                        borderRadius: customStyles.size.size_10,
                        opacity: 0.8
                    }}
                    unoptimized={true}
                    priority={true}
                />
            </Box>

            {/* Note: Right side container */}
            <Box
                style={{
                    flex: 1,
                    display: customStyles.elementDirection.displayFlex,
                    justifyContent: customStyles.alignment.center,
                    alignItems: customStyles.alignment.center,
                    padding: customStyles.size.size_20
                }}
            >
                {/* Note: Loading Component */}
                <Loader loadingState={loading} />

                {/* Note: Login form container */}
                <Paper
                    style={{
                        width: customStyles.sizeWidthAndHeight.fullWidth,
                        maxWidth: customStyles.size.size_500,
                        padding: customStyles.size.size_40,
                        borderRadius: customStyles.size.size_8,
                        boxShadow: '10px 10px 15px rgba(0, 0, 0, 0.1)',
                    }}
                >

                    {/* Note: Sign in heading */}
                    <Text
                        size={customStyles.deviceSize.xl}
                        style={{
                            textAlign: customStyles.alignment.center,
                            fontWeight: 600,
                            color: customStyles.colors._4D4D4D,
                            textTransform: customStyles.textTransformation.capitalize,
                            marginBottom: customStyles.size.size_10,
                        }}
                    >
                        log in
                    </Text>

                    {/* Note: Greeting heading */}
                    <Text
                        size={customStyles.deviceSize.md}
                        style={{
                            color: customStyles.colors._909090,
                            textAlign: customStyles.alignment.center,
                            marginBottom: customStyles.size.size_20,
                        }}
                    >
                        Welcome to ZConnect
                    </Text>

                    <div>
                        {/* Note: Email input field */}
                        <TextInput
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ marginBottom: customStyles.size.size_15 }}
                            labelProps={{ style: { color: customStyles.colors._4D4D4D } }}
                        />

                        {/* Note: Password input field */}
                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ marginBottom: customStyles.size.size_25 }}
                            labelProps={{ style: { color: customStyles.colors._4D4D4D } }}
                            visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                        />

                        {/* Note: Log in button */}
                        <Group
                            style={{
                                marginBottom: customStyles.size.size_15,
                                justifyContent: customStyles.alignment.spaceBetween,
                            }}
                        >
                            <Button
                                fullWidth
                                style={{ textTransform: customStyles.textTransformation.capitalize }}
                                onClick={handleLogin}
                            >
                                log in
                            </Button>
                        </Group>
                    </div>
                </Paper>
            </Box>
        </Box>
    );
};

export default LoginScreen;