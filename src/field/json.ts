import { Identifiable } from "src/identifiable";
import { JsonIdentifiable } from "src/identifiable/json";

export interface JsonField extends JsonIdentifiable {
    priority: number;
    name: string | undefined;
}
