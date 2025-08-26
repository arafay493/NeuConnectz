export const formatDate = (dateString: string, format: 'date' | 'datetime' | 'readable' = 'readable') => {
    const date = new Date(dateString);

    switch (format) {
        case 'date':
            return date.toISOString().split('T')[0];
        case 'datetime':
            return date.toISOString().replace('T', ' ').split('.')[0];
        case 'readable':
        default:
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
    }
};