import { Button, Select, Text } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { IconBuildingWarehouse, IconCalendarMonth } from "@tabler/icons-react"
import { FC } from "react"
import { DocStatusProp } from "../stock-movement/StockMovementFilterBar"
import styles from './GRNMovementFilterBar.module.css'

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
    return (
        <div className={styles.grid}>
            <div className={styles.colOne}>
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
            </div>
            <div className={styles.colTwo}>
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
            </div>
            <div className={styles.colThree}>
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
            </div>
            <div className={styles.colFour}>
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
            <div className={styles.colFive}>
                <Button
                    variant='transparent'
                    className='filledButton'
                    radius={8}
                    size='md'
                    leftSection={<IconBuildingWarehouse size={24} />}
                    onClick={exportToCSV}
                    fullWidth
                >
                    Export To CSV
                </Button>
            </div>
        </div>
    )
}

export default GRNMovementFilterBar