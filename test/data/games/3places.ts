import { AgainstSide, GameMode, JsonAgainstGame, GameState, PointsCalculation } from "../../../public-api";
import { jsonVoetbal } from "../competition";

export const jsonGames3Places: JsonAgainstGame[] = [
    {
        id: 0,
        competitionSport: {
            id: 0,
            sport: jsonVoetbal,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfGamePlaces: 0,
            nrOfH2H: 1,
            nrOfGamesPerPlace: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: []
        },
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
        competitionSport: {
            id: 0,
            sport: jsonVoetbal,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfGamePlaces: 0,
            nrOfH2H: 1,
            nrOfGamesPerPlace: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: []
        },
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
        competitionSport: {
            id: 0,
            sport: jsonVoetbal,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfGamePlaces: 0,
            nrOfH2H: 1,
            nrOfGamesPerPlace: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: []
        },
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
