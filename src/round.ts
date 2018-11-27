import { Competition } from './competition';
import { Game } from './game';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { QualifyRule } from './qualify/rule';
import { RoundNumber } from './round/number';
import { Team } from './team';

/**
 * Created by coen on 27-2-17.
 */

export class Round {
    static readonly TYPE_POULE = 1;
    static readonly TYPE_KNOCKOUT = 2;
    static readonly TYPE_WINNER = 4;
    static readonly WINNERS = 1;
    static readonly LOSERS = 2;

    static readonly ORDER_HORIZONTAL = 1;
    static readonly ORDER_VERTICAL = 2;
    static readonly ORDER_CUSTOM = 3;

    protected id: number;
    protected number: RoundNumber;
    protected parentRound: Round;
    protected childRounds: Round[] = [];
    protected winnersOrLosers: number;
    protected qualifyOrder: number;
    protected name: string;
    protected poules: Poule[] = [];
    protected fromQualifyRules: QualifyRule[] = [];
    protected toQualifyRules: QualifyRule[] = [];

    constructor(roundNumber: RoundNumber, parentRound: Round, winnersOrLosers: number) {
        this.number = roundNumber;
        this.winnersOrLosers = winnersOrLosers;
        this.setParentRound(parentRound);
        this.qualifyOrder = (parentRound !== undefined) ? parentRound.getQualifyOrder() : Round.ORDER_HORIZONTAL;
        this.number.getRounds().push(this);
    }

    static getWinnersLosersDescription(winnersOrLosers: number, multiple: boolean = false): string {
        const description = winnersOrLosers === Round.WINNERS ? 'winnaar' : (winnersOrLosers === Round.LOSERS ? 'verliezer' : '');
        return ((multiple && (description !== '')) ? description + 's' : description);
    }

    static getOpposing(winnersOrLosers: number) {
        return winnersOrLosers === Round.WINNERS ? Round.LOSERS : Round.WINNERS;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getCompetition(): Competition {
        return this.getNumber().getCompetition();
    }

    getParent(): Round {
        return this.parentRound;
    }

    protected setParentRound(round: Round) {
        this.parentRound = round;
        if (this.parentRound !== undefined) {
            const childRounds = this.parentRound.getChildRounds();
            if (childRounds.length === 1 && this.getWinnersOrLosers() === Round.WINNERS) {
                childRounds.unshift(this);
            } else {
                childRounds.push(this);
            }
        }
    }

    // isAncestorOf(aParentRound: Round) {
    //     if (this.getParent() === undefined) {
    //         return false;
    //     }
    //     if (this.getParent() === aParentRound) {
    //         return true;
    //     }
    //     return this.getParent().isAncestorOf(aParentRound);
    // }

    getNumber(): RoundNumber {
        return this.number;
    }

    getNumberAsValue(): number {
        return this.number.getNumber();
    }

    getChildRounds(): Round[] {
        return this.childRounds;
    }

    getChildRound(winnersOrLosers: number): Round {
        return this.childRounds.find(roundIt => roundIt.getWinnersOrLosers() === winnersOrLosers);
    }

    isRoot() {
        return (this.getParent() === undefined);
    }

    getRootRound() {
        if (this.getParent() !== undefined) {
            return this.getParent().getRootRound();
        }
        return this;
    }

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    }

    getQualifyOrder(): number {
        return this.qualifyOrder;
    }

