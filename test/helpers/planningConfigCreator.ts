import { JsonPlanningConfig, SelfReferee } from '../../public_api';

export function createPlanningConfigNoTime(): JsonPlanningConfig {
    return {
        id: 0,
        extension: false,
        enableTime: false,
        minutesPerGame: 0,
        minutesPerGameExt: 0,
        minutesBetweenGames: 0,
        minutesAfter: 0,
        selfReferee: SelfReferee.Disabled
    }
}