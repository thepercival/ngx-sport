import { Association } from './association';

export class Team {
    static readonly MIN_LENGTH_NAME = 2;
    static readonly MAX_LENGTH_NAME = 30;
    static readonly MAX_LENGTH_ABBREVIATION = 7;
    static readonly MAX_LENGTH_INFO = 200;
    static readonly MAX_LENGTH_IMAGEURL = 150;

    protected id: string | number = 0;
    protected abbreviation: string | undefined;
    protected imageUrl: string | undefined;

    constructor(protected association: Association, protected name: string) {
        this.association.getTeams().push(this);
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

    getAbbreviation(): string | undefined {
        return this.abbreviation;
    }

    setAbbreviation(abbreviation: string | undefined): void {
        this.abbreviation = abbreviation;
    }

    getImageUrl(): string | undefined {
        return this.imageUrl;
    }

    setImageUrl(imageUrl: string): void {
        this.imageUrl = imageUrl;
    }

    getAssociation(): Association {
        return this.association;
    }
}

