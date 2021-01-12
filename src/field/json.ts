import { JsonIdentifiable } from "../identifiable/json";

export interface JsonField extends JsonIdentifiable {
    priority: number;
    name: string | undefined;
}
