import { Competition } from '../competition';
import { Competitor } from '../competitor';
import { Game } from '../game';
import { Poule } from '../poule';
import { Place } from '../place';
import { Round } from '../round';
import { Sport } from '../sport';
import { SportConfig } from '../sport/config';
import { PlanningConfig,  } from '../planning/config';
import { SportConfigSupplier } from '../sport/config/supplier';
import { PlanningConfigSupplier } from '../planning/config/supplier';

import { State } from '../state';

export class RoundNumber implements PlanningConfigSupplier, SportConfigSupplier {
    protected competition: Competition;
    protected number: number;
    protected previous: RoundNumber;
    protected next: RoundNumber;
    protected rounds: Round[] = [];
    protected sportConfigs: SportConfig[] = [];
    protected planningConfig: PlanningConfig;
    protected id: number;

    constructor(competition: Competition, previous?: RoundNumber) {
        this.competition = competition;
        this.previous = previous;
        this.number = previous === undefined ? 1 : previous.getNumber() + 1;
        this.competition = competition;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    getNext(): RoundNumber {
        return this.next;
    }

    createNext(): RoundNumber {
        this.next = new RoundNumber(this.getCompetition(), this);
        return this.getNext();
    }

    removeNext() {
        this.next = undefined;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): RoundNumber {
        return this.previous;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getNumber(): number {
        return this.number;
    }

    getFirst() {
        if (this.getPrevious() !== undefined) {
            return this.getPrevious().getFirst();
        }
        return this;
    }

    isFirst() {
        return (this.getPrevious() === undefined);
    }

    getRounds() {
        return this.rounds;
    }

    getPoules(): Poule[] {
        let poules: Poule[] = [];
        this.getRounds().forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    getGames(): Game[] {
        let games = [];
        this.getPoules().forEach(poule => {
            games = games.concat(poule.getGames());
        });
        return games;
    }

    getNrOfGames(): number {
        let nrOfGames = 0;
        this.getRounds().forEach(round => {
            nrOfGames += round.getNrOfGames();
        });
        return nrOfGames;
    }

    getPlaces(): Place[] {
        let places = [];
        this.getPoules().forEach(poule => {
            places = places.concat(poule.getPlaces());
        });
        return places;
    }

    getNrOfPlaces(): number {
        let nrOfPlaces = 0;
        this.getPoules().forEach(poule => {
            nrOfPlaces += poule.getPlaces().length;
        });
        return nrOfPlaces;
    }

    getCompetitors(): Competitor[] {
        let competitors = [];
        this.getRounds().forEach( round => {
            competitors = competitors.concat(round.getCompetitors());
        });
        return competitors;
    }

    getNrOfCompetitors(): number {
        let nrOfPlaces = 0;
        this.getPoules().forEach(poule => {
            nrOfPlaces += poule.getPlaces().length;
        });
        return nrOfPlaces;
    }

    getARound(): Round {
        return this.getRounds()[0];
    }

    needsRanking(): boolean {
        return this.getRounds().some(round => round.needsRanking());
    }

    getState(): number {
        if (this.getRounds().every(round => round.getState() === State.Finished)) {
            return State.Finished;
        } else if (this.getRounds().some(round => round.getState() !== State.Created)) {
            return State.InProgress;
        }
        return State.Created;
    }

    isStarted(): boolean {
        return this.getState() > State.Created;
    }

    setPlanningConfig(config: PlanningConfig) {
        this.planningConfig = config;
    }

    getPlanningConfig(): PlanningConfig {
        if ( this.planningConfig !== undefined ) {
            return this.planningConfig;
        }
        return this.getPrevious().getPlanningConfig();
    }

    getSportConfigs(): SportConfig[] {
        return this.sportConfigs;
    }

    getSportConfig(sport?: Sport): SportConfig {
        const sportConfig = this.sportConfigs.find( sportConfig => sportConfig.getSport() === sport );
        if ( sportConfig !== undefined ) {
            return sportConfig;
        }
        return this.getPrevious().getSportConfig( sport );
    }

    setSportConfig(sportConfig: SportConfig) {
        this.sportConfigs.push( sportConfig );
    }
}
