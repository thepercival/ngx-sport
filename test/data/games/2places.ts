import { GameMode, JsonAgainstGame, State } from "../../../public_api";


export const jsonGames2Places: JsonAgainstGame[] = [{
    id: 0,
    batchNr: 1,
    competitionSport: {
        id: 0,
        sport: {
            id: 0,
            gameMode: GameMode.Against,
            name: 'voetbal',
            team: true,
            customId: 11,
            nrOfGamePlaces: 2
        },
        fields: []
    },
    places: [
        {
            id: 0,
            placeNr: 1,
            homeaway: true
        },
        {
            id: 0,
            placeNr: 2,
            homeaway: false
        }
    ],
    fieldPriority: 1,
    state: State.Created,
    startDateTime: undefined,
    refereePriority: undefined,
    refereePlaceLocId: undefined,
    scores: []
}];