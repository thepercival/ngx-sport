import { Field } from './field';
import { Place } from './place';
import { Poule } from './poule';
import { Referee } from './referee';
import { CompetitionSport } from './competition/sport';
import { ScoreConfig } from './score/config';
import { Round } from './qualify/group';
import { Identifiable } from './identifiable';
import { AgainstGamePlace } from './game/place/against';
import { TogetherGamePlace } from './game/place/together';
import { Competition } from './competition';
import { PlanningConfig } from './planning/config';
import { GamePlace } from './game/place';
import { GameState } from './game/state';
import { StartLocationMap } from './competitor/startLocation/map';

export abstract class Game extends Identifiable {
    protected field: Field | undefined;
    protected referee: Referee | undefined;
    protected refereePlace: Place | undefined;
    protected state: GameState;
    protected places: (AgainstGamePlace | TogetherGamePlace)[] = [];

    constructor(protected poule: Poule, protected batchNr: number, protected startDateTime: Date, protected competitionSport: CompetitionSport) {
        super();
        this.state = GameState.Created;
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

    setField(field: Field | undefined): void {
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

    getStartDateTime(): Date {
        return this.startDateTime;
    }

    setStartDateTime(startDateTime: Date): void {
        this.startDateTime = startDateTime;
    }

    getState(): GameState {
        return this.state;
    }

    setState(state: GameState): void {
        this.state = state;
    }

    getRound(): Round {
        return this.getPoule().getRound();
    }

    getCompetition(): Competition {
        return this.getCompetitionSport().getCompetition();
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getScoreConfig(): ScoreConfig {
        return this.getRound().getValidScoreConfig(this.competitionSport);
    }

    getPlanningConfig(): PlanningConfig {
        return this.getRound().getNumber().getValidPlanningConfig();
    }

    getPlaces(): (AgainstGamePlace | TogetherGamePlace)[] {
        return this.places;
    }

    public hasCompetitor(startLocationMap: StartLocationMap): boolean {
        return this.getPlaces().some((gamePlace: GamePlace): boolean => {
            const startLocation = gamePlace.getPlace().getStartLocation();
            if (startLocation === undefined) {
                return false;
            }
            return startLocationMap.getCompetitor(startLocation) !== undefined;
        });
    }
}
