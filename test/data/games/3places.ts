import { GameMode, JsonAgainstGame, State } from "../../../public_api";

export const jsonGames3Places: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSport: {
            id: 0,
            sport: {
                id: 0,
                name: 'voetbal',
                team: true,
                customId: 11,
                gameMode: GameMode.Against,
                nrOfGamePlaces: 2
            },
            fields: []
        },
        places: [
            {
                id: 0,
                placeNr: 2,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 3,
                homeaway: false
            }
        ],
        batchNr: 1,
        fieldPriority: 1,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
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
                customId: 11,
                gameMode: GameMode.Against,
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
        batchNr: 2,
        fieldPriority: 1,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
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
                customId: 11,
                gameMode: GameMode.Against,
                nrOfGamePlaces: 2
            },
            fields: []
        },
        places: [
            {
                id: 0,
                placeNr: 3,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 1,
                homeaway: false
            }
        ],
        batchNr: 3,
        fieldPriority: 1,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    }

];
