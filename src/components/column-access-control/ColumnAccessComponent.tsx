"use client";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconShieldLock,
} from "@tabler/icons-react";
import { useState } from "react";
import { CLEAR_ALL_PLANTS_STATES_BY_USER } from "@/redux/reducers/plants-reducer/plants-reducer";
import Loader from "../loader/loader";
import { TablesData } from "@/utils/columnsAccessData";
import PutAwayTable_Columns from "./PutAwayTables_Columns";
import UserListTable_Columns from "./UserListTables_Columns";

const ColumnAccessComponent = () => {
  // Note: Media query to determine if the screen is small
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMediumScreen = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");


  // Note: Dispatcher for all Actions
  const dispatch = useAppDispatch();

  // Note: Redux State
  const { putaway_columns } = useAppSelector(({ columnBasedAccessControlStates }) => { return columnBasedAccessControlStates });

  // States
  const [isMainLoading, setIsMainLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState("putaway");

  const handleSelectTable = (value: string) => {
    console.log("🚀 ~ handleSelectUser ~ value:", value)
    setSelectedTable(value ?? "")
  }

  const handleTableRemoved = () => {
    // showNotificationToast("Plant Assigned", data.message, customStyles.colors._408CCE);
    dispatch(CLEAR_ALL_PLANTS_STATES_BY_USER())
    // setSelectedPlants([])
    // setSelectedUser(null)
  }

  if (isMainLoading) {
    return <Loader loadingState={isMainLoading} />
  }

  return (
    <Box>
      <Title
        mb={8}
        order={isSmallScreen ? 3 : 2}
        c={customStyles.colors._4D4D4D}
        // size={isSmallScreen ? "h3" : "h2"}
        style={{ fontWeight: 700, fontSize: 24 }}
      >
        Column Access Control
      </Title>
      <Text
        mb={isSmallScreen ? 16 : 24}
        c={customStyles.colors._909090}
        // size={isSmallScreen ? "sm" : "md"}
        style={{ fontWeight: 500, fontSize: 16 }}
      >
        Select a table and customize the columns you want to display.
      </Text>

      {/* Search Bar */}
      <Group
        p={isSmallScreen ? 16 : 24}
        justify={
          isSmallScreen ? "flex-start" : customStyles.alignment.spaceBetween
        }
        align={isSmallScreen ? "stretch" : "flex-end"}
        bg={customStyles.colors.white}
        style={{ borderRadius: "16px" }}
        wrap="wrap"
        gap={isSmallScreen ? 16 : 24}
      >
        <Group
          w={isSmallScreen ? "100%" : "auto"}
          justify={isSmallScreen ? "center" : "flex-start"}
          wrap="wrap"
          gap={isSmallScreen ? 12 : 16}
        >
          <Stack
            gap={4}
            w={
              isSmallScreen
                ? "100%"
                : isMediumScreen
                  ? "48%"
                  : isLargeScreen
                    ? 300
                    : 250
            }
            maw={isSmallScreen ? "100%" : 350}
          >
            <Text size={isSmallScreen ? "sm" : "md"} mb={4} fw={500}>
              Select Table
            </Text>
            <Select
              placeholder="Select Table"
              data={TablesData}
              value={selectedTable}
              // onChange={(value: any) => handleSelectUser(value)}
              onChange={(value: any) => {
                if (value === null) {
                  handleTableRemoved();
                } else {
                  handleSelectTable(value);
                }
              }}
              clearable
              w="100%"
              radius={8}
              size={isSmallScreen ? "sm" : "md"}
            />
          </Stack>
        </Group>
        <Group>
          <Button
            variant="transparent"
            className={"filledButton"}
            radius={8}
            size={isSmallScreen ? "sm" : "md"}
            leftSection={<IconShieldLock size={isSmallScreen ? 20 : 24} />}
            // onClick={handleAssignPlants}
            // disabled={!(selectedPlants?.length > 0)}
            w={isSmallScreen ? "100%" : "auto"}
            mt={isSmallScreen ? 16 : 0}
          >
            Allow Access
          </Button>
        </Group>
      </Group>

      <Stack
        p={24}
        mt={24}
        bg={customStyles.colors.white}
        style={{ borderRadius: "16px", width: "100%" }}
      >
        {selectedTable === "putaway" && <PutAwayTable_Columns />}
        {selectedTable === "userList" && <UserListTable_Columns />}
      </Stack>
    </Box>
  );
};

export default ColumnAccessComponent;
