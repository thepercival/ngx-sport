import { Place } from "../../place";
import { QualifyMapping } from "../mapping";

export class QualifyMappingByRank extends QualifyMapping {
    constructor(private fromRank: number, toPlace: Place) {
        super(toPlace);
    }

    getFromRank(): number {
        return this.fromRank;
    }
}
