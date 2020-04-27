import { JsonRoundNumber } from "../round/number/json";
import { JsonRound } from "../round/json";

export interface JsonStructure {
    firstRoundNumber: JsonRoundNumber;
    rootRound: JsonRound;
}