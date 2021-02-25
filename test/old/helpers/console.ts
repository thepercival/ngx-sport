import { AgainstGame, NameService } from "../../../public_api";
import { AgainstSide } from "../../../src/against/side";

const colors = require('colors');

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
        'batch ' + consoleColor(game.getResourceBatch() % 10, consoleString(game.getResourceBatch(), 2))
        + ' (' + game.getStartDateTime().toISOString() + ') '
        + ', poule ' + game.getPoule().getNumber()
        + ', ' + consolePlaces(game, Game.HOME, batch)
        + ' vs ' + consolePlaces(game, Game.AWAY, batch)
        + ' , ref ' + consoleColor(refNumber, refDescr)
        + ', ' + consoleColor(game.getField().getNumber(), 'field ' + game.getField().getNumber())
        + ', sport ' + game.getField().getSport().getName() + (game.getField().getSport().getCustomId() ?
            '(' + game.getField().getSport().getCustomId() + ')' : '')
    );
}

export function consolePlaces(game: AgainstGame, side: AgainstSide, batch?: PlanningResourceBatch): string {
    const nameService = new NameService();
    return game.getSidePlaces(side).map(gamePlace => {
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
    } else if (number === 8) {
        return colors.brightWhite(content);
    } else if (number === 9) {
        return colors.brightRed(content);
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
