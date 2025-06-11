// Note: This code is designed to export data to a CSV file format...!

export const exportToCSV = <T extends Record<string, any>>(data: T[], filename: string = 'data.csv') => {
    // console.log('Exporting data to CSV:', data);

    if (!data || data.length === 0) {
        console.warn('No data available to export');
        return;
    };

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header];
            const escaped = (val !== undefined && val !== null ? String(val) : '').replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};