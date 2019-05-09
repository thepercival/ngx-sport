import { Competition } from './competition';
import { Competitor } from './competitor';
import { Game } from './game';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { PoulePlaceLocation } from './pouleplace/location';
import { QualifyPoule } from './qualify/poule';
import { QualifyRule } from './qualify/rule';
import { RoundNumber } from './round/number';

export class Round {
    static readonly WINNERS = 1;
    static readonly DROPOUTS = 2;
    static readonly NEUTRAL = 2;
    static readonly LOSERS = 3;

    static readonly ORDER_NUMBER_POULE = 1;
    static readonly ORDER_POULE_NUMBER = 2;

    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

    protected id: number;
    protected number: RoundNumber;
    protected parentQualifyPoule: QualifyPoule;
    protected name: string;
    protected poules: Poule[] = [];
    protected qualifyPoules: QualifyPoule[] = [];
    protected fromQualifyRules: QualifyRule[] = [];
    protected toQualifyRules: QualifyRule[] = [];
    protected value: number;

    constructor(roundNumber: RoundNumber, parentQualifyPoule?: QualifyPoule) {
        this.number = roundNumber;
        this.setParentQualifyPoule(parentQualifyPoule);
        this.number.getRounds().push(this);
        //this.setValue();
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
        return this.getParentQualifyPoule() ? this.getParentQualifyPoule().getRound() : undefined;
    }

    getParentQualifyPoule(): QualifyPoule {
        return this.parentQualifyPoule;
    }

    protected setParentQualifyPoule(parentQualifyPoule: QualifyPoule) {
        this.parentQualifyPoule = parentQualifyPoule;
    }

    getNumber(): RoundNumber {
        return this.number;
    }

    getNumberAsValue(): number {
        return this.number.getNumber();
    }

    // getValue(): number {
    //     return this.value;
    // }

    // protected setValue(): void {
    //     const parentQualifyPoule = this.getParentQualifyPoule(); 
    //     if (parentQualifyPoule === undefined) {
    //         this.value = 0;
    //     } else {
    //         this.value = parentQualifyPoule.getRound().getValue() +  
    //     }
    //     this.value = value;
    // }

    getQualifyPoules(winnersOrLosers?: number): QualifyPoule[] {
        if (winnersOrLosers === undefined) {
            return this.qualifyPoules;
        }
        return this.qualifyPoules.filter(qualifyPoule => qualifyPoule.getWinnersOrLosers() === winnersOrLosers);
    }

    getQualifyPoule(winnersOrLosers: number, qualifyPouleNumber: number): QualifyPoule {
        return this.qualifyPoules.find(qualifyPoule => {
            return qualifyPoule.getWinnersOrLosers() === winnersOrLosers
                && qualifyPoule.getNumber() === qualifyPouleNumber;
        });
    }

    getChildren(): Round[] {
        return this.getQualifyPoules().map(qualifyPoule => qualifyPoule.getChildRound());
    }

    getChild(winnersOrLosers: number, qualifyPouleNumber: number): Round {
        const qualifyPoule = this.getQualifyPoule(winnersOrLosers, qualifyPouleNumber);
        return qualifyPoule ? qualifyPoule.getChildRound() : undefined;
    }

    isRoot(): boolean {
        return this.getParent() === undefined;
    }

    // getRoot() {
    //     if (!this.isRoot()) {
    //         return this.getParent().getRoot();
    //     }
    //     return this;
    // }

    getWinnersOrLosers(): number {
        return this.getParentQualifyPoule() ? this.getParentQualifyPoule().getWinnersOrLosers() : Round.NEUTRAL;
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

    getNrOfCompetitors(): number {
        let nrOfCompetitors = 0;
        this.getPoules().forEach(poule => nrOfCompetitors += poule.getCompetitors().length);
        return nrOfCompetitors;
    }

    getGames(): Game[] {
        const games = [];
        this.getPoules().forEach(poule => {
            poule.getGames().forEach(game => games.push(game));
        });
        return games;
    }

    getNrOfGames(): number {
        let nrOfGames = 0;
        this.getPoules().forEach(poule => {
            nrOfGames += poule.getGames().length;
        });
        return nrOfGames;
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

    // @TODO REMOVE
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

    getNrOfPlacesChildren(winnersOrLosers?: number): number {
        let nrOfPlacesChildRounds = 0;
        this.getQualifyPoules(winnersOrLosers).forEach(qualifyPoule => {
            nrOfPlacesChildRounds += qualifyPoule.getChildRound().getNrOfPlaces();
        });
        return nrOfPlacesChildRounds;
    }

    // getOpposing() {
    //     if (this.isRoot() === undefined) {
    //         return undefined;
    //     }
    //     return this.getParent().getChild(Round.getOpposing(this.getWinnersOrLosers()));
    // }
}
