/**
 * Created by coen on 26-2-17.
 */
import { Association } from './association';

export class Team {
    static readonly MIN_LENGTH_NAME = 3;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;

    protected id: number;
    protected name: string;
    protected abbreviation: string;
    protected association: Association;

    // constructor
    constructor(association: Association, name: string) {
        this.setName(name);
        this.setAssociation(association);
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

    getAssociation(): Association {
        return this.association;
    }

    protected setAssociation(association: Association): void {
        if (association.getTeamByName(this.getName()) !== undefined) {
            throw new Error('de teamnaam bestaat al binnen de bond');
        }
        this.association = association;
        this.association.getTeams().push(this);
    }
}
