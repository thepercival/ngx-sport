import { Game } from './game';
import { AgainstGame } from './game/against';
import { AgainstGamePlace } from './game/place/against';
import { TogetherGamePlace } from './game/place/together';
import { TogetherGame } from './game/together';
import { PlaceLocation } from './place/location';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { QualifyGroup, Round } from './qualify/group';
import { QualifyRule } from './qualify/rule';

export class Place extends PlaceLocation {
    protected id: number = 0;
    protected structureNumber: number = 0;
    protected penaltyPoints = 0;
    protected fromQualifyRule: QualifyRule | undefined;
    protected toQualifyRules: QualifyRule[] = [];
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

    getFromQualifyRule(): QualifyRule | undefined {
        return this.fromQualifyRule;
    }

    setFromQualifyRule(qualifyRule?: QualifyRule): void {
        this.fromQualifyRule = qualifyRule;
    }

    getToQualifyRules(): QualifyRule[] {
        return this.toQualifyRules;
    }

    getToQualifyRule(winnersOrLosers: number): QualifyRule | undefined {
        return this.toQualifyRules.find((qualifyRuleIt: QualifyRule) => {
            return (qualifyRuleIt.getWinnersOrLosers() === winnersOrLosers);
        });
    }

    /**
     * within roundnumber
     */
    getLocationId(): string {
        return this.poule.getStructureNumber() + '.' + this.placeNr;
    }

    setToQualifyRule(winnersOrLosers: number, qualifyRule: QualifyRule | undefined): void {
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

    getHorizontalPoule(winnersOrLosers: number): HorizontalPoule | undefined {
        return (winnersOrLosers === QualifyGroup.WINNERS) ? this.horizontalPouleWinners : this.horizontalPouleLosers;
    }

    setHorizontalPoule(winnersOrLosers: number, horizontalPoule: HorizontalPoule | undefined) {
        if (winnersOrLosers === QualifyGroup.WINNERS) {
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
