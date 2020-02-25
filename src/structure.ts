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
        };
        addRoundNumber(this.getFirstRoundNumber());
        return roundNumbers;
    }

    getRoundNumber(initRoundNumberAsValue: number): RoundNumber {
        const getRoundNumber = (roundNumberAsValue: number, roundNumber: RoundNumber): RoundNumber => {

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

    setStructureNumbers() {
        let nrOfDropoutPlaces = 0;
        const setRoundStructureNumbers = (round: Round) => {
            round.getQualifyGroups(QualifyGroup.WINNERS).forEach(qualifyGroup => {
                setRoundStructureNumbers(qualifyGroup.getChildRound());
            });
            round.setStructureNumber(nrOfDropoutPlaces);
            nrOfDropoutPlaces += round.getNrOfDropoutPlaces();
            round.getQualifyGroups(QualifyGroup.LOSERS).slice().reverse().forEach(qualifyGroup => {
                setRoundStructureNumbers(qualifyGroup.getChildRound());
            });
        };
        let pouleNr = 1;
        const setPouleStructureNumbers = (roundNumber: RoundNumber) => {
            const rounds = roundNumber.getRounds();
            rounds.sort((roundA, roundB) => {
                return (roundA.getStructureNumber() > roundB.getStructureNumber()) ? 1 : -1;
            });
            rounds.forEach(round => {
                round.getPoules().forEach(poule => poule.setStructureNumber(pouleNr++));
            });
            if (roundNumber.hasNext()) {
                setPouleStructureNumbers(roundNumber.getNext());
            }
        };
        setRoundStructureNumbers(this.rootRound);
        setPouleStructureNumbers(this.firstRoundNumber);
    }
}
