
import { JsonPlanningConfig } from "../../planning/config/json";
import { JsonGameAmountConfig } from "../../planning/gameAmountConfig/json";

export interface JsonRoundNumber {
    id: number;
    number: number;
    planningConfig?: JsonPlanningConfig;
    gameAmountConfigs?: JsonGameAmountConfig[];
    next?: JsonRoundNumber;
}