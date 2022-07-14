import { Poule } from '../poule';
import { AgainstGame } from './against';
import { TogetherGame } from './together';
import { GameOrder } from './order';
import { CategoryMap } from '../category/map';
import { StructureCell } from '../structure/cell';
import { RoundNumber } from '../round/number';

export class GameGetter {
    constructor() {

    }

    getGames(order: GameOrder, roundNumber: RoundNumber, categoryMap?: CategoryMap): (AgainstGame | TogetherGame)[] {
        let structureCells = roundNumber.getStructureCells(categoryMap);
        let games: (AgainstGame | TogetherGame)[] = [];
        structureCells.forEach((structureCell: StructureCell) => {
            structureCell.getPoules().forEach((poule: Poule) => games = games.concat(poule.getGames()));
        });
        return this.orderGames(order, games, roundNumber.isFirst());
    }

    private orderGames(order: GameOrder, games: (AgainstGame | TogetherGame)[], firstRoundNumber: boolean): (AgainstGame | TogetherGame)[] {
        const baseSort = (g1: TogetherGame | AgainstGame, g2: TogetherGame | AgainstGame): number => {
            const field1 = g1.getField();
            const field2 = g2.getField();
            if (field1 === undefined || field2 === undefined) {
                return 0;
            }
            const retVal = field1.getPriority() - field2.getPriority();
            return firstRoundNumber ? retVal : -retVal;
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

}
