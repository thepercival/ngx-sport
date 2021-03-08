import { GameMode, JsonPlanningConfig, SelfReferee } from '../../public_api';
import { CreationStrategy } from '../../src/game/roundAssigner';

export function createPlanningConfigNoTime(): JsonPlanningConfig {
    return {
        id: 0,
        creationStrategy: CreationStrategy.staticPouleSize,
        extension: false,
        enableTime: false,
        minutesPerGame: 0,
        minutesPerGameExt: 0,
        minutesBetweenGames: 0,
        minutesAfter: 0,
        selfReferee: SelfReferee.Disabled
    }
}