import { Game } from '../game';
import { GamePoulePlace } from '../game/pouleplace';
import { PoulePlace } from '../pouleplace';

export class PoulePlaceCombination {
    public constructor(
        private home: PoulePlace[], private away: PoulePlace[],
    ) { }

    static getSum(poulePlaces: PoulePlace[]): number {
        let id = 0;
        poulePlaces.forEach(poulePlace => { id += PoulePlaceCombination.getNumber(poulePlace); });
        return id;
    }

    static getNumber(poulePlace: PoulePlace): number {
        return Math.pow(2, poulePlace.getNumber() - 1);
    }

    getHome(): PoulePlace[] { return this.home; }
    getAway(): PoulePlace[] { return this.away; }
    get(): PoulePlace[] {
        return this.home.concat(this.away);
    }
    getGamePoulePlaces(game: Game, reverseHomeAway: boolean/*, reverseCombination: boolean*/): GamePoulePlace[] {
        const home = this.getHome().map(homeIt => new GamePoulePlace(game, homeIt, reverseHomeAway ? Game.AWAY : Game.HOME));
        const away = this.getAway().map(awayIt => new GamePoulePlace(game, awayIt, reverseHomeAway ? Game.HOME : Game.AWAY));
        if (reverseHomeAway === true) {
            home.reverse();
            away.reverse();
        }
        return home.concat(away);
    }

    hasOverlap(combination: PoulePlaceCombination) {
        const number = new PoulePlaceCombinationNumber(this);
        return number.hasOverlap(new PoulePlaceCombinationNumber(combination));
    }
}

export class PoulePlaceCombinationNumber {
    private home: number;
    private away: number;
    public constructor(combination: PoulePlaceCombination) {
        this.home = PoulePlaceCombination.getSum(combination.getHome());
        this.away = PoulePlaceCombination.getSum(combination.getAway());
    }
    getHome(): number { return this.home; }
    getAway(): number { return this.away; }
    equals(combinationNumber: PoulePlaceCombinationNumber): boolean {
        return (combinationNumber.getAway() === this.getHome() || combinationNumber.getHome() === this.getHome())
            && (combinationNumber.getAway() === this.getAway() || combinationNumber.getHome() === this.getAway());
    }
    hasOverlap(combinationNumber: PoulePlaceCombinationNumber): boolean {
        return (combinationNumber.getAway() & this.getHome()) > 0
            || (combinationNumber.getAway() & this.getAway()) > 0
            || (combinationNumber.getHome() & this.getHome()) > 0
            || (combinationNumber.getHome() & this.getAway()) > 0
            ;
    }
}