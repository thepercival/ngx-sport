import { Field } from './field';
import { Place } from './place';
import { Poule } from './poule';
import { Referee } from './referee';
import { CompetitionSport } from './competition/sport';
import { State } from './state';
import { ScoreConfig } from './score/config';
import { Round } from './qualify/group';
import { Identifiable } from './identifiable';
import { AgainstGamePlace } from './game/place/against';
import { TogetherGamePlace } from './game/place/together';
import { Competition } from './competition';
import { PlanningConfig } from './planning/config';

export abstract class Game extends Identifiable {
    static readonly Order_By_Batch = 1;
    static readonly Phase_RegularTime = 1;
    static readonly Phase_ExtraTime = 2;
    static readonly Phase_Penalties = 4;

    protected field: Field | undefined;
    protected referee: Referee | undefined;
    protected refereePlace: Place | undefined;
    protected startDateTime: Date | undefined;
    protected state: number;
    protected places: (AgainstGamePlace | TogetherGamePlace)[] = [];

    constructor(protected poule: Poule, protected batchNr: number, protected competitionSport: CompetitionSport) {
        super();
        this.state = State.Created;
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

    getStartDateTime(): Date | undefined {
        return this.startDateTime;
    }

    setStartDateTime(startDateTime: Date | undefined): void {
        this.startDateTime = startDateTime;
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
}
