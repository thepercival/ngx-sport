export class Period {
    constructor(
        protected startDateTime: Date,
        protected endDateTime: Date) {
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    getEndDateTime(): Date {
        return this.endDateTime;
    }

    isIn(dateOrPeriod?: Date | Period): boolean {
        if (dateOrPeriod === undefined) {
            dateOrPeriod = new Date();
        }
        if (dateOrPeriod instanceof Date) {
            return dateOrPeriod.getTime() >= this.startDateTime.getTime() && dateOrPeriod.getTime() <= this.endDateTime.getTime();
        }
        return dateOrPeriod.getStartDateTime().getTime() >= this.startDateTime.getTime()
            && dateOrPeriod.getEndDateTime().getTime() <= this.endDateTime.getTime();
    }

    overlaps(period: Period): boolean {
        return (period.getEndDateTime() > this.getStartDateTime() && period.getStartDateTime() < this.getEndDateTime());
    }
}
