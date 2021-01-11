import { Round } from '../qualify/group';
import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';
import { RoundNumber } from '../round/number';

export class GameAmountConfig extends Identifiable {


    constructor(protected competitionSport: CompetitionSport, protected roundNumber: RoundNumber, protected amount: number) {
        super();
        roundNumber.getGameAmountConfigs().push(this);

    }

    getAmount(): number {
        return this.amount;
    }

    setAmount(amount: number) {
        this.amount = amount;
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}
