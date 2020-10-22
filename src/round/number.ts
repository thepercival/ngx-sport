import { Competition } from '../competition';
import { Competitor } from '../competitor';
import { Game } from '../game';
import { Place } from '../place';
import { PlanningConfig } from '../planning/config';
import { Poule } from '../poule';
import { Round } from '../round';
import { Sport } from '../sport';
import { SportConfig } from '../sport/config';
import { SportScoreConfig } from '../sport/scoreconfig';
import { State } from '../state';
import { PouleStructure } from '../poule/structure';

export class RoundNumber {
    protected competition: Competition;
    protected number: number;
    protected previous: RoundNumber;
    protected next: RoundNumber;
    protected rounds: Round[] = [];
    protected planningConfig: PlanningConfig;
    protected sportScoreConfigs: SportScoreConfig[] = [];
    protected id: number;
    protected hasPlanning: boolean;

    constructor(competition: Competition, previous?: RoundNumber) {
        this.competition = competition;
        this.previous = previous;
        this.number = previous === undefined ? 1 : previous.getNumber() + 1;
        this.competition = competition;
        this.hasPlanning = false;
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

    createPouleStructure(): PouleStructure {
        const pouleStructure = new PouleStructure();
        this.getPoules().forEach(poule => pouleStructure.push(poule.getPlaces().length));
        pouleStructure.sort((a: number, b: number) => { return b - a; });
        return pouleStructure;
    }

    getGames(order?: number): Game[] {
        let games = [];
        this.getPoules().forEach(poule => {
            games = games.concat(poule.getGames());
        });
        if (order === Game.ORDER_BY_BATCH) {
            games.sort((g1: Game, g2: Game) => {
                if (g1.getBatchNr() === g2.getBatchNr() && g1.getField()) {
                    const retVal = g1.getField().getPriority() - g2.getField().getPriority();
                    return this.isFirst() ? retVal : -retVal;
                }
                return g1.getBatchNr() - g2.getBatchNr();
            });
        }
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

    hasBegun(): boolean {
        return this.getRounds().some(round => round.hasBegun());
    }

    getSportConfigs(): SportConfig[] {
        return this.getCompetition().getSportConfigs();
    }

    getSportConfig(sport: Sport): SportConfig {
        return this.getCompetition().getSportConfig(sport);
    }

    setPlanningConfig(config: PlanningConfig) {
        this.planningConfig = config;
    }

    getPlanningConfig(): PlanningConfig {
        return this.planningConfig;
    }

    getValidPlanningConfig(): PlanningConfig {
        if (this.planningConfig !== undefined) {
            return this.planningConfig;
        }
        return this.getPrevious().getValidPlanningConfig();
    }

    getSportScoreConfigs(): SportScoreConfig[] {
        return this.sportScoreConfigs;
    }

    getSportScoreConfig(sport: Sport): SportScoreConfig {
        return this.sportScoreConfigs.find(sportScoreConfigIt => sportScoreConfigIt.getSport() === sport);
    }

    setSportScoreConfig(sportScoreConfig: SportScoreConfig) {
        this.sportScoreConfigs.push(sportScoreConfig);
    }

    getValidSportScoreConfigs(): SportScoreConfig[] {
        return this.getSportConfigs().map(sportConfig => this.getValidSportScoreConfig(sportConfig.getSport()));
    }

    getValidSportScoreConfig(sport: Sport): SportScoreConfig {
        const sportScoreConfig = this.getSportScoreConfig(sport);
        if (sportScoreConfig !== undefined) {
            return sportScoreConfig;
        }
        return this.getPrevious().getValidSportScoreConfig(sport);
    }

    getFirstStartDateTime(): Date {
        const games = this.getGames(Game.ORDER_BY_BATCH);
        return games[0].getStartDateTime();
    }

    getLastStartDateTime(): Date {
        const games = this.getGames(Game.ORDER_BY_BATCH);
        return games[games.length - 1].getStartDateTime();
    }

    getHasPlanning(): boolean {
        return this.hasPlanning;
    }

    setHasPlanning(hasPlanning: boolean) {
        this.hasPlanning = hasPlanning;
    }
}
