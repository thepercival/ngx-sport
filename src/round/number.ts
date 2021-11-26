import { Competition } from '../competition';
import { Game } from '../game';
import { Place } from '../place';
import { PlanningConfig } from '../planning/config';
import { Poule } from '../poule';
import { State } from '../state';
import { PouleStructure } from '../poule/structure';
import { QualifyGroup, Round } from '../qualify/group';
import { GameAmountConfig } from '../planning/gameAmountConfig';
import { CompetitionSport } from '../competition/sport';
import { AgainstGame } from '../game/against';
import { TogetherGame } from '../game/together';
import { GameOrder } from '../game/order';
import { QualifyTarget } from '../qualify/target';

export class RoundNumber {
    protected id: number = 0;
    protected competition: Competition;
    protected number: number;
    protected next: RoundNumber | undefined;
    protected rounds: Round[] = [];
    protected planningConfig: PlanningConfig | undefined;
    protected gameAmountConfigs: GameAmountConfig[] = [];

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

    removeNext() {
        this.next = undefined;
    }

    detachFromPrevious(): void {
        if (this.previous === undefined) {
            return;
        }
        this.previous.removeNext();
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
        return previous.getValidPlanningConfig();
    }

    getGames(order: GameOrder): (AgainstGame | TogetherGame)[] {
        let games: (AgainstGame | TogetherGame)[] = [];
        this.getPoules().forEach(poule => {
            games = games.concat(poule.getGames());
        });



        const baseSort = (g1: TogetherGame | AgainstGame, g2: TogetherGame | AgainstGame): number => {
            // const qualifySort = (
            //     qualifyG1: QualifyGroup | undefined, qualifyG2: QualifyGroup | undefined): number => {
            //     if (qualifyG1 === undefined || qualifyG2 === undefined) {
            //         return 0;
            //     }
            //     if (qualifyG1.getTarget() === QualifyTarget.Winners && qualifyG2.getTarget() !== QualifyTarget.Winners) {
            //         return 1;
            //     }
            //     if (qualifyG2.getTarget() === QualifyTarget.Winners && qualifyG1.getTarget() !== QualifyTarget.Winners) {
            //         return -1;
            //     }
            //     if (qualifyG1.getTarget() === QualifyTarget.Winners) {
            //         return qualifyG2.getNumber() - qualifyG1.getNumber();
            //     }
            //     return qualifyG1.getNumber() - qualifyG2.getNumber();
            // };
            // const qualifySorted = qualifySort(g1.getRound().getParentQualifyGroup(), g2.getRound().getParentQualifyGroup());
            // if (qualifySorted !== 0) {
            //     return qualifySorted;
            // }
            const field1 = g1.getField();
            const field2 = g2.getField();
            if (field1 === undefined || field2 === undefined) {
                return 0;
            }
            const retVal = field1.getPriority() - field2.getPriority();
            return this.isFirst() ? retVal : -retVal;
        };

        if (order === GameOrder.ByBatch) {
            games.sort((g1: AgainstGame | TogetherGame, g2: AgainstGame | TogetherGame) => {
                if (g1.getBatchNr() === g2.getBatchNr()) {
                    return baseSort(g1, g2);
                }
                return g1.getBatchNr() - g2.getBatchNr();
            });
        } else {
            if (order === GameOrder.ByDate) {
                games.sort((g1: AgainstGame | TogetherGame, g2: AgainstGame | TogetherGame) => {
                    const date1 = g1.getStartDateTime()?.getTime() ?? 0;
                    const date2 = g2.getStartDateTime()?.getTime() ?? 0;
                    if (date1 === date2) {
                        return baseSort(g1, g2);
                    }
                    return date1 - date2;
                });
            }
        }
        return games;
    }

    allPoulesHaveGames(): boolean {
        return this.getRounds().every((round: Round) => {
            return round.getPoules().every((poule: Poule) => {
                return poule.getNrOfGames() > 0;
            });
        });
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

    getFirstStartDateTime(): Date {
        const games = this.getGames(GameOrder.ByDate);
        return games[0].getStartDateTime();
    }

    getLastStartDateTime(): Date {
        const games = this.getGames(GameOrder.ByDate);
        return games[games.length - 1].getStartDateTime();
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
