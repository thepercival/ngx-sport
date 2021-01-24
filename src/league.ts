import { Association } from './association';
import { Identifiable } from './identifiable';

export class League extends Identifiable {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;
    static readonly MAX_LENGTH_SPORT = 30;

    protected abbreviation: string | undefined;

    constructor(protected association: Association, protected name: string) {
        super();
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getAbbreviation(): string | undefined {
        return this.abbreviation;
    }

    setAbbreviation(abbreviation: string | undefined): void {
        this.abbreviation = abbreviation;
    }

    getAssociation(): Association {
        return this.association;
    }
}
