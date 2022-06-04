import { Category } from "../category";
import { Round } from "./group";
import { QualifyTarget } from "./target";

export class RoundRankService {
    private roundRankCalculatorMap: RoundRankCalculatorMap = {};

    constructor() {
    }

    public getRank(round: Round): number {
        const roundRankCalculator = this.getRoundRankCalculator(round.getCategory());
        return roundRankCalculator.getRank(round);
    }

    public getRoundRankCalculator(category: Category): RoundRankCalculator {
        if (this.roundRankCalculatorMap[category.getNumber()] === undefined) {
            this.roundRankCalculatorMap[category.getNumber()] = new RoundRankCalculator(category);
        }
        return this.roundRankCalculatorMap[category.getNumber()];
    }
}

export class RoundRankCalculator {
    protected map: NrOfDropoutsMap = {};

    constructor(category: Category) {
        this.map = this.constructMap(category.getRootRound());
    }

    getRank(round: Round): number {
        return this.map[round.getPathNode().pathToString()];
    }

    private constructMap(startRound: Round): NrOfDropoutsMap {
        const map: NrOfDropoutsMap = {};

        let nrOfDropoutPlaces = 0;
        const setDropouts = (round: Round) => {
            round.getQualifyGroups(QualifyTarget.Winners).forEach(qualifyGroup => {
                setDropouts(qualifyGroup.getChildRound());
            });
            map[round.getPathNode().pathToString()] = nrOfDropoutPlaces;
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

export interface RoundRankCalculatorMap {
    [key: number]: RoundRankCalculator;
}
