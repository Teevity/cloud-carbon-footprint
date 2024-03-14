import dayjs, { Dayjs } from "dayjs";


export class SplitedDateRange {
    constructor(
        public startDate: Date,
        public endDate: Date
    ) {}

    public static splitDateRange(startDate: Date, endDate: Date, range: SplitedDateRange.RANGE): SplitedDateRange[] {
        const dayjsStartDate = dayjs(startDate);
        const dayjsEndDate = dayjs(endDate);
        const result: SplitedDateRange[] = [];
        let currentDate = dayjsStartDate.startOf('day');

        switch (range) {
            case SplitedDateRange.RANGE.DAY:
                while (currentDate.isBefore(dayjsEndDate, 'day')) {
                    result.push(new SplitedDateRange(currentDate.toDate(), currentDate.add(1, 'day').toDate()));
                    currentDate = currentDate.add(1, 'day');
                }
                break;
            case SplitedDateRange.RANGE.WEEK:
                while (currentDate.isBefore(dayjsEndDate, 'week')) {
                    result.push(new SplitedDateRange(currentDate.toDate(), currentDate.add(1, 'week').toDate()));
                    currentDate = currentDate.add(1, 'week');
                }
                break;
            case SplitedDateRange.RANGE.MONTH:
                while (currentDate.isBefore(dayjsEndDate, 'month')) {
                    result.push(new SplitedDateRange(currentDate.toDate(), currentDate.add(1, 'month').toDate()));
                    currentDate = currentDate.add(1, 'month');
                }
                break;
            case SplitedDateRange.RANGE.YEAR:
                while (currentDate.isBefore(dayjsEndDate, 'year')) {
                    result.push(new SplitedDateRange(currentDate.toDate(), currentDate.add(1, 'year').toDate()));
                    currentDate = currentDate.add(1, 'year');
                }
                break;
        }

        return result;
    }
}

export namespace SplitedDateRange {
    export enum RANGE {
        DAY,
        WEEK,
        MONTH,
        YEAR
    }
}



