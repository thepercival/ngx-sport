import { GameMode } from "../../planning/gameMode";

export interface JsonPersistSportVariant {
    gameMode: GameMode;
    nrOfHomePlaces: number;
    nrOfAwayPlaces: number;
    nrOfH2H: number;
    nrOfGamePlaces: number;
    gameAmount: number;
}