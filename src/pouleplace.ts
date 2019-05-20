import { Competitor } from './competitor';
import { Game } from './game';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { PoulePlaceLocation } from './pouleplace/location';
import { QualifyGroup } from './qualify/group';
import { QualifyRule } from './qualify/rule';
import { Round } from './round';

export class PoulePlace {
    protected id: number;
    protected poule: Poule;
    protected number: number;
    protected penaltyPoints = 0;
    protected name: string;
    protected competitor: Competitor;
    protected fromQualifyRule: QualifyRule;
    protected toQualifyRules: QualifyRule[] = [];
    protected horizontalPouleWinners: HorizontalPoule;
    protected horizontalPouleLosers: HorizontalPoule;

    constructor(poule: Poule, number?: number) {
        if (number === undefined) {
            number = poule.getPlaces().length + 1;
        }
        this.setNumber(number);
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
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getCompetitor(): Competitor {
        return this.competitor;
    }

    setCompetitor(competitor: Competitor): void {
        this.competitor = competitor;
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
        console.error("getToQualifyRule");
        return undefined;
        // return this.toQualifyRules.find(function (qualifyRuleIt) {
        //     return (qualifyRuleIt.getWinnersOrLosers() === winnersOrLosers);
        // });
    }

    getLocation(): PoulePlaceLocation {
        return new PoulePlaceLocation(this.getPoule().getNumber(), this.getNumber());
    }

    // setToQualifyRule(winnersOrLosers: number, qualifyRule: QualifyRule): void {
    //     const toQualifyRuleOld = this.getToQualifyRule(winnersOrLosers);
    //     if (toQualifyRuleOld !== undefined) {
    //         // toQualifyRuleOld.removeFromPoulePlace( this );
    //         const index = this.toQualifyRules.indexOf(toQualifyRuleOld);
    //         if (index > -1) {
    //             this.toQualifyRules.splice(index, 1);
    //         }
    //     }
    //     if (qualifyRule) {
    //         this.toQualifyRules.push(qualifyRule);
    //     }
    // }

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
            return gameIt.getPoulePlaces().find(gamePoulePlace => gamePoulePlace.getPoulePlace() === this) !== undefined;
        });
    }
}
