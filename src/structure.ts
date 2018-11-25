import { Round } from './round';
import { RoundNumber } from './round/number';

/**
 * Created by coen on 27-2-17.
 */

export class Structure {
    constructor(
        protected firstRoundNumber: RoundNumber,
        protected rootRound: Round
    ) {
    }

    getFirstRoundNumber(): RoundNumber {
        return this.firstRoundNumber;
    }

    getRootRound(): Round {
        return this.rootRound;
    }

    getRoundNumbers(roundNumber: RoundNumber = this.getFirstRoundNumber(), roundNumbers: RoundNumber[] = []): RoundNumber[] {
        roundNumbers.push(roundNumber);
        if (roundNumber.hasNext()) {
            return this.getRoundNumbers(roundNumber.getNext(), roundNumbers);
        }
        return roundNumbers;
    }

    getRoundNumber(roundNumberAsValue: number): RoundNumber {
        return this.getRoundNumberHelper(roundNumberAsValue, this.rootRound.getNumber());
    }

    private getRoundNumberHelper(roundNumberAsValue: number, roundNumber: RoundNumber): RoundNumber {

        if (roundNumber === undefined) {
            return undefined;
        }
        if (roundNumberAsValue === roundNumber.getNumber()) {
            return roundNumber;
        }
        return this.getRoundNumberHelper(roundNumberAsValue, roundNumber.getNext());
    }
}
