import { Field } from './field';
import { GameScore } from './game/score';
import { Poule } from './poule';
import { PoulePlace } from './pouleplace';
import { Referee } from './referee';
import { Round } from './round';

/**
 * Created by coen on 20-3-17.
 */

export class Game {
    static readonly HOME = true;
    static readonly AWAY = false;
    static readonly STATE_CREATED = 1;
    static readonly STATE_INPLAY = 2;
    static readonly STATE_PLAYED = 4;
    static readonly ORDER_BYNUMBER = 1;
    static readonly ORDER_RESOURCEBATCH = 2;

    protected id: number;
    protected poule: Poule;
    protected roundNumber: number;
    protected subNumber: number;
    protected resourceBatch: number;
    protected field: Field;
    protected referee: Referee;
    protected homePoulePlace: PoulePlace;
    protected awayPoulePlace: PoulePlace;
    protected startDateTime: Date;
    protected state: number;
    protected scores: GameScore[] = [];

    // constructor
    constructor(
        poule: Poule,
        homePouleplace: PoulePlace,
        awayPouleplace: PoulePlace,
        roundNumber: number,
        subNumber: number) {
        if (homePouleplace === undefined) { console.log('home empty'); }
        this.setPoule(poule);
        this.setRoundNumber(roundNumber);
        this.setSubNumber(subNumber);
        this.setHomePoulePlace(homePouleplace);
        this.setAwayPoulePlace(awayPouleplace);
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

    setReferee(referee: Referee): void {
        this.referee = referee;
    }

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(startDateTime: Date): void {
        this.startDateTime = startDateTime;
    }

    getHomePoulePlace(): PoulePlace {
        return this.homePoulePlace;
    }

    setHomePoulePlace(homePoulePlace: PoulePlace): void {
        this.homePoulePlace = homePoulePlace;
    }

    getAwayPoulePlace(): PoulePlace {
        return this.awayPoulePlace;
    }

    setAwayPoulePlace(awayPoulePlace: PoulePlace): void {
        this.awayPoulePlace = awayPoulePlace;
    }

    getPoulePlace(homeAway: boolean): PoulePlace {
        return homeAway === Game.HOME ? this.getHomePoulePlace() : (homeAway === Game.AWAY ? this.getAwayPoulePlace() : undefined);
    }

    getHomeAway(poulePlace: PoulePlace): boolean {
        if (poulePlace === this.getHomePoulePlace()) {
            return Game.HOME;
        } else if (poulePlace === this.getAwayPoulePlace()) {
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

    getFinalScore(): GameScore {
        return this.getScores()[0];
    }
}
