// Custom filter functions for specific column types
const serialNumberFilterFn = (row: any, columnId: string, value: string): boolean => {
    if (!value) return true;
    // Calculate serial number based on the current row's position in the filtered data
    const serialNumber = row.index + 1;
    return String(serialNumber).includes(value);
};

const dateFilterFn = (row: any, columnId: string, value: string): boolean => {
    if (!value) return true;
    const cellValue = row.getValue(columnId);
    if (!cellValue) return false;
    const dateValue = new Date(cellValue as string).toLocaleDateString();
    return dateValue.toLowerCase().includes(value.toLowerCase());
};

const numberFilterFn = (row: any, columnId: string, value: string): boolean => {
    if (!value) return true;
    const cellValue = row.getValue(columnId);
    if (cellValue == null) return false;
    return String(cellValue).toLowerCase().includes(value.toLowerCase());
};

const stringFilterFn = (row: any, columnId: string, value: string): boolean => {
    if (!value) return true;
    const cellValue = row.getValue(columnId);
    if (cellValue == null) return false;
    return String(cellValue).toLowerCase().includes(value.toLowerCase());
};

export { serialNumberFilterFn, dateFilterFn, numberFilterFn, stringFilterFn };