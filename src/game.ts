import { Field } from './field';
import { GamePlace } from './game/place';
import { GameScore } from './game/score';
import { Place } from './place';
import { Poule } from './poule';
import { Referee } from './referee';
import { SportConfig } from './sport/config';
import { State } from './state';
import { SportScoreConfig } from './sport/scoreconfig';
import { Round } from './qualify/group';

export class Game {
    static readonly RESULT_HOME = 1;
    static readonly RESULT_DRAW = 2;
    static readonly RESULT_AWAY = 3;
    static readonly HOME = true;
    static readonly AWAY = false;
    static readonly ORDER_BY_BATCH = 1;
    static readonly PHASE_REGULARTIME = 1;
    static readonly PHASE_EXTRATIME = 2;
    static readonly PHASE_PENALTIES = 4;

    protected id: number = 0;
    protected field: Field | undefined;
    protected referee: Referee | undefined;
    protected refereePlace: Place | undefined;
    protected startDateTime: Date | undefined;
    protected state: number;
    protected scores: GameScore[] = [];
    protected places: GamePlace[] = [];

    constructor(protected poule: Poule, protected batchNr: number) {
        poule.getGames().push(this);
        this.state = State.Created;
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

    getBatchNr(): number {
        return this.batchNr;
    }

    getField(): Field | undefined {
        return this.field;
    }

    setField(field: Field): void {
        this.field = field;
    }

    getReferee(): Referee | undefined {
        return this.referee;
    }

    setRefereePlace(refereePlace: Place | undefined): void {
        this.refereePlace = refereePlace;
    }

    getRefereePlace(): Place | undefined {
        return this.refereePlace;
    }

    setReferee(referee: Referee | undefined): void {
        this.referee = referee;
    }

    getStartDateTime(): Date | undefined {
        return this.startDateTime;
    }

    setStartDateTime(startDateTime: Date | undefined): void {
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

    getHomeAway(place: Place): boolean | undefined {
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
        if (this.field) {
            return this.field.getSportConfig();
        }
        return this.getRound().getNumber().getCompetition().getFirstSportConfig();
    }

    getSportScoreConfig(): SportScoreConfig | undefined {
        const roundNumber = this.getRound().getNumber();
        if (this.field) {
            return roundNumber.getValidSportScoreConfig(this.field.getSportConfig().getSport());
        }
        return roundNumber.getValidSportScoreConfigs()[0];
    }
}
