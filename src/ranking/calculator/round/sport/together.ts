import { CompetitionSport } from "../../../../competition/sport";
import { GameState } from "../../../../game/state";
import { TogetherGame } from "../../../../game/together";
import { Place } from "../../../../place";
import { PlaceSportPerformance } from "../../../../place/sportPerformance";
import { PlaceTogetherSportPerformanceCalculator } from "../../../../place/sportPerformance/calculator/together";
import { Poule } from "../../../../poule";
import { Round } from "../../../../qualify/group";
import { RankingFunctionMapCreator } from "../../../functionMapCreator";
import { SportRoundRankingItem } from "../../../item/round/sport";
import { SportRoundRankingCalculator } from "../sport";

export class TogetherSportRoundRankingCalculator extends SportRoundRankingCalculator {

    constructor(competitionSport: CompetitionSport, gameStates?: GameState[]) {
        super(competitionSport, gameStates ?? [GameState.Finished]);
        const functionMapCreator = new RankingFunctionMapCreator();
        this.rankFunctionMap = functionMapCreator.getMap();
    }

    getItemsForPoule(poule: Poule): SportRoundRankingItem[] {
        return this.getItems(poule.getRound(), poule.getPlaces(), poule.getTogetherGames());
    }

    protected getItems(round: Round, places: Place[], games: TogetherGame[]): SportRoundRankingItem[] {
        const calculator = new PlaceTogetherSportPerformanceCalculator(round, this.competitionSport);
        const performances: PlaceSportPerformance[] = calculator.getPerformances(places, this.getFilteredGames(games));
        return this.getItemsHelper(round, performances);
    }

    protected getFilteredGames(games: TogetherGame[]): TogetherGame[] {
        return games.filter((game: TogetherGame) => this.gameStateMap[game.getState()] !== undefined);
    }
}