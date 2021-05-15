import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { CompetitionSport } from '../../competition/sport';
import { GameAmountConfig } from '../gameAmountConfig';
import { AgainstSportVariant } from '../../sport/variant/against';

@Injectable({
    providedIn: 'root'
})
export class GameAmountConfigService {

    constructor() {
    }

    create(competitionSport: CompetitionSport, roundNumber: RoundNumber, amount?: number, partial?: number): GameAmountConfig {
        if (amount === undefined) {
            amount = 1;
        }
        if (partial === undefined) {
            partial = 0;
        }
        const variant = competitionSport.getVariant();
        if (variant instanceof AgainstSportVariant) {
            amount = variant.getNrOfGamePlaces() <= 2 ? variant.getNrOfH2H() : 0;
            partial = variant.getNrOfGamePlaces() <= 2 ? 0 : variant.getNrOfPartials();
        }
        return new GameAmountConfig(competitionSport, roundNumber, amount, partial);
    }

    removeFromRoundNumber(competitionSport: CompetitionSport, roundNumber: RoundNumber) {
        const gameAmountConfig = roundNumber.getGameAmountConfig(competitionSport);
        if (gameAmountConfig) {
            roundNumber.getGameAmountConfigs().splice(roundNumber.getGameAmountConfigs().indexOf(gameAmountConfig), 1);
        }
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber) {
            this.removeFromRoundNumber(competitionSport, nextRoundNumber);
        }
    }
}
