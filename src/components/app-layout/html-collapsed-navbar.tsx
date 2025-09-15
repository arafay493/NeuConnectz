'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Group,
    NavLink,
    ActionIcon,
    Stack,
    Divider,
    Box,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconLogout,
    IconChevronRight,
    IconLayoutSidebar
} from '@tabler/icons-react';
import { DrawerRoute } from "@/types/route-types";
import { drawerRoutes, authenticatedRoutes } from '@/constants/routes';
import { logout } from '@/constants/logout';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';
// import Logo_sm from "@/assets/images/Logo_sm.png";
const logoSm = "https://res.cloudinary.com/dxhp0pmrw/image/upload/v1757448951/tj8kdknmztfsyoofqnvu.png";

interface HtmlCollapsedNavbarProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
    setCollapsed: (collapsed: boolean) => void;
    toggle: () => void;
}

const HtmlCollapsedNavbar = ({
    activeTab,
    setActiveTab,
    setCollapsed,
    toggle
}: HtmlCollapsedNavbarProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const pathName = usePathname();
    const router = useRouter();

    // Note: Handle navigation...!
    const handleNavigation = (route: string, index: number) => {
        setActiveTab(index);
        router.push(route);
        if (isMobile) {
            toggle(); // Close mobile menu after navigation
        }
    };

    // Note: Link component for navigation...!
    const renderNavLink = (item: DrawerRoute, index: number) => (
        <Box
            key={index}
            onClick={() => handleNavigation(item.route, index)}
            title={item.label}
            style={{
                textTransform: 'capitalize',
                borderRadius: '10px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                opacity: 1,
                transform: 'scale(1)',
                cursor: 'pointer',
                width: 'fit-content',
                padding: `12px 16px`,
                backgroundColor: activeTab === index ? customStyles.colors._1B59F81A : 'transparent',
                color: activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D,
            }}
            onMouseEnter={(e) => {
                if (activeTab !== index) {
                    e.currentTarget.style.backgroundColor = customStyles.colors._E1E7EC;
                }
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                if (activeTab !== index) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
                e.currentTarget.style.transform = 'scale(1)';
            }}
        >
            {item?.icon}
        </Box>
    );

    return (
        <aside style={{
            width: isMobile ? '0' : '80px',
            backgroundColor: customStyles.colors.white,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
            opacity: 1,
            transform: 'translateX(0)',
            overflow: 'hidden',
        }}>
            <Stack h='100%' gap={0} style={{ overflow: 'hidden' }}>
                {/* Header Section */}
                <Group
                    h={80}
                    justify="center"
                    align="center"
                    px={customStyles.deviceSize.sm}
                    py={customStyles.deviceSize.sm}
                    style={{ cursor: 'pointer' }}
                    wrap='nowrap'
                >
                    {/* <Image
                        src={logoSm}
                        alt="Logo"
                        component={NextImage}
                        h={32}
                        w={10}
                    /> */}
                    <Image
                        src={logoSm}
                        alt="Logo"
                        unoptimized={true}
                        priority={true}
                        height={32}
                        width={100}
                    />
                </Group>

                <Divider mx={18} style={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 1,
                    transform: 'translateX(0)',
                }} />

                {/* Navigation Section */}
                <Stack
                    className='scroll-bar'
                    flex={1}
                    my={32}
                    justify='space-between'
                    px={customStyles.deviceSize.sm}
                    style={{
                        overflow: 'hidden',
                        minHeight: 0,
                        flex: 1,
                        overflowY: 'auto',
                    }}
                >
                    {/* Navigation Links */}
                    <nav style={{
                        paddingTop: customStyles.deviceSize.md,
                        paddingBottom: customStyles.deviceSize.md,
                    }}>
                        <Stack
                            gap={customStyles.deviceSize.md}
                            style={{
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: 1,
                                transform: 'translateX(0)',
                            }}
                        >
                            {drawerRoutes.map((item, index) => renderNavLink(item, index))}
                        </Stack>
                    </nav>

                    {/* Logout Section */}
                    <div
                        onClick={() => logout("Log Out Success", "You have logged out successfully")}
                        title="Logout"
                        style={{
                            borderRadius: '10px',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            opacity: 1,
                            transform: 'scale(1)',
                            cursor: 'pointer',
                            width: 'fit-content',
                            padding: `12px 16px`,
                            backgroundColor: '#ED1C241A',
                            color: '#ED1C24',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#ED1C2430';
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ED1C241A';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        <IconLogout size={24} />
                    </div>
                </Stack>
            </Stack>
        </aside>
    );
};

export default HtmlCollapsedNavbar;
