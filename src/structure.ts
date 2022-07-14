import { Category } from './category';
import { StartLocation } from './competitor/startLocation';
import { Place } from './place';
import { Poule } from './poule';
import { Round } from './qualify/group';
import { RoundNumber } from './round/number';


export class Structure {
    constructor(
        protected categories: Category[],
        protected firstRoundNumber: RoundNumber
    ) {
    }

    getCategories(): Category[] {
        return this.categories;
    }

    getCategory(number: number): Category {
        const category = this.getCategories().find(category => category.getNumber() === number);
        if (category === undefined) {
            throw Error('de category kan niet gevonden worden');
        }
        return category;
    }

    hasSingleCategory(): boolean {
        return this.categories.length === 1;
    }

    getSingleCategory(): Category {
        if (this.categories.length !== 1) {
            throw Error('there should be one category');
        }
        return this.categories[0];
    }

    getRootRounds(): Round[] {
        return this.categories.map((category: Category): Round => {
            return category.getRootRound();
        });
    }

    getFirstRoundNumber(): RoundNumber {
        return this.firstRoundNumber;
    }

    getLastRoundNumber(): RoundNumber {
        const getLastRoundNumber = (roundNumber: RoundNumber): RoundNumber => {
            const nextRoundNumber = roundNumber.getNext();
            if (!nextRoundNumber) {
                return roundNumber;
            }
            return getLastRoundNumber(nextRoundNumber);
        };
        return getLastRoundNumber(this.getFirstRoundNumber());
    }

    getRoundNumbers(): RoundNumber[] {
        const roundNumbers: RoundNumber[] = [];
        const addRoundNumber = (roundNumber: RoundNumber) => {
            roundNumbers.push(roundNumber);
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber) {
                addRoundNumber(nextRoundNumber);
            }
        };
        addRoundNumber(this.getFirstRoundNumber());
        return roundNumbers;
    }

    getRoundNumber(initRoundNumberAsValue: number): RoundNumber | undefined {
        const getRoundNumber = (roundNumberAsValue: number, roundNumber?: RoundNumber): RoundNumber | undefined => {
            if (roundNumber === undefined) {
                return undefined;
            }
            if (roundNumberAsValue === roundNumber.getNumber()) {
                return roundNumber;
            }
            return getRoundNumber(roundNumberAsValue, roundNumber.getNext());
        };
        return getRoundNumber(initRoundNumberAsValue, this.getFirstRoundNumber());
    }

    allPoulesHaveGames(): boolean {
        return this.categories.every((category: Category) => this.allRoundsHaveGames([category.getRootRound()]));
    }

    protected allRoundsHaveGames(rounds: Round[]): boolean {
        return rounds.every((round: Round) => {
            if (round.getPoules().some((poule: Poule) => poule.getNrOfGames() === 0)) {
                return false;
            }
            return this.allRoundsHaveGames(round.getChildren());
        });
    }

    getStartPlace(startLocation: StartLocation): Place {
        return this.getCategory(startLocation.getCategoryNr()).getRootRound().getPoule(startLocation.getPouleNr()).getPlace(startLocation.getPlaceNr());
    }
}
