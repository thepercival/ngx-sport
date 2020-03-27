export class Season {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 9;

    protected id: string | number;
    protected name: string;
    protected startDateTime: Date;
    protected endDateTime: Date;

    constructor(name: string) {
        this.setName(name);
    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(startDateTime: Date): void {
        this.startDateTime = startDateTime;
    }

    getEndDateTime(): Date {
        return this.endDateTime;
    }

    setEndDateTime(endDateTime: Date): void {
        this.endDateTime = endDateTime;
    }
}
