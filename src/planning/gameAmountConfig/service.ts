import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { Structure } from '../../structure';
import { SportCustom } from '../../sport/custom';
import { SportMapper } from '../../sport/mapper';
import { JsonField } from '../../field/json';
import { ScoreConfigService } from 'src/score/config/service';
import { CompetitionSport } from 'src/competition/sport';
import { GameAmountConfig } from '../gameAmountConfig';

@Injectable({
    providedIn: 'root'
})
export class GameAmountConfigService {

    constructor() {
    }

    createDefault(competitionSport: CompetitionSport, roundNumber: RoundNumber): GameAmountConfig {
        const gameMode = roundNumber.getValidPlanningConfig()?.getGameMode();
        let amount = Sport.GAMEMODE_AGAINST
        if (gameMode === Sport.GAMEMODE_TOGETHER) {
            amount = competitionSport.getFields().length;
        }
        return new GameAmountConfig(competitionSport, roundNumber, amount);
    }

    copy(competitionSport: CompetitionSport, roundNumber: RoundNumber, amount: number): GameAmountConfig {
        return new GameAmountConfig(competitionSport, roundNumber, amount);
    }
}
