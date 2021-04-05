import { AgainstSide, CustomSport, GameMode, JsonAgainstGame, State } from "../../../public_api";

export const jsonGames3Places: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSport: {
            id: 0,
            sport: {
                id: 0,
                name: 'voetbal',
                team: true,
                customId: CustomSport.Football,
                gameMode: GameMode.Against,
                nrOfGamePlaces: 2
            },
            fields: []
        },
        places: [
            {
                id: 0,
                placeNr: 2,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
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
    },
    {
        id: 0,
        competitionSport: {
            id: 0,
            sport: {
                id: 0,
                name: 'voetbal',
                team: true,
                customId: CustomSport.Football,
                gameMode: GameMode.Against,
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
        batchNr: 2,
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
    },
    {
        id: 0,
        competitionSport: {
            id: 0,
            sport: {
                id: 0,
                name: 'voetbal',
                team: true,
                customId: CustomSport.Football,
                gameMode: GameMode.Against,
                nrOfGamePlaces: 2
            },
            fields: []
        },
        places: [
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 1,
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
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
    }

];
