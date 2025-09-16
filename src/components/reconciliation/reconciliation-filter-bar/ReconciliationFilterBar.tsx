import { WarehousesListData } from '@/types/redux-types';
import { Button, Select, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendarMonth, IconDatabaseImport } from '@tabler/icons-react';
import { Dispatch, FC, SetStateAction } from 'react';
import styles from './ReconciliationFilterBar.module.css';

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

    // Transform warehouse data for Select component
    const selectWarehouseData = warehouseData
        .filter(warehouse => warehouse.isActive && !warehouse.isArchived)
        .map(warehouse => ({
            value: warehouse.whsCode,
            label: warehouse.whsName
        }));

    return (
        <div className={styles.grid}>
            <div className={styles.colOne}>
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
            </div>
            <div className={styles.colTwo}>
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

            </div>
            <div className={styles.colThree}>
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
            </div>
            <div className={styles.colFour}>
                <Button
                    className={!fromWarehouse || !toWarehouse || !selectDate ? 'filledDisabledButton' : 'outlineButton'}
                    leftSection={<IconDatabaseImport size={24} />}
                    variant="transparent"
                    size="md"
                    radius={8}
                    fullWidth
                    onClick={() => handleGetData()}
                    disabled={!fromWarehouse || !toWarehouse || !selectDate}
                >
                    Get Data
                </Button>
            </div>
        </div>
        // <Grid
        //     mt={16}
        //     mb={8}
        //     bg={customStyles.colors.white}
        //     p={24}
        //     align='end'
        //     style={{
        //         borderRadius: '16px',
        //         gap: isSmallScreen ? '16px' : '24px'
        //     }}
        // >
        //     {/* From Warehouse */}
        //     <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 3}>
        //     </GridCol>

        //     {/* To Warehouse */}
        //     <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 3}>
        //     </GridCol>

        //     {/* Date */}
        //     <GridCol span={isSmallScreen ? 12 : isMediumScreen ? 6 : 3}>
        //     </GridCol>

        //     {/* Button */}
        //     <GridCol style={{ justifySelf: 'end' }} span={isSmallScreen ? 12 : isMediumScreen ? 6 : 3}>
        //     </GridCol>
        // </Grid>
    )

}

export default ReconciliationFilterBar