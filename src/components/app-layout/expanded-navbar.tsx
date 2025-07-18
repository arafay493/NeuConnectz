'use client';

import { usePathname } from 'next/navigation';
import NextImage from 'next/image';
import {
    AppShellNavbar,
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
    IconChevronLeft
} from '@tabler/icons-react';
import { DrawerRoute } from "@/types/route-types";
import { drawerRoutes, authenticatedRoutes } from '@/constants/routes';
import { logout } from '@/constants/logout';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';

interface ExpandedNavbarProps {
    activeTab: number;
    setActiveTab: (index: number) => void;
    setCollapsed: (collapsed: boolean) => void;
    toggle: () => void;
}

const ExpandedNavbar = ({
    activeTab,
    setActiveTab,
    setCollapsed,
    toggle
}: ExpandedNavbarProps) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const pathName = usePathname();

    // Note: Link component for navigation...!
    const renderNavLink = (item: DrawerRoute, index: number) => (
        <NavLink
            href={item.route}
            key={index}
            component="a"
            leftSection={item?.icon}
            label={item?.label}
            variant="light"
            px={customStyles.deviceSize.md}
            py={customStyles.deviceSize.sm}
            color={activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
            w='100%'
            style={{
                textTransform: 'capitalize',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                margin: '0',
            }}
            styles={{
                label: {
                    fontSize: 16,
                    fontWeight: 500,
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
        <AppShellNavbar
            w={isMobile ? '100%' : '300px'}
            bg={customStyles.colors.white}
            h='100%'
            pos='fixed'
            top='0'
            left='0'
            zIndex={1000}
            style={{
                transition: 'width 0.3s ease',
                display: authenticatedRoutes.includes(pathName) || pathName.startsWith(authenticatedRoutes[10] as string) ? 'block' : 'none',
            }}
        >
            <Stack h='100%' gap={0} >
                <Group
                    h={80}
                    justify="space-between"
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
                        h={25}
                        w='auto'
                    />
                    <ActionIcon
                        variant="filled"
                        color={customStyles.colors._1B59F8}
                        size={25}
                        onClick={isMobile ? toggle : () => setCollapsed(true)}
                        style={{
                            '&:hover': {
                                backgroundColor: '#e7f5ff'
                            }
                        }}
                    >
                        <IconChevronLeft size={20} />
                    </ActionIcon>
                </Group>
                <Divider mx={26} />
                <Stack
                    flex={1}
                    justify='space-around'
                    px={customStyles.deviceSize.sm}
                >
                    <Stack
                        gap={customStyles.deviceSize.md}
                        style={{
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {drawerRoutes.map((item, index) => renderNavLink(item, index))}
                    </Stack>
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
                                fontSize: 16,
                                fontWeight: 500,
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
        </AppShellNavbar>
    );
};

export default ExpandedNavbar;
