// Note: HTML App Layout component with semantic tags...!

'use client';

import { authenticatedRoutes, drawerRoutes, routes } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { customStyles } from '@/styles/custom-theme';
import {
    ActionIcon,
    Avatar,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconLayoutSidebar,
    IconMenu2
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import {
    memo,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import HtmlCollapsedNavbar from './html-collapsed-navbar';
import HtmlExpandedNavbar from './html-expanded-navbar';

const HtmlAppLayout = ({ children }: { children: ReactNode }) => {

    // Note: Handle Mantine UI theme...!
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1660px)');
    // const [opened, { toggle }] = useDisclosure(true);

    const handleToggle = () => {
        setCollapsed(prev => !prev);
    }

    // Note: Handling states here...!
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Note: Handling redux here...!
    const dispatch = useAppDispatch();

    // Note: Fetch user data from redux...!
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });

    // Note: Handling the router and pathName...!
    const router = useRouter();
    const pathName = usePathname();

    // Note: Handling the auto close on large screen...!
    useEffect(() => {
        if (isLargeScreen) {
            setCollapsed(false);
        }
    }, [isLargeScreen]);

    // Note: Handling the auto close on mobile...!
    useEffect(() => {
        if (isMobile) {
            setCollapsed(true);
        }
    }, [isMobile]);

    // Note: Handling the localStorage for nav state...!
    useEffect(() => {
        const savedNavState = localStorage.getItem('navCollapsed');
        if (savedNavState !== null) {
            setCollapsed(JSON.parse(savedNavState));
        }
    }, []);

    // Note: Save nav state to localStorage...!
    useEffect(() => {
        localStorage.setItem('navCollapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    // Note: Handling the activeTab based on pathName...!
    useEffect(() => {
        const currentIndex = drawerRoutes.findIndex(route => route.route === pathName);
        if (currentIndex !== -1) {
            setActiveTab(currentIndex);
        }
    }, [pathName]);

    // Note: Handling the logout...!
    const handleLogout = () => {
        dispatch({ type: 'auth/logout' });
        router.push(routes.login);
    };

    // Note: Show layout only on authenticated routes...!
    const showLayout = authenticatedRoutes.includes(pathName) || pathName.startsWith(authenticatedRoutes[10] as string);

    if (!showLayout) {
        return <>{children}</>;
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: customStyles.colors.white,
            fontFamily: 'inherit',
            overflow: 'hidden', // Prevent horizontal scroll
            width: '100%',
            maxWidth: '100vw'
        }}>
            {/* Sidebar Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: collapsed ? (isMobile ? '0' : '80px') : (isMobile ? '100%' : '230px'),
                backgroundColor: customStyles.colors.white,
                zIndex: 1000,
                transition: 'width 0.3s ease',
                overflow: 'hidden',
                boxShadow: isMobile && !collapsed ? 'none' : '2px 0 8px rgba(0,0,0,0.1)',
                transform: isMobile && collapsed ? 'translateX(-100%)' : 'translateX(0)',
            }}>
                {collapsed ? (
                    <HtmlCollapsedNavbar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setCollapsed={setCollapsed}
                        toggle={handleToggle}
                    />
                ) : (
                    <HtmlExpandedNavbar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setCollapsed={setCollapsed}
                        toggle={handleToggle}
                    />
                )}
            </nav>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                marginLeft: collapsed ? (isMobile ? '0' : '80px') : (isMobile ? '0' : '230px'),
                transition: 'margin-left 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: isMobile ? '100%' : `calc(100% - ${collapsed ? '80px' : '230px'})`,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <header style={{
                    height: '80px',
                    backgroundColor: customStyles.colors.white,
                    position: 'sticky',
                    top: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: isMobile ? '0 16px' : '0 30px',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <Group gap={customStyles.deviceSize.md}>
                        <ActionIcon
                            variant="subtle"
                            color={customStyles.colors._909090}
                            size="xl"
                            radius={8}
                            onClick={handleToggle}
                            style={{
                                '&:hover': {
                                    backgroundColor: '#e7f5ff'
                                }
                            }}
                        >
                            <IconLayoutSidebar size={28} />
                        </ActionIcon>
                    </Group>

                    <Group gap="md" align="center">
                        {/* <ActionIcon
                            variant="light"
                            color="yellow"
                            size="xl"
                            radius={8}
                            style={{
                                '&:hover': {
                                    backgroundColor: '#e7f5ff'
                                }
                            }}
                        >
                            <IconBell size={24} />
                        </ActionIcon> */}
                        <Group gap="md" align="center">
                            <Avatar
                                title={`${authenticatedUser?.name?.charAt(0).toUpperCase()}${authenticatedUser?.name?.slice(1).toLowerCase()}`}
                                name={authenticatedUser?.name}
                                size={48}
                                color='initials'
                            />
                            <Stack gap={0}>
                                <Text size="sm" fw={500} c={customStyles.colors._4A4A4A}>
                                    {authenticatedUser?.name?.charAt(0).toUpperCase()}{authenticatedUser?.name?.slice(1).toLowerCase()}
                                </Text>
                                <Text size="xs" c={customStyles.colors._909090}>
                                    {authenticatedUser?.userType === 'SuperAdmin' ? 'Super Admin' : 'Admin'}
                                </Text>
                            </Stack>
                        </Group>
                    </Group>
                </header>

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    padding: isMobile ? '16px' : '34px',
                    backgroundColor: customStyles.colors._F5F7FA,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    minHeight: 'calc(100vh - 80px)',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && !collapsed && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                    }}
                    onClick={handleToggle}
                />
            )}
        </div>
    );
};

export default memo(HtmlAppLayout);
