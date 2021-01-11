import { Game } from '../../src/game';
import { GameScore } from '../../src/score';
import { Poule } from '../../src/poule';
import { State } from '../../src/state';

export function setScoreSingle(poule: Poule, homePlaceNr: number, awayPlaceNr: number, homeGoals: number, awayGoals: number
    , state?: number) {
    const homePlace = poule.getPlace(homePlaceNr);
    const awayPlace = poule.getPlace(awayPlaceNr);
    if (!homePlace || !awayPlace) {
        return;
    }
    const foundGame = poule.getGames().find(game => {
        const homePlaces = game.getPlaces(Game.Home).map(gamePlace => gamePlace.getPlace());
        const awayPlaces = game.getPlaces(Game.Away).map(gamePlace => gamePlace.getPlace());
        return ((homePlaces.find(homePlaceIt => homePlaceIt === homePlace) !== undefined
            && awayPlaces.find(awayPlaceIt => awayPlaceIt === awayPlace) !== undefined)
            || (homePlaces.find(homePlaceIt => homePlaceIt === awayPlace) !== undefined
                && awayPlaces.find(awayPlaceIt => awayPlaceIt === homePlace) !== undefined));
    });
    if (!foundGame) {
        return;
    }
    const newHomeGoals = foundGame.getHomeAway(homePlace) === Game.Home ? homeGoals : awayGoals;
    const newAwayGoals = foundGame.getHomeAway(awayPlace) === Game.Away ? awayGoals : homeGoals;
    foundGame.getScores().push(new GameScore(foundGame, newHomeGoals, newAwayGoals, Game.Phase_RegularTime));

    foundGame.setState(state ? state : State.Finished);
}