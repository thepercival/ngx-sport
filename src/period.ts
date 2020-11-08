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

    isIn(date: Date): boolean {
        return date.getTime() >= this.startDateTime.getTime() && date.getTime() <= this.endDateTime.getTime();
    }
}
