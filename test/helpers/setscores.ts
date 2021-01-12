import { AgainstGame, AgainstScore, Game, Poule, State } from "../../public_api";

export function setAgainstScoreSingle(poule: Poule, homePlaceNr: number, awayPlaceNr: number, homeGoals: number, awayGoals: number
    , state?: number) {
    const homePlace = poule.getPlace(homePlaceNr);
    const awayPlace = poule.getPlace(awayPlaceNr);
    if (!homePlace || !awayPlace) {
        return;
    }
    const foundGame = poule.getAgainstGames().find(game => {
        const homePlaces = game.getHomeAwayPlaces(AgainstGame.Home).map(gamePlace => gamePlace.getPlace());
        const awayPlaces = game.getHomeAwayPlaces(AgainstGame.Away).map(gamePlace => gamePlace.getPlace());
        return ((homePlaces.find(homePlaceIt => homePlaceIt === homePlace) !== undefined
            && awayPlaces.find(awayPlaceIt => awayPlaceIt === awayPlace) !== undefined)
            || (homePlaces.find(homePlaceIt => homePlaceIt === awayPlace) !== undefined
                && awayPlaces.find(awayPlaceIt => awayPlaceIt === homePlace) !== undefined));
    });
    if (!foundGame) {
        return;
    }
    const newHomeGoals = foundGame.getHomeAway(homePlace) === AgainstGame.Home ? homeGoals : awayGoals;
    const newAwayGoals = foundGame.getHomeAway(awayPlace) === AgainstGame.Away ? awayGoals : homeGoals;
    foundGame.getScores().push(new AgainstScore(foundGame, newHomeGoals, newAwayGoals, Game.Phase_RegularTime));

    foundGame.setState(state ? state : State.Finished);
}