import { GamePhase } from "../game/phase";
import { JsonIdentifiable } from "../identifiable/json";

export interface JsonScore extends JsonIdentifiable {
    phase: GamePhase;
    number: number;
}