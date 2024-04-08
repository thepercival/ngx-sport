import { AgainstSide, JsonAgainstGame, GameState } from "../../../public-api";
import { jsonVoetbal, jsonBasketball, jsonHockey } from "../competition"; 

export const jsonGames4Places: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
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
        batchNr: 1,
        gameRoundNumber: 1,
        fieldId: 1,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
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
                placeNr: 3,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 4,
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
        gameRoundNumber: 1,
        fieldId: 2,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
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
                placeNr: 4,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 1,
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        fieldId: 1,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    }

    ,
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 2,
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        fieldId: 2,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
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
                placeNr: 1,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        fieldId: 1,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
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
                placeNr: 2,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 4,
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        fieldId: 2,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    }
];

export const jsonGames4PlacesMultipleSports: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
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
        batchNr: 1,
        gameRoundNumber: 1,
        fieldId: 1,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    },
    {
        id: 1,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 4,
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
        gameRoundNumber: 1,
        fieldId: 2,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    },
    {
        id: 2,
        competitionSportId: jsonHockey.id,
        places: [
            {
                id: 0,
                placeNr: 4,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 1,
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        fieldId: 3,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    }

    ,
    {
        id: 0,
        competitionSportId: jsonHockey.id,
        places: [
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 2,
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        fieldId: 4,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    },
    {
        id: 0,
        competitionSportId: jsonBasketball.id,
        places: [
            {
                id: 0,
                placeNr: 1,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 3,
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        fieldId: 5,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    },
    {
        id: 0,
        competitionSportId: jsonBasketball.id,
        places: [
            {
                id: 0,
                placeNr: 2,
                side: AgainstSide.Home
            },
            {
                id: 0,
                placeNr: 4,
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        fieldId: 6,
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        refereeId: undefined,
        refereeStructureLocation: undefined,
        scores: [],
        homeExtraPoints: 0,
        awayExtraPoints: 0
    }
];