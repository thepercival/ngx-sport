import { Game, GameScore, Poule } from '../public_api';

export function setScoreSingle(poule: Poule, homePlaceNr: number, awayPlaceNr: number, homeGoals: number, awayGoals: number, state?: number) {
    const homePlace = poule.getPlace(homePlaceNr);
    const awayPlace = poule.getPlace(awayPlaceNr);
    const game = poule.getGames().find(game => {
        const homePlaces = game.getPoulePlaces(Game.HOME).map(gamePlace => gamePlace.getPoulePlace());
        const awayPlaces = game.getPoulePlaces(Game.AWAY).map(gamePlace => gamePlace.getPoulePlace());
        return ((homePlaces.find(homePlaceIt => homePlaceIt === homePlace) !== undefined
            && awayPlaces.find(awayPlaceIt => awayPlaceIt === awayPlace) !== undefined)
            || (homePlaces.find(homePlaceIt => homePlaceIt === awayPlace) !== undefined
                && awayPlaces.find(awayPlaceIt => awayPlaceIt === homePlace) !== undefined))
    });
    const newHomeGoals = game.getHomeAway(homePlace) === Game.HOME ? homeGoals : awayGoals;
    const newAwayGoals = game.getHomeAway(awayPlace) === Game.AWAY ? awayGoals : homeGoals;
    game.getScores().push(new GameScore(game, newHomeGoals, newAwayGoals));

    game.setState(state ? state : Game.STATE_PLAYED);
}

