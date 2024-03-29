import { AgainstGame, AgainstScore, AgainstSide, Poule, GameState } from "../../public-api";
import { GamePhase } from "../../src/game/phase";

export function setAgainstScoreSingle(poule: Poule, homePlaceNr: number, awayPlaceNr: number, homeGoals: number, awayGoals: number
    , state?: GameState, homeExtraPoints?: number, awayExtraPoints?: number) {
    const homePlace = poule.getPlace(homePlaceNr);
    const awayPlace = poule.getPlace(awayPlaceNr);
    if (!homePlace || !awayPlace) {
        throw Error('home- or awayplace could not be found');
    }
    const foundGame = poule.getAgainstGames().find((game: AgainstGame) => {
        const homePlaces = game.getSidePlaces(AgainstSide.Home).map(gamePlace => gamePlace.getPlace());
        const awayPlaces = game.getSidePlaces(AgainstSide.Away).map(gamePlace => gamePlace.getPlace());
        return ((homePlaces.find(homePlaceIt => homePlaceIt === homePlace) !== undefined
            && awayPlaces.find(awayPlaceIt => awayPlaceIt === awayPlace) !== undefined)
            || (homePlaces.find(homePlaceIt => homePlaceIt === awayPlace) !== undefined
                && awayPlaces.find(awayPlaceIt => awayPlaceIt === homePlace) !== undefined));
    });
    if (!foundGame) {
        throw Error('game could not be found');
    }
    const newHomeGoals = foundGame.getSide(homePlace) === AgainstSide.Home ? homeGoals : awayGoals;
    const newAwayGoals = foundGame.getSide(awayPlace) === AgainstSide.Away ? awayGoals : homeGoals;
    foundGame.getScores().push(new AgainstScore(foundGame, newHomeGoals, newAwayGoals, GamePhase.RegularTime));

    foundGame.setState(state ? state : GameState.Finished);
    foundGame.setHomeExtraPoints(homeExtraPoints ?? 0);
    foundGame.setAwayExtraPoints(awayExtraPoints ?? 0);
}