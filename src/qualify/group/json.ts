import { JsonRound } from "../../round/json";

export interface JsonQualifyGroup {
    id: number;
    winnersOrLosers: number;
    number: number;
    childRound: JsonRound;
}