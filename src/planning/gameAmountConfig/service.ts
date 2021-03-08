import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { CompetitionSport } from '../../competition/sport';
import { GameAmountConfig } from '../gameAmountConfig';
import { GameMode } from '../gameMode';

@Injectable({
    providedIn: 'root'
})
export class GameAmountConfigService {

    constructor() {
    }

    createDefault(competitionSport: CompetitionSport, roundNumber: RoundNumber): GameAmountConfig {
        let amount = 1;
        if (competitionSport.getSport().getGameMode() === GameMode.Together) {
            amount = competitionSport.getFields().length;
        }
        return new GameAmountConfig(competitionSport, roundNumber, amount);
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

    copy(competitionSport: CompetitionSport, roundNumber: RoundNumber, amount: number): GameAmountConfig {
        return new GameAmountConfig(competitionSport, roundNumber, amount);
    }
}
