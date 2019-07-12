import { Game } from '../game';
import { GamePlace } from '../game/place';
import { Place } from '../place';

/* tslint:disable:no-bitwise */
/* tslint:disable:no-use-before-declare */

export class PlaceCombination {
    public constructor(
        private home: Place[], private away: Place[],
    ) { }

    static getSum(places: Place[]): number {
        let id = 0;
        places.forEach(place => { id += PlaceCombination.getNumber(place); });
        return id;
    }

    static getNumber(place: Place): number {
        return Math.pow(2, place.getNumber() - 1);
    }

    getHome(): Place[] { return this.home; }
    getAway(): Place[] { return this.away; }
    get(): Place[] {
        return this.home.concat(this.away);
    }
    getGamePlaces(game: Game, reverseHomeAway: boolean/*, reverseCombination: boolean*/): GamePlace[] {
        const home = this.getHome().map(homeIt => new GamePlace(game, homeIt, reverseHomeAway ? Game.AWAY : Game.HOME));
        const away = this.getAway().map(awayIt => new GamePlace(game, awayIt, reverseHomeAway ? Game.HOME : Game.AWAY));
        if (reverseHomeAway === true) {
            home.reverse();
            away.reverse();
        }
        return home.concat(away);
    }

    hasOverlap(combination: PlaceCombination) {
        const number = new PlaceCombinationNumber(this);
        return number.hasOverlap(new PlaceCombinationNumber(combination));
    }
}

export class PlaceCombinationNumber {
    private home: number;
    private away: number;
    public constructor(combination: PlaceCombination) {
        this.home = PlaceCombination.getSum(combination.getHome());
        this.away = PlaceCombination.getSum(combination.getAway());
    }
    getHome(): number { return this.home; }
    getAway(): number { return this.away; }
    equals(combinationNumber: PlaceCombinationNumber): boolean {
        return (combinationNumber.getAway() === this.getHome() || combinationNumber.getHome() === this.getHome())
            && (combinationNumber.getAway() === this.getAway() || combinationNumber.getHome() === this.getAway());
    }
    hasOverlap(combinationNumber: PlaceCombinationNumber): boolean {
        return (combinationNumber.getAway() & this.getHome()) > 0
            || (combinationNumber.getAway() & this.getAway()) > 0
            || (combinationNumber.getHome() & this.getHome()) > 0
            || (combinationNumber.getHome() & this.getAway()) > 0
            ;
    }
}
