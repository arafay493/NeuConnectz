'use client';

import { usePathname, useRouter } from 'next/navigation';
import NextImage from 'next/image';
import {
    Group,
    NavLink,
    ActionIcon,
    Stack,
    Image,
    Divider,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconLogout,
    IconChevronLeft,
    IconLayoutSidebar
} from '@tabler/icons-react';
import { DrawerRoute } from "@/types/route-types";
import { drawerRoutes, authenticatedRoutes } from '@/constants/routes';
import { logout } from '@/constants/logout';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';

interface HtmlExpandedNavbarProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
    setCollapsed: (collapsed: boolean) => void;
    toggle: () => void;
}

const HtmlExpandedNavbar = ({
    activeTab,
    setActiveTab,
    setCollapsed,
    toggle
}: HtmlExpandedNavbarProps) => {
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
        <NavLink
            onMouseEnter={(e) => {
                if (activeTab !== index) {
                    e.currentTarget.style.backgroundColor = customStyles.colors._E1E7EC;
                }
            }}
            onMouseLeave={(e) => {
                if (activeTab !== index) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
            key={index}
            leftSection={item?.icon}
            label={item?.label}
            // variant="light"
            p="12px 16px"
            bg={activeTab === index ? customStyles.colors._1B59F81A : ''}
            c={activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D}
            active={activeTab === index}
            onClick={() => handleNavigation(item.route, index)}
            w='100%'
            title={item?.label}
            h={48}
            style={{
                textTransform: 'capitalize',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                margin: '0',
                cursor: 'pointer',
            }}
            styles={{
                label: {
                    fontSize: 14,
                    fontWeight: 700,
                    transition: 'opacity 0.3s ease',
                    opacity: 1,
                },
                root: {
                    justifyContent: 'flex-start',
                    width: '100%',
                    transition: 'all 0.3s ease',
                },
            }}
        />
    );

    return (
        <aside style={{
            width: isMobile ? '100%' : '230px',
            backgroundColor: customStyles.colors.white,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
        }}>
            <Stack h='100%' gap={0} style={{ overflow: 'hidden' }}>
                {/* Header Section */}
                <Group
                    h={80}
                    justify={isMobile ? 'space-between' : "center"}
                    align="center"
                    px={customStyles.deviceSize.sm}
                    py={customStyles.deviceSize.sm}
                    style={{ cursor: 'pointer' }}
                    wrap='nowrap'
                >
                    <Image
                        src={localAssets.newLogo}
                        alt="Logo"
                        component={NextImage}
                        h={32}
                        w='auto'
                    />
                    {
                        isMobile &&
                        <ActionIcon
                            variant="subtle"
                            color={customStyles.colors._909090}
                            size="xl"
                            radius={8}
                            onClick={isMobile ? toggle : () => setCollapsed(true)}
                            style={{
                                '&:hover': {
                                    backgroundColor: '#e7f5ff'
                                }
                            }}
                        >
                            <IconLayoutSidebar size={28} />
                        </ActionIcon>
                    }
                </Group>

                <Divider mx={26} />

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
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {drawerRoutes.map((item, index) => renderNavLink(item, index))}
                        </Stack>
                    </nav>

                    {/* Logout Section */}
                    <NavLink
                        component="a"
                        leftSection={<IconLogout size={24} />}
                        label='Logout'
                        variant="light"
                        px={customStyles.deviceSize.md}
                        py={customStyles.deviceSize.sm}
                        bg='#ED1C241A'
                        color='#ED1C24'
                        active
                        onClick={() => logout("Log Out Success", "You have logged out successfully")}
                        w='100%'
                        style={{
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            margin: '0',
                        }}
                        styles={{
                            label: {
                                fontSize: 14,
                                fontWeight: 600,
                                transition: 'opacity 0.3s ease',
                                opacity: 1,
                            },
                            root: {
                                justifyContent: 'flex-start',
                                width: '100%',
                                transition: 'all 0.3s ease',
                            },
                        }}
                    />
                </Stack>
            </Stack>
        </aside>
    );
};

export default HtmlExpandedNavbar;
