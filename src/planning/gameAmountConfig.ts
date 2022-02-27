import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';
import { RoundNumber } from '../round/number';

export class GameAmountConfig extends Identifiable {
    // protected sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant;

    constructor(
        protected competitionSport: CompetitionSport,
        protected roundNumber: RoundNumber,
        protected amount: number) {
        super();
        roundNumber.getGameAmountConfigs().push(this);
        /*
        if (amount === undefined) {
            amount = 1;
        }
        if (nrOfGamesPerPlace === undefined) {
            nrOfGamesPerPlace = 0;
        }
        const sourceVariant = this.competitionSport.getVariant();
        if (sourceVariant instanceof AgainstSportVariant) {
            this.sportVariant = new AgainstSportVariant(
                this.competitionSport.getSport(),
                sourceVariant.getNrOfHomePlaces(),
                sourceVariant.getNrOfAwayPlaces(),
                amount,
                nrOfGamesPerPlace);
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

    getCompetitionSport(): CompetitionSport {
        return this.competitionSport;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}
