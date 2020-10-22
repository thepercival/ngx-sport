import { Game } from './game';
import { PlaceLocation } from './place/location';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { QualifyGroup } from './qualify/group';
import { QualifyRule } from './qualify/rule';
import { Round } from './round';

export class Place extends PlaceLocation {
    protected id: number;
    protected poule: Poule;
    protected structureNumber: number;
    protected locationId: string;
    protected penaltyPoints = 0;
    protected name: string;
    protected fromQualifyRule: QualifyRule;
    protected toQualifyRules: QualifyRule[] = [];
    protected horizontalPouleWinners: HorizontalPoule;
    protected horizontalPouleLosers: HorizontalPoule;
    protected qualifiedPlace: Place;

    constructor(poule: Poule, number?: number) {
        super(poule.getNumber(), number === undefined ? poule.getPlaces().length + 1 : number);
        poule.addPlace(this);
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

    setPoule(poule: Poule) {
        this.poule = poule;
    }

    getRound(): Round {
        return this.getPoule().getRound();
    }

    getNumber(): number {
        return this.placeNr;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getPenaltyPoints(): number {
        return this.penaltyPoints;
    }

    setPenaltyPoints(penaltyPoints: number) {
        this.penaltyPoints = penaltyPoints;
    }

    getFromQualifyRule(): QualifyRule {
        return this.fromQualifyRule;
    }

    setFromQualifyRule(qualifyRule: QualifyRule): void {
        this.fromQualifyRule = qualifyRule;
    }

    getToQualifyRules(): QualifyRule[] {
        return this.toQualifyRules;
    }

    getToQualifyRule(winnersOrLosers: number): QualifyRule {
        return this.toQualifyRules.find(function (qualifyRuleIt) {
            return (qualifyRuleIt.getWinnersOrLosers() === winnersOrLosers);
        });
    }

    /**
     * within roundnumber
     */
    getLocationId(): string {
        if (this.locationId === undefined) {
            this.locationId = this.poule.getStructureNumber() + '.' + this.placeNr;
        }
        return this.locationId;
    }

    setToQualifyRule(winnersOrLosers: number, qualifyRule: QualifyRule): void {
        const toQualifyRuleOld = this.getToQualifyRule(winnersOrLosers);
        if (toQualifyRuleOld !== undefined) {
            // toQualifyRuleOld.removeFromPlace( this );
            const index = this.toQualifyRules.indexOf(toQualifyRuleOld);
            if (index > -1) {
                this.toQualifyRules.splice(index, 1);
            }
        }
        if (qualifyRule) {
            this.toQualifyRules.push(qualifyRule);
        }
    }

    getHorizontalPoule(winnersOrLosers: number): HorizontalPoule {
        return (winnersOrLosers === QualifyGroup.WINNERS) ? this.horizontalPouleWinners : this.horizontalPouleLosers;
    }

    setHorizontalPoule(winnersOrLosers: number, horizontalPoule: HorizontalPoule) {
        if (winnersOrLosers === QualifyGroup.WINNERS) {
            this.horizontalPouleWinners = horizontalPoule;
        } else {
            this.horizontalPouleLosers = horizontalPoule;
        }
        if (horizontalPoule !== undefined) {
            horizontalPoule.getPlaces().push(this);
        }
    }

    getGames(): Game[] {
        return this.getPoule().getGames().filter(gameIt => {
            return gameIt.getPlaces().find(gamePlace => gamePlace.getPlace() === this) !== undefined;
        });
    }

    getQualifiedPlace(): Place {
        return this.qualifiedPlace;
    }

    setQualifiedPlace(place?: Place): void {
        this.qualifiedPlace = place;
    }

    getStartLocation(): PlaceLocation {
        if (this.qualifiedPlace === undefined) {
            return this;
        }
        return this.qualifiedPlace.getStartLocation();
    }
}
