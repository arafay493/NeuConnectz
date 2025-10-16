import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

export const getDateRange = (filterType: string) => {
    const now = dayjs();

    switch (filterType) {
        case 'week':
            return {
                startDate: now.startOf('isoWeek').format('YYYY-MM-DD'),
                endDate: now.endOf('isoWeek').format('YYYY-MM-DD'),
            };
        case 'month':
            return {
                startDate: now.startOf('month').format('YYYY-MM-DD'),
                endDate: now.endOf('month').format('YYYY-MM-DD'),
            };
        case 'quarter':
            return {
                startDate: now.startOf('quarter').format('YYYY-MM-DD'),
                endDate: now.endOf('quarter').format('YYYY-MM-DD'),
            };
        default:
            return {
                startDate: '',
                endDate: '',
            };
    }
};
