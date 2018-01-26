import { Competitionseason } from './competitionseason';

export class Referee {
    static readonly MIN_LENGTH_INITIALS = 1;
    static readonly MAX_LENGTH_INITIALS = 3;
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 15;
    static readonly MAX_LENGTH_INFO = 200;

    protected id: number;
    protected competitionseason: Competitionseason;
    protected initials: string;
    protected name: string;
    protected info: string;

    constructor(competitionseason: Competitionseason, initials: string) {
        this.setCompetitionseason(competitionseason);
        this.setInitials(initials);
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

    getInitials(): string {
        return this.initials;
    }

    setInitials(initials: string): void {
        this.initials = initials;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getInfo(): string {
        return this.info;
    }

    setInfo(info: string): void {
        this.info = info;
    }
}
