import { Field } from './field';
import { GamePlace } from './game/place';
import { GameScore } from './game/score';
import { Place } from './place';
import { Poule } from './poule';
import { Referee } from './referee';
import { Round } from './round';
import { SportConfig } from './sport/config';
import { State } from './state';

export class Game {
    static readonly RESULT_HOME = 1;
    static readonly RESULT_DRAW = 2;
    static readonly RESULT_AWAY = 3;
    static readonly HOME = true;
    static readonly AWAY = false;
    static readonly ORDER_BY_BATCH = 1;
    static readonly ORDER_BY_POULE = 2;
    static readonly PHASE_REGULARTIME = 1;
    static readonly PHASE_EXTRATIME = 2;
    static readonly PHASE_PENALTIES = 4;

    protected id: number;
    protected poule: Poule;
    protected roundNumber: number;
    protected subNumber: number;
    protected batchNr: number;
    protected field: Field;
    protected referee: Referee;
    protected refereePlace: Place;
    protected startDateTime: Date;
    protected state: number;
    protected scores: GameScore[] = [];
    protected places: GamePlace[] = [];

    constructor(
        poule: Poule,
        batchNr: number) {
        this.setPoule(poule);
        this.batchNr = batchNr;
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

    getBatchNr(): number {
        return this.batchNr;
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

    getFinalPhase(): number {
        if (this.scores.length === 0) {
            return 0;
        }
        return this.scores[this.scores.length - 1].getPhase();
    }

    getSportConfig(): SportConfig {
        return this.getRound().getNumber().getCompetition().getSportConfig(this.getField().getSport());
    }

    getSportScoreConfig() {
        return this.getRound().getNumber().getValidSportScoreConfig(this.getField().getSport());
    }
}
