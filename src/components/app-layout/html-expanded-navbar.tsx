'use client';

import { logout } from '@/constants/logout';
import { drawerRoutes, routeExists, authenticatedRoutes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';
import { customStyles } from '@/styles/custom-theme';
import { DrawerRoute } from "@/types/route-types";
import {
    ActionIcon,
    Divider,
    Group,
    Image,
    NavLink,
    Stack,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
    IconLayoutSidebar,
    IconLogout,
    IconChevronUp,
    IconChevronDown,
} from '@tabler/icons-react';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

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
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const pathName = usePathname();
    const router = useRouter();

    // Note: Calculate active tab based on current pathname using routeExists function
    const getActiveTabFromPath = () => {
        // First try exact match
        const exactIndex = drawerRoutes.findIndex(route => route.route === pathName);
        if (exactIndex !== -1) return exactIndex;

        // Use routeExists function for more sophisticated matching
        // Create an array of just the drawer route paths for routeExists
        const drawerRoutePaths = drawerRoutes.map(route => route.route);

        // Check if current path exists in any of the drawer routes (handles dynamic routes)
        if (routeExists(pathName, drawerRoutePaths)) {
            // Find which drawer route matches using the same logic as routeExists
            const matchingIndex = drawerRoutes.findIndex(route => {
                const regex = new RegExp("^" + route.route.replace(/:[^/]+/g, "[^/]+") + "$");
                return regex.test(pathName);
            });
            if (matchingIndex !== -1) return matchingIndex;
        }

        // Fallback: try to find parent route for nested routes
        const parentIndex = drawerRoutes.findIndex(route =>
            pathName.startsWith(route.route + '/') || pathName === route.route
        );

        // Final fallback: check if this is even an authenticated route
        if (parentIndex === -1 && !routeExists(pathName, authenticatedRoutes.map(route => String(route)))) {
            return -1; // Don't highlight anything for non-authenticated routes
        }

        return parentIndex !== -1 ? parentIndex : 0; // Default to first route if authenticated
    };

    const currentActiveTab = getActiveTabFromPath();

    // Note: Sync with parent component when route changes
    useEffect(() => {
        if (currentActiveTab !== activeTab) {
            setActiveTab(currentActiveTab);
        }
    }, [pathName, currentActiveTab, activeTab, setActiveTab]);

    // Note: Handle navigation...!
    const handleNavigation = (route: string, index: number) => {
        setActiveTab(index);
        router.push(route);
        if (isMobile) {
            toggle(); // Close mobile menu after navigation
        }
    };

    // Note: Link component for navigation...!
    const renderNavLink = (item: DrawerRoute, index: number) => {
        const isParentActive = currentActiveTab === index;
        const isDropdownOpen = openDropdown === item.label;

        const handleClick = () => {
            if (item.children) {
                // Note: Toggle dropdown (prevent navigation)...!
                setOpenDropdown(prev => (prev === item.label ? null : item.label));
            }
            else {
                // Note: Normal navigation for non-parent items...!
                handleNavigation(item.route, index);
            };
        };

        return (
            <div key={index}>
                <NavLink
                    onMouseEnter={(e) => {
                        if (currentActiveTab !== index) {
                            e.currentTarget.style.backgroundColor = customStyles.colors._E1E7EC;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentActiveTab !== index) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }
                    }}
                    leftSection={item?.icon}
                    rightSection={
                        item.children ? (
                            isDropdownOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                        ) : null
                    }
                    label={item?.label}
                    p="12px 16px"
                    bg={currentActiveTab === index ? customStyles.colors._1B59F81A : ''}
                    c={currentActiveTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D}
                    active={currentActiveTab === index}
                    // onClick={() => handleNavigation(item.route, index)}
                    onClick={handleClick} // Note: Handles expand instead of route navigation
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

                {/* Note: Show nested items ONLY when open */}
                {item.children && isDropdownOpen && (
                    <Stack pl={36} gap={6} mt={6}>
                        {item.children.map((child) => (
                            <NavLink
                                key={child.route}
                                label={child.label}
                                onClick={() => handleNavigation(child.route, index)}
                                active={pathName === child.route}
                                c={pathName === child.route ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D}
                                style={{
                                    borderRadius: 8,
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </Stack>
                )}
            </div>
        );
    }

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
                    className='scroll-bar show-scroll-bar-overflow'
                    flex={1}
                    my={32}
                    justify='space-between'
                    px={customStyles.deviceSize.sm}
                    style={{
                        minHeight: 0,
                        flex: 1,
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
