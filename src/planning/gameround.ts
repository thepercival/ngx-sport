import { PlaceCombination } from '../place/combination';

export class PlanningGameRound {
    public constructor(
        private roundNumber: number,
        private combinations: PlaceCombination[]
    ) { }
    getNumber(): number { return this.roundNumber; }
    getCombinations(): PlaceCombination[] { return this.combinations; }
}