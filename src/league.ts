import { Association } from './association';
import { ImportableObject } from './external/object';

/**
 * Created by coen on 10-2-17.
 */
export class League implements ImportableObject {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;
    static readonly MAX_LENGTH_SPORT = 30;

    protected id: number;
    protected name: string;
    protected abbreviation: string;
    protected sport: string;
    protected association: Association;

    // constructor
    constructor(association: Association, name: string) {
        this.setAssociation(association);
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

    getAssociation(): Association {
        return this.association;
    }

    protected setAssociation(association: Association): void {
        // if (association.getTeamByName(this.getName()) !== undefined) {
        //     throw new Error('de teamnaam bestaat al binnen de bond');
        // }
        this.association = association;
        // this.association.getTeams().push(this);
    }
}
