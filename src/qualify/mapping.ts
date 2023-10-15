import { Place } from "../place";

export class QualifyMapping {
    constructor(private toPlace: Place) {

    }

    getToPlace(): Place {
        return this.toPlace;
    }
}