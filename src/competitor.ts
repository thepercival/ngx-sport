import { Competition } from './competition';
import { StartLocation } from './competitor/startLocation';
import { Identifiable } from './identifiable';

export class CompetitorBase extends Identifiable {
    protected present: boolean = false;
    protected publicInfo: string | undefined;
    protected privateInfo: string | undefined;

    constructor(protected competition: Competition, protected startLocation: StartLocation) {
        super();
    }

    getPresent(): boolean {
        return this.present;
    }

    setPresent(present: boolean): void {
        this.present = present;
    }

    getPublicInfo(): string | undefined {
        return this.publicInfo;
    }

    setPublicInfo(info: string): void {
        this.publicInfo = info;
    }

    getPrivateInfo(): string | undefined {
        return this.privateInfo;
    }

    setPrivateInfo(info: string): void {
        this.privateInfo = info;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getStartLocation(): StartLocation {
        return this.startLocation;
    }
}


export interface Competitor {
    getId(): string | number;
    getName(): string;
    getPresent(): boolean;
    getPublicInfo(): string | undefined;
    getPrivateInfo(): string | undefined;
    getCompetition(): Competition;
    getStartLocation(): StartLocation;
}
