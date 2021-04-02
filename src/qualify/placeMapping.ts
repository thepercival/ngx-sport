import { Place } from "../place";
import { Poule } from "../poule";

export class QualifyPlaceMapping {
    constructor(private fromPlace: Place, private toPlace: Place) {

    }

    getFromPlace(): Place {
        return this.fromPlace;
    }

    getFromPoule(): Poule {
        return this.fromPlace.getPoule();
    }

    getToPlace(): Place {
        return this.toPlace;
    }
}
