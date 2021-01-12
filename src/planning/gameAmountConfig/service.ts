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
        const gameMode = roundNumber.getValidPlanningConfig()?.getGameMode();
        let amount = GameMode.Against;
        if (gameMode === GameMode.Together) {
            amount = competitionSport.getFields().length;
        }
        return new GameAmountConfig(competitionSport, roundNumber, amount);
    }

    copy(competitionSport: CompetitionSport, roundNumber: RoundNumber, amount: number): GameAmountConfig {
        return new GameAmountConfig(competitionSport, roundNumber, amount);
    }
}
