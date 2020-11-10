import { Period } from "./period";

export class Season extends Period {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 9;

    protected id: string | number = 0;

    constructor(protected name: string, startDateTime: Date, endDateTime: Date) {
        super(startDateTime, endDateTime);
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

    setStartDateTime(startDateTime: Date): void {
        this.startDateTime = startDateTime;
    }

    setEndDateTime(endDateTime: Date): void {
        this.endDateTime = endDateTime;
    }
}
