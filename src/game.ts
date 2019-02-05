import { Field } from './field';
import { GamePoulePlace } from './game/pouleplace';
import { GameScore } from './game/score';
import { GameScoreHomeAway } from './game/score/homeaway';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { Referee } from './referee';
import { Round } from './round';
import { RoundNumberConfig } from './round/number/config';

export class Game {
    static readonly HOME = true;
    static readonly AWAY = false;
    static readonly STATE_CREATED = 1;
    static readonly STATE_INPLAY = 2;
    static readonly STATE_PLAYED = 4;
    static readonly ORDER_BYNUMBER = 1;
    static readonly ORDER_RESOURCEBATCH = 2;
    static readonly MOMENT_HALFTIME = 1;
    static readonly MOMENT_FULLTIME = 2;
    static readonly MOMENT_EXTRATIME = 4;
    static readonly MOMENT_PENALTIES = 8;

    protected id: number;
    protected poule: Poule;
    protected roundNumber: number;
    protected subNumber: number;
    protected resourceBatch: number;
    protected field: Field;
    protected referee: Referee;
    protected poulePlaceReferee: PoulePlace;
    protected startDateTime: Date;
    protected state: number;
    protected scoresMoment: number;
    protected scores: GameScore[] = [];
    protected poulePlaces: GamePoulePlace[] = [];

    constructor(
        poule: Poule,
        roundNumber: number,
        subNumber: number) {
        this.setPoule(poule);
        this.setRoundNumber(roundNumber);
        this.setSubNumber(subNumber);
        this.setState(Game.STATE_CREATED);
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

    private setPoule(poule: Poule) {
        poule.getGames().push(this);
        this.poule = poule;
    }

    getRoundNumber(): number {
        return this.roundNumber;
    }

    setRoundNumber(roundNumber: number): void {
        this.roundNumber = roundNumber;
    }

    getSubNumber(): number {
        return this.subNumber;
    }

    setSubNumber(subNumber: number): void {
        this.subNumber = subNumber;
    }

    getResourceBatch(): number {
        return this.resourceBatch;
    }

    setResourceBatch(resourceBatch: number): void {
        this.resourceBatch = resourceBatch;
    }

    getField(): Field {
        return this.field;
    }

    setField(field: Field): void {
        this.field = field;
    }

    getReferee(): Referee {
        return this.referee;
    }

    setPoulePlaceReferee(poulePlaceReferee: PoulePlace): void {
        this.poulePlaceReferee = poulePlaceReferee;
    }

    getPoulePlaceReferee(): PoulePlace {
        return this.poulePlaceReferee;
    }

    setReferee(referee: Referee): void {
        this.referee = referee;
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(startDateTime: Date): void {
        this.startDateTime = startDateTime;
    }

    getPoulePlaces(homeaway: boolean = undefined): GamePoulePlace[] {
        if (homeaway !== undefined) {
            return this.poulePlaces.filter(poulePlace => poulePlace.getHomeaway() === homeaway);
        }
        return this.poulePlaces;
    }

    setPoulePlaces(poulePlaces: GamePoulePlace[]): void {
        this.poulePlaces = poulePlaces;
    }

    isParticipating(poulePlace: PoulePlace, homeaway: boolean = undefined): boolean {
        return this.getPoulePlaces(homeaway).find(gamePoulePlace => gamePoulePlace.getPoulePlace() === poulePlace) !== undefined;
    }

    getHomeAway(poulePlace: PoulePlace): boolean {
        if (this.isParticipating(poulePlace, Game.HOME)) {
            return Game.HOME;
        } else if (this.isParticipating(poulePlace, Game.AWAY)) {
            return Game.AWAY;
        }
        return undefined;
    }

    getState(): number {
        return this.state;
    }

    setState(state: number): void {
        this.state = state;
    }

    getRound(): Round {
        return this.getPoule().getRound();
    }

    getScores(): GameScore[] {
        return this.scores;
    }

    getFinalScore(sub?: boolean): GameScoreHomeAway {
        if (this.getScores().length === 0) {
            return undefined;
        }
        if (sub === true) {
            return this.getSubScore();
        }
        let home = this.getScores()[0].getHome();
        let away = this.getScores()[0].getAway();
        const roundNumberConfig = this.getConfig();
        if (roundNumberConfig.getCalculateScore() !== roundNumberConfig.getInputScore()) {
            home = 0;
            away = 0;
            this.getScores().forEach(score => {
                if (score.getHome() > score.getAway()) {
                    home++;
                } else if (score.getHome() < score.getAway()) {
                    away++;
                }
            });
        }
        return new GameScoreHomeAway(home, away);
    }

    private getSubScore(): GameScoreHomeAway {
        let home = 0;
        let away = 0;
        this.getScores().forEach(score => {
            home += score.getHome();
            away += score.getAway();
        });
        return new GameScoreHomeAway(home, away);
    }

    getConfig(): RoundNumberConfig {
        return this.getRound().getNumber().getConfig();
    }

    /*getScoreConfig(): RoundConfigScore {
        let roundConfigScore = this.getRound().getConfig().getScore();
        while (roundConfigScore.isInput() === false && roundConfigScore.getParent() !== undefined) {
            roundConfigScore = roundConfigScore.getParent();
        }
        return roundConfigScore;
    }*/

    getScoresMoment(): number {
        return this.scoresMoment;
    }

    setScoresMoment(scoresMoment: number): void {
        this.scoresMoment = scoresMoment;
    }
}
