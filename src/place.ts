import { PlaceLocation } from './place/location';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { QualifyGroup, Round } from './qualify/group';
import { QualifyTarget } from './qualify/target';

export class Place extends PlaceLocation {
    protected id: number = 0;
    protected structureNumber: number = 0;
    protected penaltyPoints = 0;
    protected horizontalPouleWinners: HorizontalPoule | undefined;
    protected horizontalPouleLosers: HorizontalPoule | undefined;
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

    getNumber(): number {
        return this.placeNr;
    }

    getPenaltyPoints(): number {
        return this.penaltyPoints;
    }

    setPenaltyPoints(penaltyPoints: number) {
        this.penaltyPoints = penaltyPoints;
    }

    getHorizontalPoule(qualifyTarget: QualifyTarget): HorizontalPoule {
        const horPoule = (qualifyTarget === QualifyTarget.Winners) ? this.horizontalPouleWinners : this.horizontalPouleLosers;
        if (horPoule === undefined) {
            throw Error('horizontal poule is not set');
        }
        return horPoule;
    }

    setHorizontalPoule(qualifyTarget: QualifyTarget, horizontalPoule: HorizontalPoule | undefined) {
        if (qualifyTarget === QualifyTarget.Winners) {
            this.horizontalPouleWinners = horizontalPoule;
        } else {
            this.horizontalPouleLosers = horizontalPoule;
        }
        if (horizontalPoule !== undefined) {
            horizontalPoule.getPlaces().push(this);
        }
    }

    getQualifiedPlace(): Place | undefined {
        return this.qualifiedPlace;
    }

    setQualifiedPlace(place: Place | undefined): void {
        this.qualifiedPlace = place;
    }

    getStartLocation(): PlaceLocation {
        if (this.qualifiedPlace === undefined) {
            return this;
        }
        return this.qualifiedPlace.getStartLocation();
    }
}
