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

    const searchValue = value.toLowerCase();
    const date = new Date(cellValue as string);

    // Format the date the same way as displayed in the table (formatDate function)
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Also check against various date parts for better search experience
    const year = date.getFullYear().toString();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    const monthLong = date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();
    const day = date.getDate().toString();

    return formattedDate.toLowerCase().includes(searchValue) ||
        year.includes(value) ||
        month.includes(searchValue) ||
        monthLong.includes(searchValue) ||
        day.includes(value);
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