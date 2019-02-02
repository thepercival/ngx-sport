import { PoulePlaceCombination } from '../pouleplace/combination';

export class PlanningGameRound {
    public constructor(
        private roundNumber: number,
        private combinations: PoulePlaceCombination[]
    ) { }
    getNumber(): number { return this.roundNumber; }
    getCombinations(): PoulePlaceCombination[] { return this.combinations; }
}