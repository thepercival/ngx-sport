import { AgainstSide, JsonAgainstGame, GameState } from "../../../public-api";
import { jsonVoetbal } from "../competition";

export const jsonGames3Places: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlace: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlace: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
        gameRoundNumber: 1,
        field: {
            id: 1,
            priority: 1,
            name: '1'
        },
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        referee: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    },
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlace: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlace: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        field: {
            id: 1,
            priority: 1,
            name: '1'
        },
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        referee: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    },
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlace: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlace: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        field: {
            id: 1,
            priority: 1,
            name: '1'
        },
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        referee: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    }

];
