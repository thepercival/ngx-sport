import { AgainstSide, JsonAgainstGame, GameState } from "../../../public-api";
import { jsonVoetbal, jsonBasketball, jsonHockey } from "../competition"; 

export const jsonGames4Places: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
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
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 4, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
        gameRoundNumber: 1,
        field: {
            id: 2,
            priority: 2,
            name: '2'
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
                place: { placeNr: 4, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
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
    }

    ,
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        field: {
            id: 2,
            priority: 2,
            name: '2'
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
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
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
    },
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 4, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        field: {
            id: 2,
            priority: 2,
            name: '2'
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

export const jsonGames4PlacesMultipleSports: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
        gameRoundNumber: 1,
        field: {
            id: 1,
            priority: 1,
            name: 'V1'
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
        id: 1,
        competitionSportId: jsonVoetbal.id,
        places: [
            {
                id: 0,
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 4, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 1,
        gameRoundNumber: 1,
        field: {
            id: 2,
            priority: 2,
            name: 'V2'
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
        id: 2,
        competitionSportId: jsonHockey.id,
        places: [
            {
                id: 0,
                place: { placeNr: 4, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        field: {
            id: 3,
            priority: 1,
            name: 'H1'
        },
        state: GameState.Created,
        startDateTime: '2021-06-11T11:00:00.000000Z',
        referee: undefined,
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
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 2,
        gameRoundNumber: 2,
        field: {
            id: 4,
            priority: 2,
            name: 'H2'
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
        competitionSportId: jsonBasketball.id,
        places: [
            {
                id: 0,
                place: { placeNr: 1, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 3, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        field: {
            id: 5,
            priority: 1,
            name: 'B1'
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
        competitionSportId: jsonBasketball.id,
        places: [
            {
                id: 0,
                place: { placeNr: 2, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Home
            },
            {
                id: 0,
                place: { placeNr: 4, pouleNr: 1, id: 0, extraPoints: 0, qualifiedPlaceLocation: undefined },
                side: AgainstSide.Away
            }
        ],
        batchNr: 3,
        gameRoundNumber: 3,
        field: {
            id: 6,
            priority: 2,
            name: 'B2'
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