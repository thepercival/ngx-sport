import { AgainstSide, CustomSport, GameMode, JsonAgainstGame, State } from "../../../public_api";


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
            customId: CustomSport.Football,
            nrOfGamePlaces: 2
        },
        fields: []
    },
    places: [
        {
            id: 0,
            placeNr: 1,
            side: AgainstSide.Home
        },
        {
            id: 0,
            placeNr: 2,
            side: AgainstSide.Away
        }
    ],
    field: {
        id: 1,
        priority: 1,
        name: '1'
    },
    state: State.Created,
    startDateTime: undefined,
    referee: undefined,
    refereePlaceLocation: undefined,
    scores: []
}];