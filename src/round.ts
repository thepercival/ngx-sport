import { Competition } from './competition';
import { Competitor } from './competitor';
import { Game } from './game';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { PoulePlaceLocation } from './pouleplace/location';
import { QualifyGroup } from './qualify/group';
import { RoundNumber } from './round/number';

export class Round {
    static readonly ORDER_NUMBER_POULE = 1;
    static readonly ORDER_POULE_NUMBER = 2;

    // there are some patterns here, cross, inside-outside and custom
    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

    protected id: number;
    protected number: RoundNumber;
    protected parentQualifyGroup: QualifyGroup;
    protected name: string;
    protected poules: Poule[] = [];
    protected losersQualifyGroups: QualifyGroup[] = [];
    protected winnersQualifyGroups: QualifyGroup[] = [];
    protected value: number;

    constructor(roundNumber: RoundNumber, parentQualifyGroup?: QualifyGroup) {
        this.number = roundNumber;
        this.setParentQualifyGroup(parentQualifyGroup);
        this.number.getRounds().push(this);
        //this.setValue();
    }

    // static getOpposing(winnersOrLosers: number) {
    //     return winnersOrLosers === Round.WINNERS ? QualifyGroup.LOSERS : QualifyGroup.WINNERS;
    // }

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
        return this.getParentQualifyGroup() ? this.getParentQualifyGroup().getRound() : undefined;
    }

    getParentQualifyGroup(): QualifyGroup {
        return this.parentQualifyGroup;
    }

    protected setParentQualifyGroup(parentQualifyGroup: QualifyGroup) {
        this.parentQualifyGroup = parentQualifyGroup;
    }

    getNumber(): RoundNumber {
        return this.number;
    }

    getNumberAsValue(): number {
        return this.number.getNumber();
    }

    getQualifyGroups(winnersOrLosers?: number): QualifyGroup[] {
        if (winnersOrLosers === undefined) {
            return this.winnersQualifyGroups.concat(this.losersQualifyGroups);
        }
        return (winnersOrLosers === QualifyGroup.WINNERS) ? this.winnersQualifyGroups : this.losersQualifyGroups;
    }

    getQualifyGroup(winnersOrLosers: number, qualifyGroupNumber: number): QualifyGroup {
        return this.getQualifyGroups(winnersOrLosers).find(qualifyGroup => qualifyGroup.getNumber() === qualifyGroupNumber);
    }

    getChildren(): Round[] {
        return this.getQualifyGroups().map(qualifyGroup => qualifyGroup.getChildRound());
    }

    getChild(winnersOrLosers: number, qualifyGroupNumber: number): Round {
        const qualifyGroup = this.getQualifyGroup(winnersOrLosers, qualifyGroupNumber);
        return qualifyGroup ? qualifyGroup.getChildRound() : undefined;
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

    // DEPRECATED , REMOVE QualifyGroup.NEUTRAL and this function
    getWinnersOrLosers(): number {
        return this.getParentQualifyGroup() ? this.getParentQualifyGroup().getWinnersOrLosers() : QualifyGroup.NEUTRAL;
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
     * winnerslosers = QualifyGroup.WINNERS
     *  [ A1 B1 C1 ]
     *  [ A2 B2 C2 ]
     *  [ A3 B3 C3 ]
     * winnerslosers = QualifyGroup.LOSERS
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
        if (winnersOrLosers === QualifyGroup.LOSERS) {
            poulePlacesOrderedByPlace.reverse();
        }

        poulePlacesOrderedByPlace.forEach(function (placeIt) {
            let poulePlaces = this.find(function (poulePlacesIt) {
                return poulePlacesIt.some(function (poulePlaceIt) {
                    let poulePlaceNrIt = poulePlaceIt.getNumber();
                    if (winnersOrLosers === QualifyGroup.LOSERS) {
                        poulePlaceNrIt = (poulePlaceIt.getPoule().getPlaces().length + 1) - poulePlaceNrIt;
                    }
                    let placeNrIt = placeIt.getNumber();
                    if (winnersOrLosers === QualifyGroup.LOSERS) {
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

    getNrOfPlaces(): number {
        let nrOfPlaces = 0;
        this.getPoules().forEach(poule => nrOfPlaces += poule.getPlaces().length);
        return nrOfPlaces;
    }

    getNrOfPlacesChildren(winnersOrLosers?: number): number {
        let nrOfPlacesChildRounds = 0;
        this.getQualifyGroups(winnersOrLosers).forEach(qualifyGroup => {
            nrOfPlacesChildRounds += qualifyGroup.getChildRound().getNrOfPlaces();
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
