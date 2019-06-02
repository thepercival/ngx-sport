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
        const getLastRoundNumber = (roundNumber: RoundNumber): RoundNumber => {
            if (!roundNumber.hasNext()) {
                return roundNumber;
            }
            return getLastRoundNumber(roundNumber.getNext());
        };
        return getLastRoundNumber(this.getFirstRoundNumber());
    }

    getRootRound(): Round {
        return this.rootRound;
    }

    getRoundNumbers(): RoundNumber[] {
        const roundNumbers: RoundNumber[] = [];
        const addRoundNumber = (roundNumber: RoundNumber) => {
            roundNumbers.push(roundNumber);
            if (roundNumber.hasNext()) {
                addRoundNumber(roundNumber.getNext());
            }
        }
        addRoundNumber(this.getFirstRoundNumber());
        return roundNumbers;
    }

    getRoundNumber(roundNumberAsValue: number): RoundNumber {
        const getRoundNumber = (roundNumberAsValue: number, roundNumber: RoundNumber): RoundNumber => {

            if (roundNumber === undefined) {
                return undefined;
            }
            if (roundNumberAsValue === roundNumber.getNumber()) {
                return roundNumber;
            }
            return getRoundNumber(roundNumberAsValue, roundNumber.getNext());
        };
        return getRoundNumber(roundNumberAsValue, this.getFirstRoundNumber());
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
}
