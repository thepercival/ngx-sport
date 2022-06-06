import { Competition } from '../competition';
import { PlanningConfig } from '../planning/config';
import { Poule } from '../poule';
import { Round } from '../qualify/group';
import { GameAmountConfig } from '../planning/gameAmountConfig';
import { CompetitionSport } from '../competition/sport';
import { GameOrder } from '../game/order';
import { CategoryMap } from '../category/map';
import { StructureCell } from '../structure/cell';
import { PouleStructure } from '../poule/structure';
import { Category } from '../category';
import { GameGetter } from '../game/getter';

export class RoundNumber {
    protected id: number = 0;
    protected structureCells: StructureCell[] = [];
    protected number: number;
    protected next: RoundNumber | undefined;
    protected planningConfig: PlanningConfig | undefined;
    protected gameAmountConfigs: GameAmountConfig[] = [];

    constructor(private competition: Competition, protected previous: RoundNumber | undefined) {
        this.number = this.previous === undefined ? 1 : this.previous.getNumber() + 1;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getFirst(): RoundNumber {
        const previous = this.getPrevious();
        return previous ? previous.getFirst() : this;
    }

    isFirst(): boolean {
        return (this.getPrevious() === undefined);
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): RoundNumber | undefined {
        return this.previous;
    }

    detachFromPrevious(): void {
        if (this.previous === undefined) {
            return;
        }
        this.previous.removeNext();
        this.previous = undefined;
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

    removeNext() {
        this.next = undefined;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getNumber(): number {
        return this.number;
    }

    getStructureCells(categoryMap?: CategoryMap): StructureCell[] {
        if (categoryMap === undefined) {
            return this.structureCells;
        }
        return this.structureCells.filter((structureCell: StructureCell) => categoryMap.has(structureCell.getCategory().getNumber()));
    }

    getStructureCell(category: Category): StructureCell {
        const structureCell = this.getStructureCells().find((structureCell: StructureCell): boolean => {
            return structureCell.getCategory() === category;
        });
        if (structureCell === undefined) {
            throw new Error('de structuurcel kan niet gevonden worden');
        }
        return structureCell;
    }

    getRounds(categoryMap: CategoryMap | undefined): Round[] {
        let rounds: Round[] = [];
        this.getStructureCells(categoryMap).forEach((structureCell: StructureCell) => {
            rounds = rounds.concat(structureCell.getRounds());
        });
        return rounds;
    }

    getPoules(categoryMap: CategoryMap): Poule[] {
        let poules: Poule[] = [];
        this.getRounds(categoryMap).forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    createPouleStructure(): PouleStructure {
        const pouleStructure = new PouleStructure();
        this.getPoules(undefined).forEach(poule => pouleStructure.push(poule.getPlaces().length));
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

    hasBegun(): boolean {
        return this.getStructureCells().some(structureCell => structureCell.hasBegun());
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

    // SHOW BE GOTTEN FROM STORAGE IN FUTURE, @TODO CDK
    getFirstStartDateTime(): Date {
        const games = (new GameGetter()).getGames(GameOrder.ByDate, this);
        return games[0].getStartDateTime();
    }

    // SHOW BE GOTTEN FROM STORAGE IN FUTURE, @TODO CDK
    getLastStartDateTime(): Date {
        const games = (new GameGetter()).getGames(GameOrder.ByDate, this);
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
