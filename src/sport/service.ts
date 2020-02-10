export class SportService {
    constructor() {
    }

    getNrOfGamePlaces(nrOfGamePlaces: number, teamup: boolean, selfReferee: boolean): number {
        if (teamup) {
            nrOfGamePlaces *= 2;
        }
        if (selfReferee) {
            nrOfGamePlaces++;
        }
        return nrOfGamePlaces;
    }
}

