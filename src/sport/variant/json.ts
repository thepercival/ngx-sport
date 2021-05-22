import { GameMode } from "../../planning/gameMode";

export interface JsonPersistSportVariant {
    gameMode: GameMode;
    nrOfHomePlaces: number;
    nrOfAwayPlaces: number;
    nrOfGamePlaces: number;
    nrOfH2H: number;
    nrOfGamesPerPlace: number;
}