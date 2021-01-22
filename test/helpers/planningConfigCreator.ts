import { GameMode } from '../../public_api';
import { JsonPlanningConfig } from '../../src/planning/config/json';
import { SelfReferee } from '../../src/referee/self';

export function createPlanningConfigNoTime(): JsonPlanningConfig {
    return {
        id: 0,
        gameMode: GameMode.Against,
        extension: false,
        enableTime: false,
        minutesPerGame: 0,
        minutesPerGameExt: 0,
        minutesBetweenGames: 0,
        minutesAfter: 0,
        selfReferee: SelfReferee.Disabled
    }
}