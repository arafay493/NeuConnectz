"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMediaQuery } from '@mantine/hooks';
import { TextInput, PasswordInput, Button, Box, Paper, Text, Group, Title, Stack } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useAppDispatch } from '@/redux/store';
import { logInUser } from '@/redux/actions/auth-actions/auth-actions';
import { localAssets } from '@/lib/file-paths/file-paths';
import showNotificationToast from '@/lib/notification-toast/notification-toast';
import Loader from '@/components/loader/loader';
import styles from "./login.module.css";
import { customStyles } from "@/styles/custom-theme";
import { useRouter } from 'next/navigation';
import AuthService from '@/lib/auth-service/auth-service';

const LoginScreen = () => {

    // Note: handle styling hook...!
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Note: handling states here...!
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // Note: Handling redux here...!
    const dispatch = useAppDispatch();

    // Note: Check if user is already authenticated on component mount
    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            router.replace('/dashboard');
        }
    }, [router]);

    // Note: Function to clear states...!
    const clearStates = () => {
        setLoading(false);
        setEmail("");
        setPassword("");
        setLoading(false);
    };

    // Note: Login api response handler...!
    const handleResponse = (response: any): void => {
        const errorResponseCodes = {
            400: "Invalid Password",
            404: "User Not Found",
            500: "Internal Server Error"
        };

        if (response && response.status === 200) {
            setLoading(false); // Note: Stop loading...!

            const { token, refreshToken } = response?.data?.data;
            // Use AuthService to set tokens
            AuthService.setTokens(token, refreshToken);

            showNotificationToast("Login Success", "You have logged in successfully", customStyles.colors._408CCE);
            clearStates();

            // Add a small delay to ensure cookies are set before redirect
            setTimeout(() => {
                router.replace('/dashboard');
            }, 100);
            return;
        }

        if (response.status === 404 || response.status === 500 || response.status === 400) {
            setLoading(false); // Note: Stop loading...!
            showNotificationToast("Login Failed", errorResponseCodes[response.status as keyof typeof errorResponseCodes], customStyles.colors.red);
            return;
        }
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

        dispatch(logInUser({
            loginData: dataObj,
            resHandler: handleResponse
        }));
    };

    return (
        <Box
            bg={String(customStyles.colors._F8F9FA)}
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
            <Stack
                align='center'
                justify='center'
                flex={1}
                className={styles.loginLeftContainer}
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
                        width: "60%",
                        height: "auto",
                        borderRadius: customStyles.size.size_10,
                        opacity: 0.8
                    }}
                    unoptimized={true}
                    priority={true}
                />
            </Stack>

            {/* Note: Right side container */}
            <Box
                flex={1}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: customStyles.size.size_20,
                    position: 'relative'
                }}
            >
                {/* Note: Loading Component */}
                <Loader loadingState={loading} />

                {/* Note: Main content centered */}
                <Stack
                    align='center'
                    justify='center'
                    style={{ flex: 1 }}
                >
                    {/* Note: Login form container */}
                    <Paper
                        // shadow='md'
                        radius='xl'
                        p='xl'
                        style={{
                            display: customStyles.elementDirection.displayFlex,
                            flexDirection: customStyles.elementDirection.column,
                            justifyContent: customStyles.alignment.center,
                            alignItems: customStyles.alignment.center,
                            width: '37.5rem',
                            height: '31.25rem',
                            maxWidth: customStyles.size.size_500,
                            padding: customStyles.size.size_40,
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                    >

                        {/* Note: Sign in heading */}
                        <Title
                            order={2}
                            c={customStyles.colors._4D4D4D}
                            mb={4}
                            style={{
                                textAlign: customStyles.alignment.center,
                                textTransform: customStyles.textTransformation.capitalize,
                            }}
                        >
                            log in
                        </Title>

                        {/* Note: Greeting heading */}
                        <Text
                            size={customStyles.deviceSize.md}
                            style={{
                                color: customStyles.colors._909090,
                                textAlign: customStyles.alignment.center,
                                marginBottom: customStyles.size.size_20,
                            }}
                        >
                            Welcome to NeuConnectz
                        </Text>

                        <Stack
                            align="center"
                            style={{
                                width: '100%',
                                alignItems: customStyles.alignment.center,
                            }}
                        >
                            {/* Note: Email input field */}
                            <TextInput
                                w="100%"
                                maw={400}
                                miw={250}
                                size='md'
                                radius={8}
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                labelProps={{ style: { color: customStyles.colors._4D4D4D } }}
                            />

                            {/* Note: Password input field */}
                            <PasswordInput
                                w="100%"
                                maw={400}
                                miw={250}
                                size='md'
                                radius={8}
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                labelProps={{ style: { color: customStyles.colors._4D4D4D } }}
                                visibilityToggleIcon={({ reveal }) => reveal ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                            />

                            {/* Note: Log in button */}
                            <Button
                                mt={32}
                                variant='transparent'
                                size='md'
                                radius={8}
                                className={!email || !password || loading ? 'filledDisabledButton' : 'filledButton'}
                                w="100%"
                                maw={400}
                                miw={250}
                                style={{
                                    textTransform: customStyles.textTransformation.capitalize,
                                }}
                                onClick={handleLogin}
                                disabled={!email || !password || loading}
                            >
                                log in
                            </Button>
                        </Stack>
                    </Paper>
                </Stack>

                {/* Note: Powered by QBS at bottom */}
                <Group
                    gap={8}
                    justify="center"
                    p='sm'
                    style={{
                        position: 'absolute',
                        bottom: 80,
                        left: 0,
                        right: 0,
                        borderRadius: '6px',
                    }}
                >
                    <Text size='sm' fw={500} c={customStyles.colors._909090}>
                        Powered By
                    </Text>
                    <Image
                        src={localAssets.qbsLogo}
                        alt="Powered by QBS"
                        style={{
                            width: "56px",
                            height: "auto",
                            borderRadius: customStyles.size.size_10,
                            opacity: 0.9
                        }}
                        unoptimized={true}
                        priority={true}
                    />
                </Group>
            </Box>
        </Box>
    );
};

export default LoginScreen;