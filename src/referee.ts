import { Competition } from './competition';

export class Referee {
    static readonly MIN_LENGTH_INITIALS = 1;
    static readonly MAX_LENGTH_INITIALS = 3;
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 15;
    static readonly MAX_LENGTH_INFO = 200;

    protected id: number;
    protected competition: Competition;
    protected initials: string;
    protected name: string;
    protected info: string;

    constructor(competition: Competition, initials: string) {
        this.setCompetition(competition);
        this.setInitials(initials);
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
        this.competition.getReferees().push(this);
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
