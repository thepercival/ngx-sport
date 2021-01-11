import { CompetitionSport } from './competition/sport';
import { Identifiable } from './identifiable';

export class Field extends Identifiable {
    static readonly MIN_LENGTH_NAME = 1;
    static readonly MAX_LENGTH_NAME = 3;

    protected name: string | undefined;

    constructor(protected competitionSport: CompetitionSport, protected priority: number) {
        super();
        this.competitionSport.getFields().push(this);
        this.setPriority(priority);
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getPriority(): number {
        return this.priority;
    }

    setPriority(priority: number): void {
        this.priority = priority;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string | undefined): void {
        this.name = name;
    }
}
