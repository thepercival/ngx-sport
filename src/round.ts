import { Competition } from './competition';
import { Competitor } from './competitor';
import { Game } from './game';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { PoulePlaceLocation } from './pouleplace/location';
import { QualifyRule } from './qualify/rule';
import { RoundNumber } from './round/number';

export class Round {
    static readonly WINNERS = 1;
    static readonly LOSERS = 2;

    static readonly ORDER_NUMBER_POULE = 1;
    static readonly ORDER_POULE_NUMBER = 2;

    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

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
        this.qualifyOrder = (parentRound !== undefined) ? parentRound.getQualifyOrder() : Round.QUALIFYORDER_CROSS;
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

    getRoot() {
        if (!this.isRoot()) {
            return this.getParent().getRoot();
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

    hasCustomQualifyOrder(): boolean {
        return !(this.getQualifyOrder() === Round.QUALIFYORDER_CROSS || this.getQualifyOrder() === Round.QUALIFYORDER_RANK);
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
        if (this.isRoot()) {
            return [];
        }
        const path = this.getParent().getPath();
        path.push(this.getWinnersOrLosers());
        return path;
    }

    getPoulePlaces(order?: number, reversed: boolean = false): PoulePlace[] {
        const poulePlaces: PoulePlace[] = [];
        for (const poule of this.getPoules()) {
            for (const place of poule.getPlaces()) {
                poulePlaces.push(place);
            }
        }
        if (order === Round.ORDER_NUMBER_POULE || order === 4) {
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
        if (order === Round.ORDER_POULE_NUMBER || order === 5) {
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
        if (reversed === true) {
            poulePlaces.reverse();
        }
        return poulePlaces;
    }

    /**
     * winnerslosers = Round.WINNERS
     *  [ A1 B1 C1 ]
     *  [ A2 B2 C2 ]
     *  [ A3 B3 C3 ]
     * winnerslosers = Round.LOSERS
     *  [ C3 B3 A3 ]
     *  [ C2 B2 A2 ]
     *  [ C1 B1 A1 ]
     *
     * @param winnersOrLosers
     *
     **/
    getPoulePlacesPerNumber(winnersOrLosers: number): PoulePlace[][] {
        const poulePlacesPerNumber = [];

        const poulePlacesOrderedByPlace = this.getPoulePlaces(Round.ORDER_NUMBER_POULE);
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

    getPoulePlace(poulePlaceLocation: PoulePlaceLocation): PoulePlace {
        return this.getPoule(poulePlaceLocation.getPouleNr()).getPlace(poulePlaceLocation.getPlaceNr());
    }

    getCompetitors(): Competitor[] {
        let competitors: Competitor[] = [];
        for (const poule of this.getPoules()) {
            competitors = competitors.concat(poule.getCompetitors());
        }
        return competitors;
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

    getNrOfPlaces(): number {
        let nrOfPlaces = 0;
        this.getPoules().forEach(poule => nrOfPlaces += poule.getPlaces().length);
        return nrOfPlaces;
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
        if (this.isRoot() === undefined) {
            return undefined;
        }
        return this.getParent().getChildRound(Round.getOpposing(this.getWinnersOrLosers()));
    }
}
