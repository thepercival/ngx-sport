import { JsonCompetition } from '../../src/competition/json';
import { RankingService } from '../../src/ranking/service';

export const jsonBaseCompetition: JsonCompetition = {
    'id': 0,
    'league': {
        'id': 0,
        'name': 'ssaxasx',
        'association': {
            'id': 0,
            'name': 'username'
        }
    },
    'season': {
        'id': 0,
        'name': '123',
        'start': '2018-12-17T11:33:15.710Z',
        'end': '2018-12-17T11:33:15.710Z'
    },
    'sportConfigs': [
        {
            'id': 0,
            'winPoints': 3.0,
            'drawPoints': 1.0,
            'winPointsExt': 2.0,
            'drawPointsExt': 1.0,
            'losePointsExt': 0.0,
            'nrOfGamePlaces': SportConfig.Default_NrOfGamePlaces,
            'pointsCalculation': SportConfig.Points_Calc_GamePoints,
            'sport': {
                'id': 0,
                'name': 'voetbal',
                'team': true,
                'customId': 11
            },
            'fields': [
                {
                    'id': 0,
                    'priority': 1,
                    'name': '1'
                },
                {
                    'id': 0,
                    'priority': 2,
                    'name': '2'
                }
            ],
        }],
    'referees': [],
    'startDateTime': '2030-01-01T12:00:00.000Z',
    'state': 1,
    'ruleSet': RankingService.RULESSET_WC
};
