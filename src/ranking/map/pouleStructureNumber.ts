import { Poule } from "../../poule";
import { Round } from "../../qualify/group";
import { RoundNumber } from "../../round/number";
import { PreviousNrOfDropoutsMap } from "./previousNrOfDropouts";

export class PouleStructureNumberMap {
    protected map: InnerPouleStructureNumberMap = {};

    constructor(roundNumber: RoundNumber, previousNrOfDropoutsMap: PreviousNrOfDropoutsMap) {
        this.map = this.constructMap(roundNumber, previousNrOfDropoutsMap);
    }

    get(poule: Poule): number {
        return this.map[poule.getStructureLocation()];
    }

    private constructMap(startRoundNumber: RoundNumber, previousNrOfDropoutsMap: PreviousNrOfDropoutsMap): InnerPouleStructureNumberMap {
        const map: InnerPouleStructureNumberMap = {};

        let pouleNr = 1;
        const setPouleStructureNumbers = (roundNumber: RoundNumber) => {
            const rounds = roundNumber.getRounds();
            rounds.sort((roundA: Round, roundB: Round) => {
                return previousNrOfDropoutsMap.get(roundA) > previousNrOfDropoutsMap.get(roundB) ? 1 : -1;
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