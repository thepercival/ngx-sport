import { JsonIdentifiable } from "../identifiable/json";
import { JsonRound } from "../round/json";
import { JsonStructureCell } from "../structure/cell/json";
export interface JsonCategory extends JsonIdentifiable {
    name: string,
    number: number,
    firstStructureCell: JsonStructureCell;
    rootRound: JsonRound;
}