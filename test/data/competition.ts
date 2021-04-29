import { CustomSport, GameMode, JsonCompetition, RankingRuleSet } from "../../public_api";

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
            nrOfH2H: 1,
            nrOfPartials: 0,
            nrOfGamePlaces: 0,
            nrOfGamesPerPlace: 0,
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
    state: 1,
    rankingRuleSet: RankingRuleSet.Against
};