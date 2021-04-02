import { JsonIdentifiable } from "../../identifiable/json";
import { JsonRound } from "../../round/json";
import { QualifyTarget } from "../target";

export interface JsonQualifyGroup extends JsonIdentifiable {
    target: QualifyTarget;
    number: number;
    childRound: JsonRound;
}