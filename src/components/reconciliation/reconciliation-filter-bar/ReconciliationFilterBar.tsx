'use client';

import { customStyles } from '@/styles/custom-theme';
import { WarehousesListData } from '@/types/redux-types';
import { Button, Grid, GridCol, Select, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMediaQuery } from '@mantine/hooks';
import { IconCalendarMonth, IconDatabaseImport } from '@tabler/icons-react';
import { Dispatch, FC, SetStateAction } from 'react';

interface ReconciliationFilterBarProps {
    warehouseData: WarehousesListData[];
    selectDate: string | null;
    setSelectDate: Dispatch<SetStateAction<string | null>>;
    toWarehouse: string | null;
    setToWarehouse: Dispatch<SetStateAction<string | null>>
    fromWarehouse: string | null;
    setFromWarehouse: Dispatch<SetStateAction<string | null>>;
    handleGetData: () => void;
}

const ReconciliationFilterBar: FC<ReconciliationFilterBarProps> = ({
    warehouseData = [],
    fromWarehouse,
    setFromWarehouse,
    toWarehouse,
    setToWarehouse,
    selectDate,
    setSelectDate,
    handleGetData
}) => {
    // Break points
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const isMediumScreen = useMediaQuery('(max-width: 1200px)');

    // Transform warehouse data for Select component
    const selectWarehouseData = warehouseData
        .filter(warehouse => warehouse.isActive && !warehouse.isArchived)
        .map(warehouse => ({
            value: warehouse.whsCode,
            label: warehouse.whsName
        }));

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
            {/* From Warehouse */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 'auto'}>
                <Text size="md" mb={8} fw={500}>From Warehouse</Text>
                <Select
                    placeholder="Select warehouse"
                    data={selectWarehouseData}
                    value={fromWarehouse}
                    onChange={(value) => setFromWarehouse(value ?? '')}
                    clearable
                    radius={8}
                    size='md'
                    searchable
                />
            </GridCol>

            {/* To Warehouse */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 'auto'}>
                <Text size="md" mb={8} fw={500}>To Warehouse</Text>
                <Select
                    placeholder="Select warehouse"
                    data={selectWarehouseData}
                    value={toWarehouse}
                    onChange={(value) => setToWarehouse(value ?? '')}
                    clearable
                    radius={8}
                    size='md'
                    searchable
                />
            </GridCol>

            {/* Date */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 'auto'}>
                <Text size="md" mb={8} fw={500}>Date</Text>
                <DatePickerInput
                    rightSection={<IconCalendarMonth size={24} />}
                    placeholder="DD/MM/YY"
                    value={selectDate}
                    onChange={(value: string) => setSelectDate(value)}
                    radius={8}
                    size='md'
                    clearable
                />
            </GridCol>

            {/* Button */}
            <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 'content'}>
                <Button
                    className={!fromWarehouse || !toWarehouse || !selectDate ? 'outlineDisabledButton' : 'outlineButton'}
                    leftSection={<IconDatabaseImport size={24} />}
                    variant="transparent"
                    size="md"
                    radius={8}
                    fullWidth={isSmallScreen}
                    style={{ marginTop: isSmallScreen ? '8px' : '0' }}
                    onClick={() => handleGetData()}
                    disabled={!fromWarehouse || !toWarehouse || !selectDate}
                >
                    Get Data
                </Button>
            </GridCol>
        </Grid>
    )

}

export default ReconciliationFilterBar