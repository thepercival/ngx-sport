import { Competition } from './competition';
import { PlaceLocation } from './place/location';

export class CompetitorBase extends PlaceLocation {
    protected id: string | number = 0;
    protected registered: boolean = false;
    protected info: string | undefined;

    constructor(protected competition: Competition, pouleNr: number, placeNr: number) {
        super(pouleNr, placeNr);
    }

    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }

    getRegistered(): boolean {
        return this.registered;
    }

    setRegistered(registered: boolean): void {
        this.registered = registered;
    }

    getInfo(): string | undefined {
        return this.info;
    }

    setInfo(info: string): void {
        this.info = info;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    setPouleNr(pouleNr: number) {
        this.pouleNr = pouleNr;
    }

    setPlaceNr(placeNr: number) {
        this.placeNr = placeNr;
    }
}


export interface Competitor extends PlaceLocation {
    getId(): string | number;
    getName(): string;
    getRegistered(): boolean;
    getInfo(): string | undefined;
    getCompetition(): Competition;
}
