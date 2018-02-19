/**
 * Created by coen on 10-2-17.
 */
import { ImportableObject } from './external/object';

export class Competition implements ImportableObject {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;
    static readonly MAX_LENGTH_SPORT = 30;

    protected id: number;
    protected name: string;
    protected abbreviation: string;
    protected sport: string;

    // constructor
    constructor(name: string) {
        this.setName(name);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getAbbreviation(): string {
        return this.abbreviation;
    }

    setAbbreviation(abbreviation: string): void {
        this.abbreviation = abbreviation;
    }

    getSport(): string {
        return this.sport;
    }

    setSport(sport: string): void {
        this.sport = sport;
    }

    doX(): void {

    }
}
