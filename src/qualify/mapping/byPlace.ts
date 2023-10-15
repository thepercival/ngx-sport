import { Place } from "../../place";
import { Poule } from "../../poule";
import { QualifyMapping } from "../mapping";

export class QualifyMappingByPlace extends QualifyMapping {
    constructor(private fromPlace: Place, toPlace: Place) {
        super(toPlace);
    }

    getFromPlace(): Place {
        return this.fromPlace;
    }

    getFromPoule(): Poule {
        return this.fromPlace.getPoule();
    }
}
