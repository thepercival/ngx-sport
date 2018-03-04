import { Competition } from './competition';


export class Field {
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 2;

    protected id: number;
    protected competition: Competition;
    protected number: number;
    protected name: string;

    // constructor
    constructor(competition: Competition, number: number) {
        this.setCompetition(competition);
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    protected setCompetition(competition: Competition): void {
        this.competition = competition;
        this.competition.getFields().push(this);
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }
}
