import { Game, GameScore, Poule, NameService } from '../public_api';
import { State } from '../src/state';
import { PlanningResourceBatch } from '../src/planning/resource/batch';
const colors = require('colors');

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

export function consoleBatch(batch: PlanningResourceBatch) {
    console.log('------batch ' + batch.getNumber() + ' assigned -------------');
    consoleBatchHelper(batch.getRoot());
}

export function consoleBatchHelper(batch: PlanningResourceBatch) {
    consoleGames(batch.getGames(), batch);
    if (batch.hasNext()) {
        consoleBatchHelper(batch.getNext());
    }
}

export function consoleGames(games: Game[], batch?: PlanningResourceBatch) {
    games.forEach(game => consoleGame(game, batch));
}

export function consoleGame(game: Game, batch?: PlanningResourceBatch) {
    const nameService = new NameService();
    const refDescr = (game.getRefereePlace() ? nameService.getPlaceFromName(game.getRefereePlace(), false, false) : '');
    const refNumber = game.getRefereePlace() ? game.getRefereePlace().getNumber() : 0;
    console.log(
        'poule ' + game.getPoule().getNumber()
        + ', ' + consolePlaces(game, Game.HOME, batch)
        + ' vs ' + consolePlaces(game, Game.AWAY, batch)
        + ' , ref ' + consoleColor(refNumber, refDescr)
        + ', batch ' + game.getResourceBatch()
        + ', ' + consoleColor(game.getField().getNumber(), 'field ' + game.getField().getNumber())
        + ', sport ' + game.getField().getSport().getName() + (game.getField().getSport().getCustomId() ?
            '(' + game.getField().getSport().getCustomId() + ')' : '')
    );
}

export function consolePlaces(game: Game, homeAway: boolean, batch?: PlanningResourceBatch): string {
    const nameService = new NameService();
    return game.getPlaces(homeAway).map(gamePlace => {
        const colorNumber = gamePlace.getPlace().getNumber();
        const gamesInARow = batch ? ('(' + batch.getGamesInARow(gamePlace.getPlace()) + ')') : '';
        return consoleColor(colorNumber, nameService.getPlaceFromName(gamePlace.getPlace(), false, false) + gamesInARow);
    }).join(' & ');
}

export function consoleColor(number: number, content: string): string {
    if (number === 1) {
        return colors.red(content);
    } else if (number === 2) {
        return colors.green(content);
    } else if (number === 3) {
        return colors.blue(content);
    } else if (number === 4) {
        return colors.yellow(content);
    } else if (number === 5) {
        return colors.magenta(content);
    } else if (number === 6) {
        return colors.grey(content);
    } else if (number === 7) {
        return colors.cyan(content);
    }
    return content;
}


export function consoleString(value, minLength: number): string {
    let str = '' + value;
    while (str.length < minLength) {
        str = ' ' + str;
    }
    return str;
}
