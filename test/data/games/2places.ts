import { AgainstSide, CustomSport, GameMode, JsonAgainstGame, State } from "../../../public_api";


export const jsonGames2Places: JsonAgainstGame[] = [{
    id: 0,
    batchNr: 1,
    competitionSport: {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: CustomSport.Football,
            defaultGameMode: GameMode.Against,
            defaultNrOfSidePlaces: 1
        },
        gameMode: GameMode.Against,
        nrOfHomePlaces: 1,
        nrOfAwayPlaces: 1,
        nrOfGamePlaces: 0,
        nrOfH2H: 1,
        nrOfGamesPerPlace: 0,
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