import { BalancedPouleStructure } from "../poule/structure/balanced";
import { BalancedPouleStructureCreator } from "../poule/structure/balancedCreator";
import { VoetbalRange } from "../range";

export class PlaceRanges {
    public static readonly MinNrOfPlacesPerPoule = 2;
    private placesPerPouleSmall: VoetbalRange;
    private placesPerRoundSmall: VoetbalRange;
    private nrOfPlacesSmallLargeBorder: number;
    private placesPerPouleLarge: VoetbalRange | undefined;
    private placesPerRoundLarge: VoetbalRange | undefined;
    // private minNrOfPlacesPerPoule: number;
    // private minNrOfPlacesPerRound: number;

    constructor(
        minNrOfPlacesPerPoule: number,
        maxNrOfPlacesPerPouleSmall: number,
        maxNrOfPlacesPerPouleLarge: number | undefined,
        minNrOfPlacesPerRound: number,
        maxNrOfPlacesPerRoundSmall: number,
        maxNrOfPlacesPerRoundLarge: number | undefined
    ) {
        this.placesPerPouleSmall = this.initRange(minNrOfPlacesPerPoule, maxNrOfPlacesPerPouleSmall);
        this.placesPerRoundSmall = this.initRange(minNrOfPlacesPerRound, maxNrOfPlacesPerRoundSmall);
        this.nrOfPlacesSmallLargeBorder = maxNrOfPlacesPerRoundSmall;
        if (maxNrOfPlacesPerPouleLarge !== undefined) {
            this.placesPerPouleLarge = this.initRange(minNrOfPlacesPerPoule, maxNrOfPlacesPerPouleLarge);
            if (maxNrOfPlacesPerRoundLarge !== undefined) {
                this.placesPerRoundLarge = this.initRange(minNrOfPlacesPerRound, maxNrOfPlacesPerRoundLarge);
            }
        }
    }

    protected initRange(min: number, max: number): VoetbalRange {
        return { min: min, max: max >= min ? max : min };
    }

    getPlacesPerPouleSmall(): VoetbalRange {
        return this.placesPerPouleSmall;
    }

    validateStructure(structure: BalancedPouleStructure) {
        return this.validate(structure.getNrOfPlaces(), structure.getNrOfPoules());
    }

    validate(nrOfPlaces: number, nrOfPoules: number) {

        const placesPerRound = this.getValidPlacesPerRound(nrOfPlaces);
        if (placesPerRound === undefined || nrOfPlaces < placesPerRound.min || nrOfPlaces > placesPerRound.max) {
            throw new Error('het aantal deelnemers per ronde is kleiner dan het minimum of groter dan het maximum');
        }

        const creator = new BalancedPouleStructureCreator()
        const pouleStructure = creator.create(nrOfPlaces, nrOfPoules);
        const smallest = pouleStructure.getSmallestPoule();
        const biggest = pouleStructure.getBiggestPoule();

        const placesPerPoule = this.getValidPlacesPerPoule(nrOfPlaces);
        if (placesPerPoule === undefined || smallest < placesPerPoule.min || biggest > placesPerPoule.max) {
            throw new Error('het aantal deelnemers per poule is kleiner dan het minimum of groter dan het maximum');
        }
    }

    protected getValidPlacesPerRound(nrOfPlaces: number): VoetbalRange | undefined {
        if (nrOfPlaces <= this.nrOfPlacesSmallLargeBorder) {
            return this.placesPerRoundSmall;
        }
        return this.placesPerRoundLarge;
    }

    protected getValidPlacesPerPoule(nrOfPlaces: number): VoetbalRange | undefined {
        if (nrOfPlaces <= this.nrOfPlacesSmallLargeBorder) {
            return this.placesPerPouleSmall;
        }
        return this.placesPerPouleLarge;
    }
}