    setQualifyOrder(qualifyOrder: number) {
        this.qualifyOrder = qualifyOrder;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getPoules(): Poule[] {
        return this.poules;
    }

    getPoule(number: number): Poule {
        return this.getPoules().find(poule => poule.getNumber() === number);
    }

    getPath(): number[] {
        const path = this.isRoot() ? [] : this.getParent().getPath();
        path.push(this.getWinnersOrLosers());
        return path;
    }

    getPoulePlaces(order: number = 0): PoulePlace[] {
        const poulePlaces: PoulePlace[] = [];
        for (const poule of this.getPoules()) {
            for (const place of poule.getPlaces()) {
                poulePlaces.push(place);
            }
        }

        if (order === Round.ORDER_HORIZONTAL || order === 4) {
            poulePlaces.sort((poulePlaceA, poulePlaceB) => {
                if (poulePlaceA.getNumber() > poulePlaceB.getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getNumber() < poulePlaceB.getNumber()) {
                    return -1;
                }
                if (poulePlaceA.getPoule().getNumber() > poulePlaceB.getPoule().getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getPoule().getNumber() < poulePlaceB.getPoule().getNumber()) {
                    return -1;
                }
                return 0;
            });
        }
        if (order === Round.ORDER_VERTICAL || order === 5) {
            poulePlaces.sort((poulePlaceA, poulePlaceB) => {
                if (poulePlaceA.getPoule().getNumber() > poulePlaceB.getPoule().getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getPoule().getNumber() < poulePlaceB.getPoule().getNumber()) {
                    return -1;
                }
                if (poulePlaceA.getNumber() > poulePlaceB.getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getNumber() < poulePlaceB.getNumber()) {
                    return -1;
                }
                return 0;
            });
        }
        return poulePlaces;
    }

    getPoulePlacesPer(winnersOrLosers: number, qualifyOrder: number, poulePlaceOrder: number): PoulePlace[][] {
        const poulePlacesPerNumber = this.getPoulePlacesPerNumber(winnersOrLosers);
        if (qualifyOrder !== Round.ORDER_VERTICAL || this.getParent() === undefined) {
            return poulePlacesPerNumber;
        }
        if (poulePlaceOrder === Round.ORDER_VERTICAL) {
            return this.getPoulePlacesPerPoule();
        }
        // vertical qualify rule
        const poulePlacesPerQualifyRule = [];
        this.getFromQualifyRules().forEach(fromQualifyRule => {
            const poulePlaces = fromQualifyRule.getToPoulePlaces().slice();
            poulePlaces.sort((poulePlaceA, poulePlaceB) => {
                if (poulePlaceA.getNumber() > poulePlaceB.getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getNumber() < poulePlaceB.getNumber()) {
                    return -1;
                }
                if (poulePlaceA.getPoule().getNumber() > poulePlaceB.getPoule().getNumber()) {
                    return 1;
                }
                if (poulePlaceA.getPoule().getNumber() < poulePlaceB.getPoule().getNumber()) {
                    return -1;
                }
                return 0;
            });
            let placeNumber = 0;
            while (poulePlaces.length > 0) {
                const tmp = poulePlaces.splice(0, poulePlacesPerNumber[placeNumber++].length);
                poulePlacesPerQualifyRule.push(tmp);
            }
        });
        return poulePlacesPerQualifyRule;
    }

    getPoulePlacesPerPoule(): PoulePlace[][] {
        const poulePlacesPerPoule = [];
        this.getPoules().forEach(poule => poulePlacesPerPoule.push(poule.getPlaces()));
        return poulePlacesPerPoule;
    }

    getPoulePlacesPerNumber(winnersOrLosers: number): PoulePlace[][] {
        const poulePlacesPerNumber = [];

        const poulePlacesOrderedByPlace = this.getPoulePlaces(Round.ORDER_HORIZONTAL);
        if (winnersOrLosers === Round.LOSERS) {
            poulePlacesOrderedByPlace.reverse();
        }

        poulePlacesOrderedByPlace.forEach(function (placeIt) {
            let poulePlaces = this.find(function (poulePlacesIt) {
                return poulePlacesIt.some(function (poulePlaceIt) {
                    let poulePlaceNrIt = poulePlaceIt.getNumber();
                    if (winnersOrLosers === Round.LOSERS) {
                        poulePlaceNrIt = (poulePlaceIt.getPoule().getPlaces().length + 1) - poulePlaceNrIt;
                    }
                    let placeNrIt = placeIt.getNumber();
                    if (winnersOrLosers === Round.LOSERS) {
                        placeNrIt = (placeIt.getPoule().getPlaces().length + 1) - placeNrIt;
                    }
                    return poulePlaceNrIt === placeNrIt;
                });
            });

            if (poulePlaces === undefined) {
                poulePlaces = [];
                this.push(poulePlaces);
            }
            poulePlaces.push(placeIt);
        }, poulePlacesPerNumber);

        return poulePlacesPerNumber;
    }

    getTeams(): Team[] {
        const teams: Team[] = [];
        for (const poule of this.getPoules()) {
            const pouleTeams = poule.getTeams();
            for (const pouleTeam of pouleTeams) {
                teams.push(pouleTeam);
            }
        }
        return teams;
    }

    hasGames(): boolean {
        return this.getPoules().some(poule => poule.hasGames());
    }

    getGames(): Game[] {
        const games = [];
        this.getPoules().forEach(poule => {
            poule.getGames().forEach(game => games.push(game));
        });
        return games;
    }

    getGamesWithState(state: number): Game[] {
        const games = [];
        this.getPoules().forEach(poule => {
            poule.getGamesWithState(state).forEach(game => games.push(game));
        });
        return games;
    }

    getState(): number {
        if (this.getPoules().every(poule => poule.getState() === Game.STATE_PLAYED)) {
            return Game.STATE_PLAYED;
        } else if (this.getPoules().some(poule => poule.getState() !== Game.STATE_CREATED)) {
            return Game.STATE_INPLAY;
        }
        return Game.STATE_CREATED;
    }

    isStarted(): boolean {
        return this.getState() > Game.STATE_CREATED;
    }

    getType(): number {
        if (this.getPoules().length === 1 && this.getPoulePlaces().length < 2) {
            return Round.TYPE_WINNER;
        }
        return (this.needsRanking() ? Round.TYPE_POULE : Round.TYPE_KNOCKOUT);
    }

    needsRanking(): boolean {
        return this.getPoules().some(function (pouleIt) {
            return pouleIt.needsRanking();
        });
    }

    movePoulePlace(poulePlace: PoulePlace, toPoule: Poule, toNumber?: number) {
        const removed = poulePlace.getPoule().removePlace(poulePlace);
        if (!removed) {
            return false;
        }

        // zet poule and position
        poulePlace.setNumber(toPoule.getPlaces().length + 1);
        toPoule.addPlace(poulePlace);

        if (toNumber === undefined) {
            return true;
        }
        return toPoule.movePlace(poulePlace, toNumber);
    }

    getFromQualifyRules(): QualifyRule[] {
        return this.fromQualifyRules;
    }

    getToQualifyRules(winnersOrLosers?: number): QualifyRule[] {
        if (winnersOrLosers !== undefined) {
            return this.toQualifyRules.filter(toQualifyRule => toQualifyRule.getToRound().getWinnersOrLosers() === winnersOrLosers);
        }
        return this.toQualifyRules;
    }

    getNrOfPlacesChildRounds(): number {
        let nrOfPlacesChildRounds = 0;
        this.getChildRounds().forEach(function (childRound) {
            nrOfPlacesChildRounds += this.getNrOfPlacesChildRound(childRound.getWinnersOrLosers());
        }, this);
        return nrOfPlacesChildRounds;
    }

    getNrOfPlacesChildRound(winnersOrLosers: number): number {
        const childRound = this.getChildRound(winnersOrLosers);
        return childRound !== undefined ? childRound.getPoulePlaces().length : 0;
    }

    getNrOfRoundsToGo() {
        let nrOfRoundsToGoWinners = 0;
        {
            const childRoundWinners = this.getChildRound(Round.WINNERS);
            if (childRoundWinners !== undefined) {
                nrOfRoundsToGoWinners = childRoundWinners.getNrOfRoundsToGo() + 1;
            }
        }
        let nrOfRoundsToGoLosers = 0;
        {
            const childRoundLosers = this.getChildRound(Round.LOSERS);
            if (childRoundLosers !== undefined) {
                nrOfRoundsToGoLosers = childRoundLosers.getNrOfRoundsToGo() + 1;
            }
        }
        if (nrOfRoundsToGoWinners > nrOfRoundsToGoLosers) {
            return nrOfRoundsToGoWinners;
        }
        return nrOfRoundsToGoLosers;
    }

    getOpposing() {
        if (this.getParent() === undefined) {
            return undefined;
        }
        return this.getParent().getChildRound(Round.getOpposing(this.getWinnersOrLosers()));
    }
}
