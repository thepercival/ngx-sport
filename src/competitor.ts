import { Competition } from './competition';
import { StartLocation } from './competitor/startLocation';
import { Identifiable } from './identifiable';

export class CompetitorBase extends Identifiable {
    protected present: boolean = false;
    protected info: string | undefined;

    constructor(protected competition: Competition, protected startLocation: StartLocation) {
        super();
    }

    getPresent(): boolean {
        return this.present;
    }

    setPresent(present: boolean): void {
        this.present = present;
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

    getStartLocation(): StartLocation {
        return this.startLocation;
    }
}


export interface Competitor {
    getId(): string | number;
    getName(): string;
    getPresent(): boolean;
    getInfo(): string | undefined;
    getCompetition(): Competition;
    getStartLocation(): StartLocation;
}
