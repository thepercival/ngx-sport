import { Association } from './association';

export class Team {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;
    static readonly MAX_LENGTH_INFO = 200;
    static readonly MAX_LENGTH_IMAGEURL = 150;

    protected id: string | number;
    protected name: string;
    protected abbreviation: string;
    protected imageUrl: string;
    protected association: Association;

    constructor(association: Association, name: string) {
        this.setName(name);
        this.setAssociation(association);
    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
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

    getImageUrl(): string {
        return this.imageUrl;
    }

    setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }

    getAssociation(): Association {
        return this.association;
    }

    protected setAssociation(association: Association): void {
        this.association = association;
        this.association.getTeams().push(this);
    }
}

