import { Competitionseason } from './competitionseason';

export class Referee {
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 15;

    protected id: number;
    protected competitionseason: Competitionseason;
    protected number: number;
    protected name: string;

    constructor(competitionseason: Competitionseason, number: number) {
        this.setCompetitionseason(competitionseason);
        this.setNumber(number);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getCompetitionseason(): Competitionseason {
        return this.competitionseason;
    }

    protected setCompetitionseason(competitionseason: Competitionseason): void {
        this.competitionseason = competitionseason;
        this.competitionseason.getReferees().push(this);
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
