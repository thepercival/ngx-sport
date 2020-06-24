import { JsonCompetition } from '../../src/competition/json';
import { RankingService } from '../../src/ranking/service';
import { SportConfig } from '../../src/sport/config';

export const jsonBaseCompetition: JsonCompetition = {
    'league': {
        'name': 'ssaxasx',
        'association': {
            'name': 'username'
        }
    },
    'season': {
        'name': '123',
        'startDateTime': '2018-12-17T11:33:15.710Z',
        'endDateTime': '2018-12-17T11:33:15.710Z'
    },
    'sportConfigs': [
        {
            'winPoints': 3.0,
            'drawPoints': 1.0,
            'winPointsExt': 2.0,
            'drawPointsExt': 1.0,
            'losePointsExt': 0.0,
            'nrOfGamePlaces': SportConfig.DEFAULT_NROFGAMEPLACES,
            'pointsCalculation': SportConfig.POINTS_CALC_GAMEPOINTS,
            'sport': {
                'name': 'voetbal',
                'team': true,
                'customId': 11
            },
            'fields': [
                {
                    'priority': 1,
                    'name': '1'
                },
                {
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
