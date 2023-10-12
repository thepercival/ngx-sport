import { JsonIdentifiable } from "../../identifiable/json";
import { JsonRound } from "../../round/json";
import { QualifyDistribution } from "../distribution";
import { QualifyTarget } from "../target";

export interface JsonQualifyGroup extends JsonIdentifiable {
    target: QualifyTarget;
    distribution: QualifyDistribution;
    number: number;
    childRound: JsonRound;
}