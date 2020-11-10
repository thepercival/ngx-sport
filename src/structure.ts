import { QualifyGroup, Round } from './qualify/group';
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
            const nextRoundNumber = roundNumber.getNext();
            if (!nextRoundNumber) {
                return roundNumber;
            }
            return getLastRoundNumber(nextRoundNumber);
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

    hasPlanning(): boolean {
        return this.hasRoundNumberPlanning(this.getFirstRoundNumber());
    }

    protected hasRoundNumberPlanning(roundNumber: RoundNumber): boolean {
        const nextRoundNumber = roundNumber.getNext();
        if (!nextRoundNumber || !roundNumber.getHasPlanning()) {
            return roundNumber.getHasPlanning();
        }
        return this.hasRoundNumberPlanning(nextRoundNumber);
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
            const rounds: Round[] = roundNumber.getRounds();
            rounds.sort((roundA, roundB) => {
                return (roundA.getStructureNumber() > roundB.getStructureNumber()) ? 1 : -1;
            });
            rounds.forEach(round => {
                round.getPoules().forEach(poule => poule.setStructureNumber(pouleNr++));
            });
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber) {
                setPouleStructureNumbers(nextRoundNumber);
            }
        };
        setRoundStructureNumbers(this.rootRound);
        setPouleStructureNumbers(this.firstRoundNumber);
    }
}
