import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateTimeHelper {
    static getStartEndDateTime(
        dateTime: Date = new Date(),
        offSetDay = 0,
        endToday = true,
        timezone: string = dayjs.tz.guess(),
    ) {
        const startTime = dayjs(dateTime).tz(timezone).startOf('day').add(offSetDay, 'day');
        const endTime =
            endToday && offSetDay < 0
                ? dayjs(dateTime).tz(timezone).startOf('day').add(1, 'day')
                : startTime.add(1, 'day');

        return { startTime: startTime.toDate(), endTime: endTime.toDate() };
    }
}
