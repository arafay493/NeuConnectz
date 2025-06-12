// Note: AppLayOut component...!

'use client';

import {
  ReactNode,
  useState,
  useEffect,
  memo,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  AppShellSection,
  Burger,
  Group,
  NavLink,
  TextInput,
  Menu,
  Avatar,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconChevronDown,
  IconSearch,
  IconUser,
  IconLogout,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { DrawerRoute } from "@/types/route-types";
import { routes, drawerRoutes, authenticatedRoutes } from '@/constants/routes';
import { localAssets } from '@/lib/file-paths/file-paths';;
import { logout } from '@/constants/logout';
import { customStyles } from '@/styles/custom-theme';

const AppLayOut = ({ children }: { children: ReactNode }) => {

  // Note: Handle Mantine UI theme...!
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isLargeScreen = useMediaQuery('(min-width: 1660px)');
  const [opened, { toggle }] = useDisclosure(true);

  // Note: Handeling states here...!
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Note: Handeling redux here...!
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
    setActiveTab(activeRouteIndex >= 0 ? activeRouteIndex : 0);
  }, [pathName]);

  // Note: Link component for navigation...!
  const renderNavLink = (item: DrawerRoute, index: number) => (
    <Link
      key={drawerRoutes[index].label}
      href={item.route}
      passHref
      style={{
        textDecoration: customStyles.textDecoration.none,
        color: activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4A4A4A,
        width: customStyles.sizeWidthAndHeight.fullWidth,
        borderRadius: customStyles.size.size_5,
        boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
        textTransform: customStyles.textTransformation.capitalize,
      }}
    >
      <NavLink
        component="a"
        leftSection={item.icon}
        label={collapsed ? null : item.label}
        variant="light"
        px={collapsed ? customStyles.deviceSize.sm : customStyles.deviceSize.md}
        py={customStyles.deviceSize.sm}
        color={activeTab === index ? customStyles.colors._1B59F8 : customStyles.colors._4A4A4A}
        active={activeTab === index}
        onClick={() => setActiveTab(index)}
        styles={{
          label: { fontSize: 14, fontWeight: 500 },
          root: { justifyContent: collapsed ? customStyles.alignment.center : customStyles.elementDirection.flexStart, width: customStyles.sizeWidthAndHeight.fullWidth },
        }}
      />
    </Link>
  );

  return (
    <AppShell
      padding={customStyles.deviceSize.md}
      withBorder
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? 80 : 270,
        breakpoint: customStyles.deviceSize.sm,
        collapsed: { mobile: !opened, desktop: collapsed },
      }}
    >
      {/* Note: Navbar section */}
      <AppShellHeader
        withBorder
        style={{ display: authenticatedRoutes.includes(pathName) ? 'block' : 'none' }}
      >
        <Group h={customStyles.sizeWidthAndHeight.fullWidth} px={customStyles.deviceSize.md} justify={customStyles.alignment.spaceBetween}>
          <Group style={{
            width: 'auto',
            // justifyContent: customStyles.alignment.spaceBetween,
            // backgroundColor: "yellow"
          }}
          >
            <Burger
              opened={isMobile ? opened : !collapsed}
              onClick={isMobile ? toggle : () => setCollapsed(!collapsed)}
              size={customStyles.deviceSize.sm}
              color={customStyles.colors._1B59F8}
            />

            <Image
              src={localAssets.blueLogo}
              alt="Z_Connect Logo"
              title="Z_Connect"
              width={120}
              style={{ height: "auto" }}
            />

            {/* {!isMobile && (
              <TextInput
                placeholder="Search..."
                radius={customStyles.deviceSize.md}
                size={customStyles.deviceSize.sm}
                style={{ width: '300px' }}
                leftSection={<IconSearch size="1rem" />}
              />
            )} */}
          </Group>

          <Menu shadow={customStyles.deviceSize.md} width={200} position="bottom-end">
            <Menu.Target>
              <Group style={{ cursor: 'pointer' }}>
                <Avatar
                  color="cyan"
                  radius={customStyles.deviceSize.xl}
                  title={`${authenticatedUser?.name?.charAt(0).toUpperCase()}${authenticatedUser?.name?.slice(1).toLowerCase()}`}
                >
                  {authenticatedUser?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <IconChevronDown size="1rem" />
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>

              <Menu.Item component={Link} href="#">
                <IconUser size="1rem" style={{ marginRight: 8 }} /> Account
              </Menu.Item>

              <Menu.Item color={customStyles.colors.red} onClick={() => logout("Log Out Success", "You have logged out successfully")}>
                <IconLogout size="1rem" style={{ marginRight: 8 }} />
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShellHeader>

      {/* Note: Drawer section */}
      <AppShellNavbar
        p={customStyles.deviceSize.xs}
        withBorder
        style={{
          display: authenticatedRoutes.includes(pathName) ? 'block' : 'none',
          overflow: 'scroll'
        }}
      >
        <AppShellSection grow>
          <Group align={customStyles.elementDirection.flexStart} style={{ flexDirection: customStyles.elementDirection.column, marginBottom: 20 }}>
            {renderNavLink(drawerRoutes[0], 0)}
          </Group>

          <Group align={customStyles.elementDirection.flexStart} style={{ flexDirection: customStyles.elementDirection.column }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                textTransform: customStyles.textTransformation.capitalize,
                display: !collapsed ? "block" : "none"
              }}
            >
              transaction
            </div>
            {drawerRoutes.slice(1, 6).map((item, index) => renderNavLink(item, index + 1))}
          </Group>

          <Group align={customStyles.elementDirection.flexStart} style={{ flexDirection: customStyles.elementDirection.column }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                textTransform: customStyles.textTransformation.capitalize,
                marginTop: 20,
                display: !collapsed ? "block" : "none"
              }}
            >
              forms
            </div>
            {drawerRoutes.slice(6).map((item, index) => renderNavLink(item, index + 6))}
          </Group>
        </AppShellSection>

        {/* Note: logout section */}
        <Group align={customStyles.alignment.center} style={{ marginTop: '15px', paddingBottom: 20 }}>
          <Link
            href="#"
            passHref
            style={{
              textDecoration: customStyles.textDecoration.none,
              color: customStyles.colors._4A4A4A,
              width: customStyles.sizeWidthAndHeight.fullWidth,
              borderRadius: customStyles.size.size_5,
              boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
              textTransform: customStyles.textTransformation.capitalize
            }}
          >
            <NavLink
              component="a"
              leftSection={<IconLogout size={20} />}
              label="logout"
              variant="light"
              px={collapsed ? customStyles.deviceSize.sm : customStyles.deviceSize.md}
              py={customStyles.deviceSize.sm}
              color={customStyles.colors._4A4A4A}
              onClick={() => logout("Log Out Success", "You have logged out successfully")}
              styles={{
                label: { fontSize: 14, fontWeight: 500 },
                root: { justifyContent: collapsed ? customStyles.alignment.center : customStyles.elementDirection.flexStart, width: customStyles.sizeWidthAndHeight.fullWidth },
              }}
            />
          </Link>
        </Group>
      </AppShellNavbar>

      {/* Note: Components section */}
      <AppShellMain style={{ backgroundColor: customStyles.colors._F5F7FA }}>
        {children}
      </AppShellMain>
    </AppShell>
  );
};

export default memo(AppLayOut);