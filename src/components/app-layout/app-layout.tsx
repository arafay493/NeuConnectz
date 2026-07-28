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
  AppShellMain,
  Group,
  Avatar,
  Text,
  ActionIcon,
  Stack,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconBell,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { routes, drawerRoutes, authenticatedRoutes } from '@/constants/routes';
import { customStyles } from '@/styles/custom-theme';
import { localAssets } from '@/lib/file-paths/file-paths';
import CollapsedNavbar from './collapsed-navbar';
import ExpandedNavbar from './expanded-navbar';

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

  useEffect(() => {
    if (isMobile) {
      // setCollapsed(false); // Always show expanded navbar on mobile
      console.log('Mobile view detected ' + isMobile);
      console.log('Collapsed state: ' + collapsed);
      setCollapsed(true);
    }
  }, [isMobile]);

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
          display: authenticatedRoutes.includes(pathName) || pathName.startsWith(authenticatedRoutes[9] as string) ? 'block' : 'none',
          // transition: 'margin-left 0.3s ease', // ✨ smooth movement
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
      {collapsed ? (
        <CollapsedNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCollapsed={setCollapsed}
          toggle={toggle}
        />
      ) : (
        <ExpandedNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCollapsed={setCollapsed}
          toggle={toggle}
        />
      )}

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