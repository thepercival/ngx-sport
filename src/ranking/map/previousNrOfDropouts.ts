import { Round } from "../../qualify/group";
import { QualifyTarget } from "../../qualify/target";

export class PreviousNrOfDropoutsMap {
    protected map: NrOfDropoutsMap = {};

    constructor(startRound: Round) {
        this.map = this.constructMap(startRound);
    }

    get(round: Round): number {
        return this.map[round.getStructurePathNode().pathToString()];
    }

    private constructMap(startRound: Round): NrOfDropoutsMap {
        const map: NrOfDropoutsMap = {};

        let nrOfDropoutPlaces = 0;
        const setDropouts = (round: Round) => {
            round.getQualifyGroups(QualifyTarget.Winners).forEach(qualifyGroup => {
                setDropouts(qualifyGroup.getChildRound());
            });
            map[round.getStructurePathNode().pathToString()] = nrOfDropoutPlaces;
            nrOfDropoutPlaces += round.getNrOfDropoutPlaces();
            round.getQualifyGroups(QualifyTarget.Losers).slice().reverse().forEach(qualifyGroup => {
                setDropouts(qualifyGroup.getChildRound());
            });
        };
        setDropouts(startRound);
        return map;
    }
}

interface NrOfDropoutsMap {
    [key: string]: number;
}
