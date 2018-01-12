/**
 * Created by coen on 27-2-17.
 */
import { Competitionseason } from './competitionseason';
import { Game } from './game';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { QualifyRule } from './qualifyrule';
import { RoundConfig } from './round/config';
import { RoundScoreConfig } from './round/scoreconfig';
import { Team } from './team';


export class Round {
    static readonly TYPE_POULE = 1;
    static readonly TYPE_KNOCKOUT = 2;
    static readonly TYPE_WINNER = 4;
    static readonly WINNERS = 1;
    static readonly LOSERS = 2;

    protected id: number;
    protected competitionseason: Competitionseason;
    protected parentRound: Round;
    protected childRounds: Round[] = [];
    protected winnersOrLosers: number;
    protected number: number;
    protected name: string;
    protected config: RoundConfig;
    protected scoreConfig: RoundScoreConfig;
    protected poules: Poule[] = [];
    protected fromQualifyRules: QualifyRule[] = [];
    protected toQualifyRules: QualifyRule[] = [];

    // constructor
    constructor(competitionseason: Competitionseason, parentRound: Round, winnersOrLosers: number) {
        this.setCompetitionseason(competitionseason);
        this.winnersOrLosers = winnersOrLosers;
        this.setParentRound(parentRound);
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

    getCompetitionseason(): Competitionseason {
        return this.competitionseason;
    }

    protected setCompetitionseason(competitionseason: Competitionseason): void {
        this.competitionseason = competitionseason;
    }

    getParentRound(): Round {
        return this.parentRound;
    }

    protected setParentRound(round: Round) {
        this.parentRound = round;
        this.number = this.parentRound !== undefined ? (this.parentRound.getNumber() + 1) : 1;
        if (this.parentRound !== undefined) {
            const childRounds = this.parentRound.getChildRounds();
            if (childRounds.length === 1 && this.getWinnersOrLosers() === Round.WINNERS) {
                childRounds.unshift(this);
            } else {
                childRounds.push(this);
            }
        }
    }

    isAncestorOf(aParentRound: Round) {
        if (this.getParentRound() === undefined) {
            return false;
        }
        if (this.getParentRound() === aParentRound) {
            return true;
        }
        return this.getParentRound().isAncestorOf(aParentRound);
    }

    getNumber(): number {
        return this.number;
    }

    getChildRounds(): Round[] {
        return this.childRounds;
    }

    getChildRound(winnersOrLosers: number): Round {
        return this.childRounds.find(roundIt => roundIt.getWinnersOrLosers() === winnersOrLosers);
    }

    getRootRound() {
        if (this.getParentRound() !== undefined) {
            return this.getParentRound().getRootRound();
        }
        return this;
    }

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getConfig(): RoundConfig {
        return this.config;
    }

    setConfig(config: RoundConfig) {
        this.config = config;
    }

    getScoreConfig(): RoundScoreConfig {
        return this.scoreConfig;
    }

    setScoreConfig(scoreConfig: RoundScoreConfig) {
        this.scoreConfig = scoreConfig;
    }

    getInputScoreConfig() {
        let scoreConfig = this.getScoreConfigs().pop();
        while (scoreConfig.getChild()) {
            if (scoreConfig.getMaximum() !== 0) {
                break;
            }
            scoreConfig = scoreConfig.getChild();
        }
        return scoreConfig;
    }

    getScoreConfigs(): RoundScoreConfig[] {
        const scoreConfigs: RoundScoreConfig[] = [];

        let scoreConfig = this.getScoreConfig();
        while (scoreConfig !== undefined) {
            scoreConfigs.push(scoreConfig);
            scoreConfig = scoreConfig.getParent();
        }
        return scoreConfigs;
    }

    getPoules(): Poule[] {
        return this.poules;
    }

    getPoulePlaces(orderedByPlace: boolean = false): PoulePlace[] {
        const poulePlaces: PoulePlace[] = [];
        for (const poule of this.getPoules()) {
            for (const place of poule.getPlaces()) {
                poulePlaces.push(place);
            }
        }
        if (orderedByPlace === true) {
            return poulePlaces.sort((poulePlaceA, poulePlaceB) => {
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
        return poulePlaces;
    }

    getPoulePlacesPerNumber(winnersOrLosers: number): PoulePlace[][] {
        const poulePlacesPerNumber = [];

        const poulePlacesOrderedByPlace = this.getPoulePlaces(true);
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

    getGames(): Game[] {
        const games = [];
        this.getPoules().forEach(poule => {
            poule.getGames().forEach(game => games.push(game));
        });
        return games;
    }

    getGamesByNumber(): Game[] {
        return this.getGames().sort((g1, g2) => {
            if (g1.getRoundNumber() === g2.getRoundNumber()) {
                if (g1.getSubNumber() === g2.getSubNumber()) {
                    return g1.getPoule().getNumber() - g2.getPoule().getNumber();
                }
                return g1.getSubNumber() - g2.getSubNumber();
            }
            return g1.getRoundNumber() - g2.getRoundNumber();
        });
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

    getOpposing() {
        if (this.getParentRound() === undefined) {
            return undefined;
        }
        return this.getParentRound().getChildRound(Round.getOpposing(this.getWinnersOrLosers()));
    }

    // getActiveQualifyRuleMul() {
    //     return ( ( this.getToQualifyRules() % this.getPoules().length ) === 0 );
    // }

    // isFromQualifyingAllSingle(): boolean{
    //     const lastFromQualifyRule = this.fromQualifyRules[this.fromQualifyRules.length - 1];
    //     return lastFromQualifyRule !== undefined && lastFromQualifyRule.isMultiple()  {
    //         return true;
    //     }
    // }
}
