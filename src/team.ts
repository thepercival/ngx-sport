import { Association } from './association';
import { Identifiable } from './identifiable';

export class Team extends Identifiable {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;
    static readonly MAX_LENGTH_INFO = 200;
    static readonly MAX_LENGTH_IMAGEURL = 150;

    protected abbreviation: string | undefined;

    constructor(protected association: Association, protected name: string) {
        super();
        this.association.getTeams().push(this);
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

