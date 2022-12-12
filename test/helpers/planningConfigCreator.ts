import { JsonPlanningConfig, SelfReferee } from '../../public-api';
import { PlanningEditMode } from '../../src/planning/editMode';
import { GamePlaceStrategy } from '../../src/planning/strategy';

export function createPlanningConfigNoTime(): JsonPlanningConfig {
    return {
        id: 0,
        editMode: PlanningEditMode.Auto,
        gamePlaceStrategy: GamePlaceStrategy.EquallyAssigned,
        extension: false,
        enableTime: false,
        minutesPerGame: 0,
        minutesPerGameExt: 0,
        minutesBetweenGames: 0,
        minutesAfter: 0,
        perPoule: false,
        selfReferee: SelfReferee.Disabled
    }
}