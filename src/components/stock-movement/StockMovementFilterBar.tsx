"use client";

import { exportDataToCsvFile } from "@/redux/actions/sap-actions/sap-actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { Button, Grid, GridCol, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconBuildingWarehouse, IconCalendarMonth } from "@tabler/icons-react";
import { FC } from "react";

export type SapStatusProp = 'Pending' | 'Updated' | 'Integrated'
export type DocStatusProp = 'Open' | 'Closed' | 'Drafted' | 'Completed'

interface StockMovementFilterBarProps {
    toWarehouse: string | null;
    fromWarehouse: string | null;
    selectDate: string | null;
    setSelectDate: (value: string | null) => void;
    sapStatus: SapStatusProp | undefined;
    setSapStatus: (value: SapStatusProp | undefined) => void;
    docStatus: DocStatusProp | undefined;
    setDocStatus: (value: DocStatusProp | undefined) => void;
    selectWarehouseData: { value: string; label: string }[];
    handleFromWarehouseChange: (value: string | null) => void;
    handleToWarehouseChange: (value: string | null) => void;
    sapType: 'ITR' | 'IT' | 'TR',
    sapTypeApiUrl: string,
    isFilterParams?: string
}

const StockMovementFilterBar: FC<StockMovementFilterBarProps> = ({
    toWarehouse,
    fromWarehouse,
    selectDate,
    setSelectDate,
    sapStatus,
    setSapStatus,
    docStatus,
    setDocStatus,
    selectWarehouseData,
    handleFromWarehouseChange,
    handleToWarehouseChange,
    sapType,
    sapTypeApiUrl,
    isFilterParams
}) => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1300px)');

    // Note: handeling redux here...!
    const dispatch = useAppDispatch();
    const { authenticatedUser } = useAppSelector(({ authStates }) => { return authStates });

    // Note: Function to export to CSV data...!
    const handleExportToCSV = () => {
        let apiUrl = !isFilterParams ? sapTypeApiUrl : `${sapTypeApiUrl}?${isFilterParams}`
        dispatch(exportDataToCsvFile({
            token: authenticatedUser?.token || "",
            apiUrl: apiUrl || "",
            type: sapType || ""
        }));
    };

    return (
        <Grid
            mt={16}
            mb={8}
            bg={customStyles.colors.white}
            p={24}
            align='end'
            style={{
                borderRadius: '16px',
                gap: isSmallScreen ? '16px' : '24px'
            }}
        >
            {/* Sap Status */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Sap Status</Text>
                <Select
                    placeholder="Select Sap Status"
                    data={['Updated', 'Integrated', 'Pending']}
                    value={sapStatus}
                    onChange={(value) => setSapStatus(value as SapStatusProp | undefined)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            {/* Doc Status */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Doc Status</Text>
                <Select
                    placeholder="Select Doc Status"
                    data={sapType === "ITR" ? ['Open', 'Closed'] : ["Drafted", "Completed"]}
                    value={docStatus}
                    onChange={(value) => setDocStatus(value as DocStatusProp | undefined)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            {/* From Warehouse */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>From Warehouse</Text>
                <Select
                    placeholder="Select warehouse"
                    data={selectWarehouseData}
                    value={fromWarehouse}
                    onChange={handleFromWarehouseChange}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>To Warehouse</Text>
                <Select
                    placeholder="Select warehouse"
                    data={selectWarehouseData}
                    value={toWarehouse}
                    onChange={handleToWarehouseChange}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            {/* Date */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Date</Text>
                <DatePickerInput
                    rightSection={<IconCalendarMonth size={24} />}
                    placeholder="DD/MM/YY"
                    value={selectDate}
                    onChange={(value: string | null) => setSelectDate(value)}
                    radius={8}
                    size='md'
                    clearable
                    maxDate={new Date()}
                />
            </GridCol>

            {/* Apply Filters Button */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Button
                    variant='transparent'
                    className='filledButton'
                    radius={8}
                    size={isSmallScreen ? 'sm' : 'md'}
                    leftSection={<IconBuildingWarehouse size={isSmallScreen ? 20 : 24} />}
                    onClick={handleExportToCSV}
                    fullWidth
                    mt={isSmallScreen ? 16 : 0}
                >
                    Export To CSV
                </Button>
            </GridCol>
        </Grid>
    )
}

export default StockMovementFilterBar