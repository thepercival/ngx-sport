import { Game, GameScore, Poule } from '../public_api';
import { State } from '../src/state';

export function setScoreSingle(poule: Poule, homePlaceNr: number, awayPlaceNr: number, homeGoals: number, awayGoals: number
    , state?: number) {
    const homePlace = poule.getPlace(homePlaceNr);
    const awayPlace = poule.getPlace(awayPlaceNr);
    const foundGame = poule.getGames().find(game => {
        const homePlaces = game.getPlaces(Game.HOME).map(gamePlace => gamePlace.getPlace());
        const awayPlaces = game.getPlaces(Game.AWAY).map(gamePlace => gamePlace.getPlace());
        return ((homePlaces.find(homePlaceIt => homePlaceIt === homePlace) !== undefined
            && awayPlaces.find(awayPlaceIt => awayPlaceIt === awayPlace) !== undefined)
            || (homePlaces.find(homePlaceIt => homePlaceIt === awayPlace) !== undefined
                && awayPlaces.find(awayPlaceIt => awayPlaceIt === homePlace) !== undefined));
    });
    const newHomeGoals = foundGame.getHomeAway(homePlace) === Game.HOME ? homeGoals : awayGoals;
    const newAwayGoals = foundGame.getHomeAway(awayPlace) === Game.AWAY ? awayGoals : homeGoals;
    foundGame.getScores().push(new GameScore(foundGame, newHomeGoals, newAwayGoals, Game.PHASE_REGULARTIME));

    foundGame.setState(state ? state : State.Finished);
}

