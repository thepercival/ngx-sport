import { Poule } from "../poule";
import { Round } from "../qualify/group";
import { RoundRankService } from "../qualify/roundRankCalculator";
import { RoundNumber } from "../round/number";

export class PouleStructureNumberMap {
    protected map: InnerPouleStructureNumberMap = {};

    constructor(roundNumber: RoundNumber, roundRankService: RoundRankService) {
        this.map = this.constructMap(roundNumber, roundRankService);
    }

    get(poule: Poule): number {
        return this.map[poule.getStructureLocation()];
    }

    private constructMap(startRoundNumber: RoundNumber, roundRankService: RoundRankService): InnerPouleStructureNumberMap {
        const map: InnerPouleStructureNumberMap = {};

        let pouleNr = 1;
        const setPouleStructureNumbers = (roundNumber: RoundNumber) => {
            const rounds = roundNumber.getRounds();

            // for each cat
            rounds.sort((roundA: Round, roundB: Round) => {
                if (roundA.getCategory().getNumber() === roundB.getCategory().getNumber()) {
                    return roundRankService.getRank(roundA) > roundRankService.getRank(roundB) ? 1 : -1;
                }
                return roundA.getCategory().getNumber() > roundB.getCategory().getNumber() ? 1 : -1;

            });
            rounds.forEach((round: Round) => {
                round.getPoules().forEach((poule: Poule) => map[poule.getStructureLocation()] = pouleNr++);
            });
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber !== undefined) {
                setPouleStructureNumbers(nextRoundNumber);
            }
        };
        setPouleStructureNumbers(startRoundNumber);
        return map;
    }
}

interface InnerPouleStructureNumberMap {
    [key: string]: number;
}