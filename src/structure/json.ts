import { JsonRoundNumber } from "../round/number/json";
import { JsonCategory } from "../category/json";

export interface JsonStructure {
    categories: JsonCategory[];
    firstRoundNumber: JsonRoundNumber;
}