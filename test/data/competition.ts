
import { JsonCompetition } from "../../src/competition/json";
import { GameMode } from "../../src/planning/gameMode";
import { AgainstRuleSet } from "../../src/ranking/againstRuleSet";
import { PointsCalculation } from "../../src/ranking/pointsCalculation";
import { JsonSport } from "../../src/sport/json";


export const jsonVoetbal: JsonSport = {
    id: 0,
    name: 'voetbal',
    team: true,
    customId: 0,
    defaultGameMode: GameMode.Against,
    defaultNrOfSidePlaces: 1
};

export const jsonHockey: JsonSport = {
    id: 0,
    name: 'hockey',
    team: true,
    customId: 0,
    defaultGameMode: GameMode.Against,
    defaultNrOfSidePlaces: 1
};

export const jsonBasketball: JsonSport = {
    id: 0,
    name: 'basketbal',
    team: true,
    customId: 0,
    defaultGameMode: GameMode.Against,
    defaultNrOfSidePlaces: 1
};

export const jsonBaseCompetition: JsonCompetition = {
    id: 0,
    league: {
        id: 0,
        name: 'ssaxasx',
        association: {
            id: 0,
            name: 'username'
        }
    },
    season: {
        id: 0,
        name: '123',
        start: '2018-12-17T11:33:15.710Z',
        end: '2018-12-17T11:33:15.710Z'
    },
    sports: [
        {
            id: 0,
            sport: jsonVoetbal,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfH2H: 1,
            nrOfGamesPerPlace: 0,
            nrOfGamePlaces: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: [
                {
                    id: 1,
                    priority: 1,
                    name: '1'
                },
                {
                    id: 2,
                    priority: 2,
                    name: '2'
                }
            ],
        }],
    referees: [],
    startDateTime: '2030-01-01T12:00:00.000Z',
    againstRuleSet: AgainstRuleSet.DiffFirst
};

export const jsonMultiSportsCompetition: JsonCompetition = {
    id: 0,
    league: {
        id: 0,
        name: 'ssaxasx',
        association: {
            id: 0,
            name: 'username'
        }
    },
    season: {
        id: 0,
        name: '123',
        start: '2018-12-17T11:33:15.710Z',
        end: '2018-12-17T11:33:15.710Z'
    },
    sports: [
        {
            id: 1,
            sport: jsonVoetbal,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfH2H: 0,
            nrOfGamesPerPlace: 1,
            nrOfGamePlaces: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: [
                {
                    id: 1,
                    priority: 1,
                    name: 'V1'
                },
                {
                    id: 2,
                    priority: 2,
                    name: 'V2'
                }
            ],
        },
        {
            id: 2,
            sport: jsonHockey,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfH2H: 0,
            nrOfGamesPerPlace: 1,
            nrOfGamePlaces: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: [
                {
                    id: 3,
                    priority: 3,
                    name: 'H1'
                },
                {
                    id: 4,
                    priority: 4,
                    name: 'H2'
                }
            ],
        },
        {
            id: 3,
            sport: jsonBasketball,
            gameMode: GameMode.Against,
            nrOfHomePlaces: 1,
            nrOfAwayPlaces: 1,
            nrOfH2H: 0,
            nrOfGamesPerPlace: 1,
            nrOfGamePlaces: 0,
            defaultPointsCalculation: PointsCalculation.AgainstGamePoints,
            defaultWinPoints: 3,
            defaultDrawPoints: 1,
            defaultWinPointsExt: 2,
            defaultDrawPointsExt: 1,
            defaultLosePointsExt: 0,
            fields: [
                {
                    id: 5,
                    priority: 5,
                    name: 'B1'
                },
                {
                    id: 6,
                    priority: 6,
                    name: 'B2'
                }
            ],
        }],
    referees: [],
    startDateTime: '2030-01-01T12:00:00.000Z',
    againstRuleSet: AgainstRuleSet.DiffFirst
};