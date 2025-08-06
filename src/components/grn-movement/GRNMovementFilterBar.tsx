import { exportDataToCsvFile } from "@/redux/actions/sap-actions/sap-actions"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { customStyles } from "@/styles/custom-theme"
import { Button, Grid, GridCol, Select, Text } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useMediaQuery } from "@mantine/hooks"
import { IconBuildingWarehouse } from "@tabler/icons-react"
import { FC } from "react"
import { DocStatusProp } from "../stock-movement/StockMovementFilterBar"
import { exportToCSV } from "@/constants/export-to-csv"


interface GRNMovementFilterBarProps {
    warehouseCode: string | null;
    selectDate: string | null;
    setSelectDate: (value: string | null) => void;
    vendorCode: string | undefined;
    setVendorCode: (value: string | undefined) => void;
    docStatus: DocStatusProp | undefined;
    setDocStatus: (value: DocStatusProp | undefined) => void;
    selectWarehouseData: { value: string; label: string }[];
    vendorCodeList: { value: string; label: string }[];
    setWarehouseCode: (value: string | null) => void;
    exportToCSV: () => void;
}

const GRNMovementFilterBar: FC<GRNMovementFilterBarProps> = ({
    warehouseCode,
    selectDate,
    setSelectDate,
    vendorCode,
    setVendorCode,
    docStatus,
    setDocStatus,
    selectWarehouseData,
    vendorCodeList,
    setWarehouseCode,
    exportToCSV
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

            {/* Doc Status */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Doc Status</Text>
                <Select
                    placeholder="Select Doc Status"
                    data={['Open', 'Closed', 'Pending']}
                    value={docStatus}
                    onChange={(value) => setDocStatus(value as DocStatusProp | undefined)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            {/* Vendor Code */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Vendor Code</Text>
                <Select
                    placeholder="Select Vendor Code"
                    data={vendorCodeList}
                    value={vendorCode}
                    onChange={(value) => setVendorCode(value as string | undefined)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            {/* From Warehouse */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Warehouse Code</Text>
                <Select
                    placeholder="Select warehouse Code"
                    data={selectWarehouseData}
                    value={warehouseCode}
                    onChange={(value) => setWarehouseCode(value ?? null)}
                    clearable
                    radius={8}
                    size='md'
                />
            </GridCol>

            {/* Date */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : isLargeScreen ? 2 : 4}>
                <Text size="md" mb={8} fw={500}>Date</Text>
                <DatePickerInput
                    placeholder="DD/MM/YY"
                    value={selectDate}
                    onChange={(value: string | null) => setSelectDate(value)}
                    radius={8}
                    size='md'
                    clearable
                />
            </GridCol>

            {/* Apply Filters Button */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 12 : isLargeScreen ? 2 : 4}>
                <Button
                    variant='transparent'
                    className='filledButton'
                    radius={8}
                    size={isSmallScreen ? 'sm' : 'md'}
                    leftSection={<IconBuildingWarehouse size={isSmallScreen ? 20 : 24} />}
                    onClick={exportToCSV}
                    fullWidth
                    mt={isSmallScreen ? 16 : 0}
                >
                    Export To CSV
                </Button>
            </GridCol>
        </Grid>
    )
}

export default GRNMovementFilterBar