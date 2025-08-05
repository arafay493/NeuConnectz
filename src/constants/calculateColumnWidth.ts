// Utility function to calculate optimal column width
const calculateColumnWidth = (headerText: string, sampleValues: string[], minWidth: number = 80, maxWidth: number = 300) => {
    // Calculate width based on header text (approximate 8px per character)
    const headerWidth = headerText.length * 8 + 40; // +40 for padding

    // Calculate width based on longest sample value
    const maxValueLength = sampleValues.reduce((max, value) => {
        return Math.max(max, String(value).length);
    }, 0);
    const valueWidth = maxValueLength * 8 + 40; // +40 for padding

    // Return the larger of header or content width, within min/max bounds
    return Math.min(Math.max(Math.max(headerWidth, valueWidth), minWidth), maxWidth);
};

export default calculateColumnWidth;