import { Field } from './field';
import { GamePlace } from './game/place';
import { GameScore } from './game/score';
import { GameScoreHomeAway } from './game/score/homeaway';
import { Poule } from './poule';
import { Place } from './place';
import { Referee } from './referee';
import { Round } from './round';
import { SportConfig } from './sport/config';
import { State } from './state';

export class Game {
    static readonly WINNERS = 1;
    static readonly DRAW = 2;
    static readonly LOSERS = 3;
    static readonly HOME = true;
    static readonly AWAY = false;
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
    protected refereePlace: Place;
    protected startDateTime: Date;
    protected state: number;
    protected scoresMoment: number;
    protected scores: GameScore[] = [];
    protected places: GamePlace[] = [];

    constructor(
        poule: Poule,
        roundNumber: number,
        subNumber: number) {
        this.setPoule(poule);
        this.setRoundNumber(roundNumber);
        this.setSubNumber(subNumber);
        this.setState(State.Created);
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

    setRefereePlace(refereePlace: Place): void {
        this.refereePlace = refereePlace;
    }

    getRefereePlace(): Place {
        return this.refereePlace;
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

    getPlaces(homeaway?: boolean): GamePlace[] {
        if (homeaway !== undefined) {
            return this.places.filter(place => place.getHomeaway() === homeaway);
        }
        return this.places;
    }

    setPlaces(places: GamePlace[]): void {
        this.places = places;
    }

    isParticipating(place: Place, homeaway?: boolean): boolean {
        return this.getPlaces(homeaway).find(gamePlace => gamePlace.getPlace() === place) !== undefined;
    }

    getHomeAway(place: Place): boolean {
        if (this.isParticipating(place, Game.HOME)) {
            return Game.HOME;
        } else if (this.isParticipating(place, Game.AWAY)) {
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

    getSportConfig(): SportConfig {
        const field = this.getField();
        if ( field === undefined ) {
            return this.getRound().getNumber().getCompetition().getFirstSportConfig();
        }
        return this.getRound().getNumber().getCompetition().getSportConfig( field.getSport() );
    }

    getSportScoreConfig() {
        const field = this.getField();
        if ( field === undefined ) {
            return this.getRound().getNumber().getFirstSportScoreConfig();
        }
        return this.getRound().getNumber().getSportScoreConfig( field.getSport() );
    }

    getScoresMoment(): number {
        return this.scoresMoment;
    }

    setScoresMoment(scoresMoment: number): void {
        this.scoresMoment = scoresMoment;
    }
}
