"use client";

// Sales order filter bar component...!

// import { exportDataToCsvFile } from "@/redux/actions/sap-actions/sap-actions";
// import { useAppDispatch, useAppSelector } from "@/redux/store";
import { customStyles } from "@/styles/custom-theme";
import { Button, Grid, GridCol, Select, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconBuildingWarehouse } from "@tabler/icons-react";
import { FC } from "react";

export type SapStatusProp = 'Pending' | 'Updated' | 'Integrated'
export type DocStatusProp = 'Pending' | 'Open' | 'Closed'

interface SalesOrderFilterBarProps {
    saleOrderNo: string | null;
    orderDate: string | null;
    itemCode: string | null;
    customerId: string | null;
    setSaleOrderNo: (value: string | null) => void;
    setOrderDate: (value: string | null) => void;
    setItemCode: (value: string | null) => void;
    setCustomertId: (value: string | null) => void;
}

const SalesOrderFilterBar: FC<SalesOrderFilterBarProps> = ({
    saleOrderNo,
    orderDate,
    itemCode,
    customerId,
    setSaleOrderNo,
    setOrderDate,
    setItemCode,
    setCustomertId
}) => {
    // Note: Media query to determine if the screen is small
    const isSmallScreen = useMediaQuery("(max-width: 768px)")
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');
    const isLargeScreen = useMediaQuery('(min-width: 1300px)');

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
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Sale Order No</Text>
                <Select
                    placeholder="Sale Order No"
                    data={['SO1', 'SO2', 'SO3']}
                    value={saleOrderNo}
                    onChange={(value) => setSaleOrderNo(value as string)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Order Date</Text>
                <DatePickerInput
                    placeholder="Select Order Date"
                    value={orderDate}
                    onChange={(value: string | null) => setOrderDate(value as string)}
                    radius={8}
                    size='md'
                    clearable
                />
            </GridCol>

            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Item Code</Text>
                <Select
                    placeholder="Select Item Code"
                    data={['Item 1', 'Item 2', 'Item 3']}
                    value={itemCode}
                    onChange={(value) => setItemCode(value as string)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Customer Id</Text>
                <Select
                    placeholder="Select Customer"
                    data={['Customer 1', 'Customer 2', 'Customer 3']}
                    value={customerId}
                    onChange={(value) => setCustomertId(value as string)}
                    clearable
                    radius={8}
                    size='md'
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
                    // onClick={handleExportToCSV}
                    fullWidth
                    mt={isSmallScreen ? 16 : 0}
                >
                    Export To CSV
                </Button>
            </GridCol>
        </Grid>
    )
}

export default SalesOrderFilterBar;