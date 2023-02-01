import { Identifiable } from '../identifiable';
import { CompetitionSport } from '../competition/sport';
import { RoundNumber } from '../round/number';
import { Single } from '../sport/variant/single';
import { AgainstH2h } from '../sport/variant/against/h2h';
import { AgainstGpp } from '../sport/variant/against/gamesPerPlace';
import { AllInOneGame } from '../sport/variant/allInOneGame';

export class GameAmountConfig extends Identifiable {
    constructor(
        protected competitionSport: CompetitionSport,
        protected roundNumber: RoundNumber,
        protected amount: number) {
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

    public createVariant(): Single|AgainstH2h|AgainstGpp|AllInOneGame
    {
        const sportVariant = this.competitionSport.getVariant();
        if (sportVariant instanceof Single) {
            return new Single(this.competitionSport.getSport(), sportVariant.getNrOfGamePlaces(), this.amount);
        } else if (sportVariant instanceof AllInOneGame) {
            return new AllInOneGame(this.competitionSport.getSport(), this.amount);
        } else if (sportVariant instanceof AgainstH2h) {
            return new AgainstH2h(this.competitionSport.getSport(),sportVariant.getNrOfHomePlaces(), sportVariant.getNrOfAwayPlaces(), this.amount);
        } 
        return new AgainstGpp(this.competitionSport.getSport(),sportVariant.getNrOfHomePlaces(), sportVariant.getNrOfAwayPlaces(), this.amount);
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }
}
