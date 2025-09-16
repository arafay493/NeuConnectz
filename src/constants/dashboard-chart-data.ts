// Dashboard Chart Data Constants

// Top Transfer Items Chart Data
export const topTransferItemsData = [
    { month: 'Jan', ProductA: 40, ProductB: 30, ProductC: 30 },
    { month: 'Feb', ProductA: 25, ProductB: 50, ProductC: 25 },
    { month: 'Mar', ProductA: 20, ProductB: 40, ProductC: 40 },
    { month: 'Apr', ProductA: 30, ProductB: 30, ProductC: 40 },
    { month: 'May', ProductA: 30, ProductB: 50, ProductC: 20 }
];

// App Usage Data
export const appUsageData = {
    usage: {
        percentage: 90,
        label: 'Usage',
        color: '#1B59F8',
        background: 'linear-gradient(135deg, #E8F4FD 0%, #D1E9FC 100%)',
        border: '#E1ECFD'
    },
    growth: {
        percentage: 12,
        label: 'Growth',
        color: 'green',
        background: 'linear-gradient(135deg, #F0FDF5 0%, #E8F9EE 100%)',
        border: '#E8F9EE'
    }
};

// Average Conversion Data
export const averageConversionData = {
    mainConversion: {
        title: 'Avg. Conversion of Inventory Transfer',
        percentage: 90,
        growth: 12,
        color: '#1B59F8'
    },
    conversionRates: [
        {
            title: 'Avg. ITR conversion rate',
            value: 22,
            unit: 'Mins',
            color: '#1B59F8'
        },
        {
            title: 'Avg. IT conversion rate',
            value: 1,
            unit: 'hrs',
            color: '#1B59F8'
        }
    ]
};

// Chart Color Scheme
export const chartColors = {
    primary: '#1B59F8',
    secondary: '#7EA6F8',
    tertiary: '#E1ECFD',
    success: '#28A745',
    background: '#F8F9FA',
    border: '#E1E7EC',
    text: '#4D4D4D',
    textSecondary: '#909090'
};
