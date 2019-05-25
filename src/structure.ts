import { QualifyGroup } from './qualify/group';
import { Round } from './round';
import { RoundNumber } from './round/number';


export class Structure {
    constructor(
        protected firstRoundNumber: RoundNumber,
        protected rootRound: Round
    ) {
    }

    getFirstRoundNumber(): RoundNumber {
        return this.firstRoundNumber;
    }

    getLastRoundNumber(): RoundNumber {
        return this.getLastRoundNumberHelper(this.getFirstRoundNumber());
    }

    private getLastRoundNumberHelper(roundNumber: RoundNumber): RoundNumber {
        if (!roundNumber.hasNext()) {
            return roundNumber;
        }
        return this.getLastRoundNumberHelper(roundNumber.getNext());
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
        return this.getRoundNumberHelper(roundNumberAsValue, this.getFirstRoundNumber());
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

    setStructureNumbers() {
        const structureNumber = { poule: 1, nrOfDropoutPlaces: 0 };
        const setStructureNumbers = (round: Round) => {
            round.getPoules().forEach(poule => {
                poule.setStructureNumber(structureNumber.poule++);
            });
            round.getQualifyGroups(QualifyGroup.WINNERS).forEach(qualifyGroup => {
                setStructureNumbers(qualifyGroup.getChildRound());
            });
            round.setStructureNumber(structureNumber.nrOfDropoutPlaces);
            structureNumber.nrOfDropoutPlaces += round.getNrOfDropoutPlaces();
            round.getQualifyGroups(QualifyGroup.LOSERS).slice().reverse().forEach(qualifyGroup => {
                setStructureNumbers(qualifyGroup.getChildRound());
            });
        }
        setStructureNumbers(this.rootRound);
    }

    // getRound( winnersOrLosersPath: number[] ): Round {
    //     let round = this.getRootRound();
    //     winnersOrLosersPath.forEach( winnersOrLosers => {
    //         round = round.getChildRound(winnersOrLosers);
    //     });
    //     return round;
    // }

    // getRound( winnersOrLosersPath: number[] ): Round {
    //     let round = this.getRootRound();
    //     winnersOrLosersPath.forEach( winnersOrLosers => {
    //         round = round.getChildRound(winnersOrLosers);
    //     });
    //     return round;
    // }
}
