import { StartLocation } from './competitor/startLocation';
import { PlaceLocation } from './place/location';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { Round } from './qualify/group';
import { QualifyTarget } from './qualify/target';
import { StructureLocation } from './structure/location';

export class Place extends PlaceLocation {
    protected id: number = 0;
    protected structureNumber: number = 0;
    protected extraPoints = 0;
    protected qualifiedPlace: Place | undefined;

    constructor(protected poule: Poule, number?: number) {
        super(poule.getNumber(), number === undefined ? poule.getPlaces().length + 1 : number);
        this.poule.getPlaces().push(this);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getPoule(): Poule {
        return this.poule;
    }

    getRound(): Round {
        return this.getPoule().getRound();
    }

    getRoundNodeName(): string {
        return this.getRound().getPathNode().pathToString();
    }

    getStructureLocation(): StructureLocation {
        return new StructureLocation(
            this.poule.getRound().getCategory().getNumber(),
            this.poule.getRound().getPathNode(),
            new PlaceLocation(this.pouleNr, this.placeNr)
        );
    }

    private getHorizontalNumber(qualifyTarget: QualifyTarget): number {
        if (qualifyTarget === QualifyTarget.Winners) {
            return this.getPlaceNr();
        }
        return this.getPoule().getPlaces().length + 1 - this.getPlaceNr();
    }

    getHorizontalPoule(qualifyTarget: QualifyTarget): HorizontalPoule {
        return this.getRound().getHorizontalPoule(qualifyTarget, this.getHorizontalNumber(qualifyTarget));
    }

    getExtraPoints(): number {
        return this.extraPoints;
    }

    setExtraPoints(extraPoints: number) {
        this.extraPoints = extraPoints;
    }

    getQualifiedPlace(): Place | undefined {
        return this.qualifiedPlace;
    }

    setQualifiedPlace(place: Place | undefined): void {
        this.qualifiedPlace = place;
    }

    getStartLocation(): StartLocation | undefined {
        if (this.qualifiedPlace !== undefined) {
            return this.qualifiedPlace.getStartLocation();
        }
        if (this.getRound().isRoot()) {
            return new StartLocation(this.getRound().getCategory().getNumber(), this.getPouleNr(), this.getPlaceNr());
        }
        return undefined;
    }
}
