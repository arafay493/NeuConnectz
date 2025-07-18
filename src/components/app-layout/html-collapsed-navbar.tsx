'use client';

import { usePathname } from 'next/navigation';
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
    IconChevronRight
} from '@tabler/icons-react';
import { DrawerRoute } from "@/types/route-types";
import { drawerRoutes, authenticatedRoutes } from '@/constants/routes';
import { logout } from '@/constants/logout';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';

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

    // Note: Link component for navigation...!
    const renderNavLink = (item: DrawerRoute, index: number) => (
        <NavLink
            href={item.route}
            key={index}
            component="a"
            leftSection={item?.icon}
            label={null}
            variant="light"
            px={customStyles.deviceSize.sm}
            py={customStyles.deviceSize.sm}
            color={activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
            w='fit-content'
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
                '&:hover': {
                    transform: 'scale(1.1)',
                }
            }}
            styles={{
                label: {
                    fontSize: 16,
                    fontWeight: 500,
                    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 0,
                },
                root: {
                    justifyContent: 'center',
                    width: 'fit-content',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                },
            }}
        />
    );

    return (
        <aside style={{
            width: isMobile ? '0' : '120px',
            backgroundColor: customStyles.colors.white,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
            opacity: 1,
            transform: 'translateX(0)',
            overflow: 'hidden',
        }}>
            <Stack h='100%' gap={0}>
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
                    <Image
                        src={localAssets.logo_sm}
                        alt="Logo"
                        component={NextImage}
                        h={25}
                        w='auto'
                    />
                    <ActionIcon
                        variant="filled"
                        color={customStyles.colors._1B59F8}
                        size={25}
                        onClick={isMobile ? toggle : () => setCollapsed(false)}
                        style={{
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: 1,
                            transform: 'scale(1)',
                            '&:hover': {
                                backgroundColor: '#e7f5ff',
                                transform: 'scale(1.1)',
                            }
                        }}
                    >
                        <IconChevronRight size={20} />
                    </ActionIcon>
                </Group>

                <Divider mx={26} style={{
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 1,
                    transform: 'translateX(0)',
                }} />

                {/* Navigation Section */}
                <Stack
                    flex={1}
                    justify='space-around'
                    px={customStyles.deviceSize.sm}
                    style={{ transition: 'all 0.3s ease' }}
                >
                    {/* Navigation Links */}
                    <nav>
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
                    <NavLink
                        component="a"
                        leftSection={<IconLogout size={24} />}
                        label={null}
                        variant="light"
                        px={customStyles.deviceSize.sm}
                        py={customStyles.deviceSize.sm}
                        bg='#ED1C241A'
                        color='#ED1C24'
                        active
                        onClick={() => logout("Log Out Success", "You have logged out successfully")}
                        w='fit-content'
                        style={{
                            borderRadius: '10px',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            opacity: 1,
                            transform: 'scale(1)',
                        }}
                        styles={{
                            label: {
                                fontSize: 16,
                                fontWeight: 500,
                                transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: 0,
                            },
                            root: {
                                justifyContent: 'center',
                                width: 'fit-content',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            },
                        }}
                    />
                </Stack>
            </Stack>
        </aside>
    );
};

export default HtmlCollapsedNavbar;
