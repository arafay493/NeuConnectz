// Note: AppLayOut component...!

'use client';

import {
  ReactNode,
  useState,
  useEffect,
  memo,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NextImage from 'next/image';
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  NavLink,
  Avatar,
  Text,
  ActionIcon,
  Stack,
  Image,
  Divider,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconLogout,
  IconBell,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { DrawerRoute } from "@/types/route-types";
import { routes, drawerRoutes, authenticatedRoutes } from '@/constants/routes';
// import { localAssets } from '@/lib/file-paths/file-paths';
import { logout } from '@/constants/logout';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';

const AppLayOut = ({ children }: { children: ReactNode }) => {

  // Note: Handle Mantine UI theme...!
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isLargeScreen = useMediaQuery('(min-width: 1660px)');
  const [opened, { toggle }] = useDisclosure(true);

  // Note: Handling states here...!
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Note: Handling redux here...!
  const dispatch = useAppDispatch();

  // Note: Fetch user data from redux...!
  const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });
  // console.log('User: ', authenticatedUser);

  // Note: Handle navigation here...!
  const router = useRouter();
  const pathName = usePathname();
  // console.log('Path: ', pathName);

  // Note: This hook will run only once when the component mounts...!
  useEffect(() => {
    if (window.location.pathname === routes.root) router.push(routes.dashboard);
  }, []);

  // Note: This hook will automatically update activeTab based on current route path...!
  useEffect(() => {
    const activeRouteIndex = drawerRoutes.findIndex(route => route.route === pathName);
    setActiveTab(activeRouteIndex >= 0 ? activeRouteIndex : -1);
  }, [pathName]);

  // Note: Link component for navigation...!
  const renderNavLink = (item: DrawerRoute, index: number) => (
    <NavLink
      href={item.route}
      key={index}
      component="a"
      leftSection={item?.icon}
      label={collapsed ? null : item?.label}
      variant="light"
      px={collapsed ? customStyles.deviceSize.sm : customStyles.deviceSize.md}
      py={customStyles.deviceSize.sm}
      color={activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4D4D4D}
      active={activeTab === index}
      onClick={() => setActiveTab(index)}
      w={collapsed ? 'fit-content' : '100%'}
      style={{
        textTransform: 'capitalize',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        margin: collapsed ? '0 auto' : '0',
      }}
      styles={{
        label: {
          fontSize: 16,
          fontWeight: 500,
          transition: 'opacity 0.3s ease',
          opacity: collapsed ? 0 : 1,
        },
        root: {
          justifyContent: collapsed ? 'center' : 'flex-start',
          width: collapsed ? 'fit-content' : '100%',
          transition: 'all 0.3s ease',
        },
      }}
    />
  );

  return (
    <AppShell
      padding={customStyles.deviceSize.md}
      header={{ height: 80 }}
      navbar={{
        width: collapsed ? 120 : 300,
        breakpoint: customStyles.deviceSize.sm,
        collapsed: { mobile: !opened },
      }}
    >
      {/* Note: Navbar section */} // ! completed
      <AppShellHeader
        ml={collapsed ? 120 : 300}
        px={24}
        style={{
          display: authenticatedRoutes.includes(pathName) || pathName.startsWith(authenticatedRoutes[10] as string) ? 'block' : 'none',
          transition: 'margin-left 0.3s ease', // ✨ smooth movement
        }}
      >
        <Group h='100%' align='center' justify='end'>
          <ActionIcon
            variant="light"
            color="yellow"
            size="xl"
            radius={8}
            // onClick={onEdit}
            style={{
              '&:hover': {
                backgroundColor: '#e7f5ff'
              }
            }}
          >
            <IconBell size={24} />
          </ActionIcon>
          <Group gap="md" align="center">
            <Avatar
              title={`${authenticatedUser?.name?.charAt(0).toUpperCase()}${authenticatedUser?.name?.slice(1).toLowerCase()}`}
              name={authenticatedUser?.name}
              size={48}
              color='initials'
            />
            {/* <Image
              style={{ borderRadius: '50%' }}
              src={localAssets.userIcon}
              height={24}
              width={24}
              alt='User Avatar'
            /> */}
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
      </AppShellHeader>

      {/* Note: Navbar section */}
      <AppShellNavbar
        w={collapsed ? 120 : 300}
        bg={customStyles.colors.white}
        h='100%'
        pos='fixed'
        top='0'
        left='0'
        zIndex={1000}
        style={{
          transition: 'width 0.3s ease', // Smoother transition duration
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
              src={collapsed ? localAssets.logo_sm : localAssets.newLogo}
              alt="Logo"
              component={NextImage}
              h={25}
              w='auto'
            />
            <ActionIcon
              variant="filled"
              color={customStyles.colors._1B59F8}
              size={25}
              onClick={isMobile ? toggle : () => setCollapsed(!collapsed)}
              style={{
                '&:hover': {
                  backgroundColor: '#e7f5ff'
                }
              }}
            >
              {
                collapsed ? <IconChevronRight size={20} /> : <IconChevronLeft size={20} />
              }
            </ActionIcon>
          </Group>
          <Divider mx={26} />
          <Stack
            h='100%'
            justify='space-around'
            px={customStyles.deviceSize.sm}
          >
            <Stack
              // mt={32}
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
              label={collapsed ? null : 'Logout'}
              variant="light"
              px={collapsed ? customStyles.deviceSize.sm : customStyles.deviceSize.md}
              py={customStyles.deviceSize.sm}
              bg='#ED1C241A'
              color='#ED1C24'
              active
              onClick={() => logout("Log Out Success", "You have logged out successfully")}
              w={collapsed ? 'fit-content' : '100%'}
              style={{
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                margin: collapsed ? '0 auto' : '0',
              }}
              styles={{
                label: {
                  fontSize: 16,
                  fontWeight: 500,
                  transition: 'opacity 0.3s ease',
                  opacity: collapsed ? 0 : 1,
                },
                root: {
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  width: collapsed ? 'fit-content' : '100%',
                  transition: 'all 0.3s ease',
                },
              }}
            />
          </Stack>
        </Stack>
      </AppShellNavbar>

      {/* Note: Components section */}
      <AppShellMain style={{
        backgroundColor: customStyles.colors._F5F7FA,
        transition: 'margin-left 0.3s ease', // ✨ optional if needed
      }}>
        {children}
      </AppShellMain>
    </AppShell >
  );
};

export default memo(AppLayOut);