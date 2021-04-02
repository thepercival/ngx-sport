import { Competition } from '../competition';
import { Game } from '../game';
import { Place } from '../place';
import { PlanningConfig } from '../planning/config';
import { Poule } from '../poule';
import { State } from '../state';
import { PouleStructure } from '../poule/structure';
import { Round } from '../qualify/group';
import { GameAmountConfig } from '../planning/gameAmountConfig';
import { CompetitionSport } from '../competition/sport';
import { AgainstGame } from '../game/against';
import { TogetherGame } from '../game/together';

export class RoundNumber {
    protected id: number = 0;
    protected competition: Competition;
    protected number: number;
    protected next: RoundNumber | undefined;
    protected rounds: Round[] = [];
    protected planningConfig: PlanningConfig | undefined;
    protected gameAmountConfigs: GameAmountConfig[] = [];

    protected hasPlanning: boolean = false;;

    constructor(competition: Competition, protected previous?: RoundNumber) {
        this.competition = competition;
        this.number = this.previous === undefined ? 1 : this.previous.getNumber() + 1;
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

    getNext(): RoundNumber | undefined {
        return this.next;
    }

    createNext(): RoundNumber {
        this.next = new RoundNumber(this.getCompetition(), this);
        return this.next;
    }

    detachFromNext() {
        this.next = undefined;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): RoundNumber | undefined {
        return this.previous;
    }

    detachFromPrevious(): void {
        this.previous = undefined;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getNumber(): number {
        return this.number;
    }

    getFirst(): RoundNumber {
        const previous = this.getPrevious();
        return previous ? previous.getFirst() : this;
    }

    isFirst(): boolean {
        return (this.getPrevious() === undefined);
    }

    getRounds(): Round[] {
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

    getValidPlanningConfig(): PlanningConfig {
        const planningConfig = this.getPlanningConfig();
        if (planningConfig !== undefined) {
            return planningConfig;
        }
        const previous = this.getPrevious();
        if (!previous) {
            throw Error('het 1ste rondenummer moet gezet zijn');
        }
        const previousPlanningConfig = previous.getPlanningConfig();
        if (!previousPlanningConfig) {
            throw Error('het vorige rondenummer moet planning-config hebben');
        }
        return previousPlanningConfig;
    }

    getGames(order?: number): (AgainstGame | TogetherGame)[] {
        let games: (AgainstGame | TogetherGame)[] = [];
        this.getPoules().forEach(poule => {
            games = games.concat(poule.getGames());
        });
        if (order === Game.Order_By_Batch) {
            games.sort((g1: AgainstGame | TogetherGame, g2: AgainstGame | TogetherGame) => {
                if (g1.getBatchNr() === g2.getBatchNr()) {
                    const field1 = g1.getField();
                    const field2 = g2.getField();
                    if (field1 && field2) {
                        const retVal = field1.getPriority() - field2.getPriority();
                        return this.isFirst() ? retVal : -retVal;
                    }
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
        let places: Place[] = [];
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

    getCompetitionSports(): CompetitionSport[] {
        return this.getCompetition().getSports();
    }

    setPlanningConfig(config: PlanningConfig | undefined) {
        this.planningConfig = config;
    }

    getPlanningConfig(): PlanningConfig | undefined {
        return this.planningConfig;
    }

    getGameAmountConfigs(): GameAmountConfig[] {
        return this.gameAmountConfigs;
    }

    getGameAmountConfig(competitionSport: CompetitionSport): GameAmountConfig | undefined {
        return this.gameAmountConfigs.find(gameAmountConfigIt => gameAmountConfigIt.getCompetitionSport() === competitionSport);
    }

    setGameAmountConfig(gameAmountConfig: GameAmountConfig) {
        this.gameAmountConfigs.push(gameAmountConfig);
    }

    getValidGameAmountConfigs(): GameAmountConfig[] {
        return this.getCompetitionSports().map(competitionSport => this.getValidGameAmountConfig(competitionSport));
    }

    getValidGameAmountConfig(competitionSport: CompetitionSport): GameAmountConfig {
        const gameAmountConfig = this.getGameAmountConfig(competitionSport);
        if (gameAmountConfig !== undefined) {
            return gameAmountConfig;
        }
        const previous = this.getPrevious();
        if (!previous) {
            throw Error('het 1ste rondenummer moet gezet zijn');
        }
        return previous.getValidGameAmountConfig(competitionSport);
    }

    getFirstStartDateTime(): Date | undefined {
        const games = this.getGames(Game.Order_By_Batch);
        return games[0].getStartDateTime();
    }

    getLastStartDateTime(): Date | undefined {
        const games = this.getGames(Game.Order_By_Batch);
        return games[games.length - 1].getStartDateTime();
    }

    getHasPlanning(): boolean {
        return this.hasPlanning;
    }

    setHasPlanning(hasPlanning: boolean) {
        this.hasPlanning = hasPlanning;
    }

    detach() {
        const next = this.getNext();
        if (next !== undefined) {
            next.detach();
            this.detachFromNext();
        }
        this.detachFromPrevious();
    }
}
