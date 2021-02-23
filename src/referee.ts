import { Competition } from './competition';

export class Referee {
    static readonly MIN_LENGTH_INITIALS = 1;
    static readonly MAX_LENGTH_INITIALS = 3;
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_INFO = 200;

    protected id: number = 0;
    protected priority: number;
    protected name: string | undefined;
    protected emailaddress: string | undefined;
    protected info: string | undefined;

    constructor(protected competition: Competition, protected initials: string, priority?: number) {
        this.competition.getReferees().push(this);
        this.priority = priority ? priority : competition.getReferees().length;
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

    getPriority(): number {
        return this.priority;
    }

    setPriority(priority: number): void {
        this.priority = priority;
    }

    getInitials(): string {
        return this.initials;
    }

    setInitials(initials: string): void {
        this.initials = initials;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string | undefined): void {
        this.name = name;
    }

    getInfo(): string | undefined {
        return this.info;
    }

    setInfo(info: string | undefined): void {
        this.info = info;
    }

    getEmailaddress(): string | undefined {
        return this.emailaddress;
    }

    setEmailaddress(emailaddress: string | undefined): void {
        this.emailaddress = emailaddress;
    }
}
