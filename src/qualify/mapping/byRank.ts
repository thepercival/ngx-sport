import { Place } from "../../place";
import { Poule } from "../../poule";
import { QualifyMapping } from "../mapping";

export class QualifyMappingByRank extends QualifyMapping {
    constructor(private fromPoule: Poule, private fromRank: number, toPlace: Place) {
        super(toPlace);
    }

    getFromPoule(): Poule {
        return this.fromPoule;
    }

    getFromRank(): number {
        return this.fromRank;
    }
}
