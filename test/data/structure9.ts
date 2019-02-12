import { JsonStructure } from '../../src/structure/mapper';

export const jsonStructure9: JsonStructure = {
    'firstRoundNumber': {
        'id': 2097,
        'number': 1,
        'next': {
            'id': 2098,
            'number': 2,
            'next': {
                'id': 2099,
                'number': 3,
                'config': {
                    'id': 3980,
                    'qualifyRule': 1,
                    'nrOfHeadtoheadMatches': 1,
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
                        'id': 4975,
                        'name': 'goals',
                        'direction': 1,
                        'maximum': 0
                    },
                    'teamup': false,
                    'pointsCalculation': 0,
                    'selfReferee': false
                }
            },
            'config': {
                'id': 3979,
                'qualifyRule': 1,
                'nrOfHeadtoheadMatches': 1,
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
                    'id': 4974,
                    'name': 'goals',
                    'direction': 1,
                    'maximum': 0
                },
                'teamup': false,
                'pointsCalculation': 0,
                'selfReferee': false
            }
        },
        'config': {
            'id': 3978,
            'qualifyRule': 1,
            'nrOfHeadtoheadMatches': 1,
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
        'childRounds': [
            {
                'id': 4080,
                'winnersOrLosers': 1,
                'qualifyOrder': 1,
                'childRounds': [
                    {
                        'id': 4081,
                        'winnersOrLosers': 1,
                        'qualifyOrder': 1,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 20280,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4063,
                                            'name': 'max'
                                        }
                                    },
                                    {
                                        'id': 20281,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4066,
                                            'name': 'jil'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 70100,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 1,
                                        'startDateTime': '2018-12-17T17:25:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                poulePlaceNr: 1,
                                                homeaway: true
                                            },
                                            {
                                                poulePlaceNr: 2,
                                                homeaway: false
                                            }
                                        ],
                                        'fieldNr': 1,
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 3753,
                                                'number': 1,
                                                'home': 0,
                                                'away': 1
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7081,
                                'number': 1
                            }
                        ]
                    },
                    {
                        'id': 4082,
                        'winnersOrLosers': 2,
                        'qualifyOrder': 1,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 20282,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4067,
                                            'name': 'zed'
                                        }
                                    },
                                    {
                                        'id': 20283,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4065,
                                            'name': 'jip'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 70101,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 2,
                                        'startDateTime': '2018-12-17T17:50:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                poulePlaceNr: 1,
                                                homeaway: true
                                            },
                                            {
                                                poulePlaceNr: 2,
                                                homeaway: false
                                            }
                                        ],
                                        'fieldNr': 1,
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 3754,
                                                'number': 1,
                                                'home': 1,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7082,
                                'number': 1
                            }
                        ]
                    }
                ],
                'poules': [
                    {
                        'places': [
                            {
                                'id': 20276,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4063,
                                    'name': 'max'
                                }
                            },
                            {
                                'id': 20277,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4067,
                                    'name': 'zed'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 70096,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 3,
                                'startDateTime': '2018-12-17T16:35:00.000000Z',
                                'poulePlaces': [
                                    {
                                        poulePlaceNr: 1,
                                        homeaway: true
                                    },
                                    {
                                        poulePlaceNr: 2,
                                        homeaway: false
                                    }
                                ],
                                'fieldNr': 1,
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 3751,
                                        'number': 1,
                                        'home': 2,
                                        'away': 0
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7079,
                        'number': 1
                    },
                    {
                        'places': [
                            {
                                'id': 20278,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4065,
                                    'name': 'jip'
                                }
                            },
                            {
                                'id': 20279,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4066,
                                    'name': 'jil'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 70097,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 1,
                                'startDateTime': '2018-12-17T15:45:00.000000Z',
                                'poulePlaces': [
                                    {
                                        poulePlaceNr: 1,
                                        homeaway: true
                                    },
                                    {
                                        poulePlaceNr: 2,
                                        homeaway: false
                                    }
                                ],
                                'fieldNr': 1,
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 3749,
                                        'number': 1,
                                        'home': 0,
                                        'away': 1
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7080,
                        'number': 2
                    }
                ]
            },
            {
                'id': 4083,
                'winnersOrLosers': 2,
                'qualifyOrder': 1,
                'childRounds': [
                    {
                        'id': 4084,
                        'winnersOrLosers': 1,
                        'qualifyOrder': 1,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 20288,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4069,
                                            'name': 'jos'
                                        }
                                    },
                                    {
                                        'id': 20289,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4062,
                                            'name': 'wim'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 70102,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 3,
                                        'startDateTime': '2018-12-17T18:15:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                poulePlaceNr: 1,
                                                homeaway: true
                                            },
                                            {
                                                poulePlaceNr: 2,
                                                homeaway: false
                                            }
                                        ],
                                        'fieldNr': 1,
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 3755,
                                                'number': 1,
                                                'home': 1,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7085,
                                'number': 1
                            }
                        ]
                    },
                    {
                        'id': 4085,
                        'winnersOrLosers': 2,
                        'qualifyOrder': 1,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 20290,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4068,
                                            'name': 'cor'
                                        }
                                    },
                                    {
                                        'id': 20291,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4070,
                                            'name': 'pim'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 70103,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 4,
                                        'startDateTime': '2018-12-17T18:40:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                poulePlaceNr: 1,
                                                homeaway: true
                                            },
                                            {
                                                poulePlaceNr: 2,
                                                homeaway: false
                                            }
                                        ],
                                        'fieldNr': 1,
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 3756,
                                                'number': 1,
                                                'home': 1,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7086,
                                'number': 1
                            }
                        ]
                    }
                ],
                'poules': [
                    {
                        'places': [
                            {
                                'id': 20284,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4068,
                                    'name': 'cor'
                                }
                            },
                            {
                                'id': 20285,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4069,
                                    'name': 'jos'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 70098,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 4,
                                'startDateTime': '2018-12-17T17:00:00.000000Z',
                                'poulePlaces': [
                                    {
                                        poulePlaceNr: 1,
                                        homeaway: true
                                    },
                                    {
                                        poulePlaceNr: 2,
                                        homeaway: false
                                    }
                                ],
                                'fieldNr': 1,
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 3752,
                                        'number': 1,
                                        'home': 0,
                                        'away': 1
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7083,
                        'number': 1
                    },
                    {
                        'places': [
                            {
                                'id': 20286,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4062,
                                    'name': 'wim'
                                }
                            },
                            {
                                'id': 20287,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4070,
                                    'name': 'pim'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 70099,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 2,
                                'startDateTime': '2018-12-17T16:10:00.000000Z',
                                'poulePlaces': [
                                    {
                                        poulePlaceNr: 1,
                                        homeaway: true
                                    },
                                    {
                                        poulePlaceNr: 2,
                                        homeaway: false
                                    }
                                ],
                                'fieldNr': 1,
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 3750,
                                        'number': 1,
                                        'home': 2,
                                        'away': 0
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7084,
                        'number': 2
                    }
                ]
            }
        ],
        'poules': [
            {
                'places': [
                    {
                        'id': 20267,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4062,
                            'name': 'wim'
                        }
                    },
                    {
                        'id': 20268,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4063,
                            'name': 'max'
                        }
                    },
                    {
                        'id': 20269,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4064,
                            'name': 'jan'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 70087,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 1,
                        'startDateTime': '2018-12-17T12:00:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 2,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 3,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3741,
                                'number': 1,
                                'home': 5,
                                'away': 1
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 70088,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 4,
                        'startDateTime': '2018-12-17T13:15:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 1,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 2,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3744,
                                'number': 1,
                                'home': 0,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 70089,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 7,
                        'startDateTime': '2018-12-17T14:30:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 3,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 1,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3746,
                                'number': 1,
                                'home': 4,
                                'away': 1
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7076,
                'number': 1
            },
            {
                'places': [
                    {
                        'id': 20270,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4065,
                            'name': 'jip'
                        }
                    },
                    {
                        'id': 20271,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4066,
                            'name': 'jil'
                        }
                    },
                    {
                        'id': 20272,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4069,
                            'name': 'jos'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 70090,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 2,
                        'startDateTime': '2018-12-17T12:25:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 2,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 3,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3742,
                                'number': 1,
                                'home': 6,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 70091,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 5,
                        'startDateTime': '2018-12-17T13:40:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 1,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 2,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3736,
                                'number': 1,
                                'home': 3,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 70092,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 8,
                        'startDateTime': '2018-12-17T14:55:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 3,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 1,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3747,
                                'number': 1,
                                'home': 1,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7077,
                'number': 2
            },
            {
                'places': [
                    {
                        'id': 20273,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4067,
                            'name': 'zed'
                        }
                    },
                    {
                        'id': 20274,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4068,
                            'name': 'cor'
                        }
                    },
                    {
                        'id': 20275,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4070,
                            'name': 'pim'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 70093,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 3,
                        'startDateTime': '2018-12-17T12:50:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 2,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 3,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3743,
                                'number': 1,
                                'home': 0,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 70094,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 6,
                        'startDateTime': '2018-12-17T14:05:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 1,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 2,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3745,
                                'number': 1,
                                'home': 1,
                                'away': 1
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 70095,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 9,
                        'startDateTime': '2018-12-17T15:20:00.000000Z',
                        'poulePlaces': [
                            {
                                poulePlaceNr: 3,
                                homeaway: true
                            },
                            {
                                poulePlaceNr: 1,
                                homeaway: false
                            }
                        ],
                        'fieldNr': 1,
                        'state': 4,
                        'scores': [
                            {
                                'id': 3748,
                                'number': 1,
                                'home': 1,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7078,
                'number': 3
            }
        ]
    }
};
