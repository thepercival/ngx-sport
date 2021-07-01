import { PlaceLocation } from './place/location';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { Round } from './qualify/group';
import { QualifyTarget } from './qualify/target';

export class Place extends PlaceLocation {
    protected id: number = 0;
    protected structureNumber: number = 0;
    protected penaltyPoints = 0;
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
        return this.getRound().getStructurePathNode().pathToString();
    }

    getStructureLocation(): string {
        return this.getPoule().getStructureLocation() + '.' + this.getPlaceNr();
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

    getPenaltyPoints(): number {
        return this.penaltyPoints;
    }

    setPenaltyPoints(penaltyPoints: number) {
        this.penaltyPoints = penaltyPoints;
    }

    getQualifiedPlace(): Place | undefined {
        return this.qualifiedPlace;
    }

    setQualifiedPlace(place: Place | undefined): void {
        this.qualifiedPlace = place;
    }

    getStartLocation(): PlaceLocation | undefined {
        if (this.qualifiedPlace === undefined) {
            if (this.getRound().isRoot()) {
                return this;
            }
            return undefined;
        }
        return this.qualifiedPlace.getStartLocation();
    }
}
