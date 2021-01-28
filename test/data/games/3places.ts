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
                homeAway: true
            },
            {
                id: 0,
                placeNr: 3,
                homeAway: false
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
                homeAway: true
            },
            {
                id: 0,
                placeNr: 2,
                homeAway: false
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
                homeAway: true
            },
            {
                id: 0,
                placeNr: 1,
                homeAway: false
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
