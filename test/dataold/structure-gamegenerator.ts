import { JsonStructure } from '../../src/structure/mapper';

export const jsonStructureGameGenerator: JsonStructure = {
    'firstRoundNumber': {
        'id': 2097,
        'number': 1,
        'config': {
            'id': 3978,
            'qualifyRule': 1,
            'nrOfHeadtohead': 1,
            'winPoints': 3,
            'drawPoints': 1,
            'hasExtension': false,
            'winPointsExt': 2,
            'drawPointsExt': 1,
            'minutesPerGameExt': 0,
            'enableTime': true,
            'minutesPerGame': 20,
            'minutesBetweenGames': 5,
            'minutesAfter': 5,
            'score': {
                'id': 4973,
                'name': 'goals',
                'direction': 1,
                'maximum': 0
            },
            'teamup': false,
            'pointsCalculation': 0,
            'selfReferee': false
        }
    },
    'rootRound': {
        'id': 4079,
        'winnersOrLosers': 0,
        'qualifyOrder': 1,
        'childRounds': [],
        'poules': [
            {
                'places': [
                    {
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'name': '01'
                        }
                    },
                    {
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'name': '02'
                        }
                    },
                    {
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'name': '03'
                        }
                    },
                    {
                        'number': 4,
                        'penaltyPoints': 0,
                        'competitor': {
                            'name': '04'
                        }
                    }
                ],
                'games': [],
                'number': 1
            }
        ]
    }
};
