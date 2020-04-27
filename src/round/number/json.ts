import { JsonPlanningConfig } from "../../planning/config/json";
import { JsonSportScoreConfig } from "../../sport/scoreconfig/mapper";

export interface JsonRoundNumber {
    id?: number;
    number: number;
    hasPlanning?: boolean;
    planningConfig?: JsonPlanningConfig;
    sportScoreConfigs?: JsonSportScoreConfig[];
    next?: JsonRoundNumber;
}