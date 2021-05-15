import { Round } from '../qualify/group';
import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';
import { RoundNumber } from '../round/number';
import { SingleSportVariant } from '../sport/variant/single';
import { AgainstSportVariant } from '../sport/variant/against';
import { AllInOneGameSportVariant } from '../sport/variant/all';

export class GameAmountConfig extends Identifiable {
    // protected sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant;

    constructor(
        protected competitionSport: CompetitionSport,
        protected roundNumber: RoundNumber,
        protected amount: number,
        protected partial: number) {
        super();
        roundNumber.getGameAmountConfigs().push(this);
        /*
        if (amount === undefined) {
            amount = 1;
        }
        if (partial === undefined) {
            partial = 0;
        }
        const sourceVariant = this.competitionSport.getVariant();
        if (sourceVariant instanceof AgainstSportVariant) {
            this.sportVariant = new AgainstSportVariant(
                this.competitionSport.getSport(),
                sourceVariant.getNrOfHomePlaces(),
                sourceVariant.getNrOfAwayPlaces(),
                amount,
                partial);
        } else if (sourceVariant instanceof SingleSportVariant) {
            this.sportVariant = new SingleSportVariant(this.competitionSport.getSport(), sourceVariant.getNrOfGamePlaces(), amount);
        } else {
            this.sportVariant = new AllInOneGameSportVariant(this.competitionSport.getSport(), amount);
        }*/
    }

    getAmount(): number {
        return this.amount;
    }

    setAmount(amount: number) {
        this.amount = amount;
    }

    getPartial(): number {
        return this.partial;
    }

    setPartial(partial: number) {
        this.partial = partial;
    }

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}
