import { JsonCompetition } from '../../src/competition/mapper';
import { RankingService } from '../../src/ranking/service';

export const jsonCompetition: JsonCompetition = {
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
    'sports': [
        {
            'id': 2,
            'name': 'voetbal',
            'team': true,
            'customId': 11,
            'nrOfGameCompetitors': 2
        }
    ],
    'fields': [
        {
            'sportId': 2,
            'number': 1,
            'name': '1'
        }
    ],
    'referees': [],
    'startDateTime': '2018-12-17T12:00:00.000Z',
    'state': 1,
    'ruleSet': RankingService.RULESSET_WC
};
