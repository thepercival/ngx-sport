export interface JsonPlanningConfig {
    id?: number;
    extension: boolean;
    enableTime: boolean;
    minutesPerGame: number;
    minutesPerGameExt: number;
    minutesBetweenGames: number;
    minutesAfter: number;
    teamup: boolean;
    selfReferee: boolean;
    nrOfHeadtohead: number;
}