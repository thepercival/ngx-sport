import { JsonStructure } from '../../src/structure/mapper';

export const jsonStructure16rank: JsonStructure = {
    'firstRoundNumber': {
        'id': 1448,
        'number': 1,
        'next': {
            'id': 1449,
            'number': 2,
            'next': {
                'id': 1450,
                'number': 3,
                'config': {
                    'id': 4138,
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
                        'id': 5174,
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
                'id': 4137,
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
                    'id': 5173,
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
            'id': 4136,
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
                'id': 5172,
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
        'id': 4151,
        'winnersOrLosers': 0,
        'qualifyOrder': 1,
        'childRounds': [
            {
                'id': 4152,
                'winnersOrLosers': 1,
                'qualifyOrder': 2,
                'childRounds': [
                    {
                        'id': 4153,
                        'winnersOrLosers': 1,
                        'qualifyOrder': 2,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 21785,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4542,
                                            'name': 'tiem'
                                        }
                                    },
                                    {
                                        'id': 21786,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4554,
                                            'name': 'kira'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76708,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 8,
                                        'startDateTime': '2018-12-26T00:15:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4542,
                                                        'name': 'tiem'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4554,
                                                        'name': 'kira'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4354,
                                                'number': 1,
                                                'home': 1,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7421,
                                'number': 1
                            },
                            {
                                'places': [
                                    {
                                        'id': 21787,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4546,
                                            'name': 'bart'
                                        }
                                    },
                                    {
                                        'id': 21788,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4549,
                                            'name': 'luuk'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76709,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 7,
                                        'startDateTime': '2018-12-25T23:50:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4546,
                                                        'name': 'bart'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'id': 21788,
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4549,
                                                        'name': 'luuk'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4353,
                                                'number': 1,
                                                'home': 0,
                                                'away': 2
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7422,
                                'number': 2
                            }
                        ]
                    },
                    {
                        'id': 4154,
                        'winnersOrLosers': 2,
                        'qualifyOrder': 2,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 21789,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4548,
                                            'name': 'huub'
                                        }
                                    },
                                    {
                                        'id': 21790,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4553,
                                            'name': 'mira'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76710,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 6,
                                        'startDateTime': '2018-12-25T23:25:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4548,
                                                        'name': 'huub'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'id': 21788,
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4553,
                                                        'name': 'mira'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4352,
                                                'number': 1,
                                                'home': 0,
                                                'away': 2
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7423,
                                'number': 1
                            },
                            {
                                'places': [
                                    {
                                        'id': 21791,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4544,
                                            'name': 'nova'
                                        }
                                    },
                                    {
                                        'id': 21792,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4551,
                                            'name': 'mats'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76711,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 5,
                                        'startDateTime': '2018-12-25T23:00:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4544,
                                                        'name': 'nova'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'id': 21788,
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4551,
                                                        'name': 'mats'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4351,
                                                'number': 1,
                                                'home': 2,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7424,
                                'number': 2
                            }
                        ]
                    }
                ],
                'poules': [
                    {
                        'places': [
                            {
                                'id': 21777,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4542,
                                    'name': 'tiem'
                                }
                            },
                            {
                                'id': 21778,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4546,
                                    'name': 'bart'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76700,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 8,
                                'startDateTime': '2018-12-25T20:55:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4542,
                                                'name': 'tiem'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'id': 21788,
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4546,
                                                'name': 'bart'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4346,
                                        'number': 1,
                                        'home': 2,
                                        'away': 0
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7417,
                        'number': 1
                    },
                    {
                        'places': [
                            {
                                'id': 21779,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4549,
                                    'name': 'luuk'
                                }
                            },
                            {
                                'id': 21780,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4554,
                                    'name': 'kira'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76701,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 7,
                                'startDateTime': '2018-12-25T20:30:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4549,
                                                'name': 'luuk'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'id': 21788,
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4554,
                                                'name': 'kira'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4345,
                                        'number': 1,
                                        'home': 0,
                                        'away': 2
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7418,
                        'number': 2
                    },
                    {
                        'places': [
                            {
                                'id': 21781,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4544,
                                    'name': 'nova'
                                }
                            },
                            {
                                'id': 21782,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4548,
                                    'name': 'huub'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76702,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 6,
                                'startDateTime': '2018-12-25T20:05:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4544,
                                                'name': 'nova'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'id': 21788,
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4548,
                                                'name': 'huub'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4344,
                                        'number': 1,
                                        'home': 0,
                                        'away': 2
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7419,
                        'number': 3
                    },
                    {
                        'places': [
                            {
                                'id': 21783,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4551,
                                    'name': 'mats'
                                }
                            },
                            {
                                'id': 21784,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4553,
                                    'name': 'mira'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76703,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 5,
                                'startDateTime': '2018-12-25T19:40:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4551,
                                                'name': 'mats'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'id': 21788,
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4553,
                                                'name': 'mira'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4343,
                                        'number': 1,
                                        'home': 0,
                                        'away': 2
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7420,
                        'number': 4
                    }
                ]
            },
            {
                'id': 4155,
                'winnersOrLosers': 2,
                'qualifyOrder': 2,
                'childRounds': [
                    {
                        'id': 4156,
                        'winnersOrLosers': 1,
                        'qualifyOrder': 2,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 21801,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4547,
                                            'name': 'stan'
                                        }
                                    },
                                    {
                                        'id': 21802,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4556,
                                            'name': 'bram'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76712,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 4,
                                        'startDateTime': '2018-12-25T22:35:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4547,
                                                        'name': 'stan'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4556,
                                                        'name': 'bram'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4350,
                                                'number': 1,
                                                'home': 0,
                                                'away': 1
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7429,
                                'number': 1
                            },
                            {
                                'places': [
                                    {
                                        'id': 21803,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4541,
                                            'name': 'maan'
                                        }
                                    },
                                    {
                                        'id': 21804,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4552,
                                            'name': 'mila'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76713,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 3,
                                        'startDateTime': '2018-12-25T22:10:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4541,
                                                        'name': 'maan'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4552,
                                                        'name': 'mila'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4349,
                                                'number': 1,
                                                'home': 2,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7430,
                                'number': 2
                            }
                        ]
                    },
                    {
                        'id': 4157,
                        'winnersOrLosers': 2,
                        'qualifyOrder': 2,
                        'childRounds': [],
                        'poules': [
                            {
                                'places': [
                                    {
                                        'id': 21805,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4543,
                                            'name': 'noud'
                                        }
                                    },
                                    {
                                        'id': 21806,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4550,
                                            'name': 'mart'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76714,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 2,
                                        'startDateTime': '2018-12-25T21:45:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4543,
                                                        'name': 'noud'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4550,
                                                        'name': 'mart'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4348,
                                                'number': 1,
                                                'home': 2,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7431,
                                'number': 1
                            },
                            {
                                'places': [
                                    {
                                        'id': 21807,
                                        'number': 1,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4545,
                                            'name': 'fred'
                                        }
                                    },
                                    {
                                        'id': 21808,
                                        'number': 2,
                                        'penaltyPoints': 0,
                                        'competitor': {
                                            'id': 4555,
                                            'name': 'toon'
                                        }
                                    }
                                ],
                                'games': [
                                    {
                                        'id': 76715,
                                        'roundNumber': 1,
                                        'subNumber': 1,
                                        'resourceBatch': 1,
                                        'startDateTime': '2018-12-25T21:20:00.000000Z',
                                        'poulePlaces': [
                                            {
                                                'poulePlace': {
                                                    'number': 1,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4545,
                                                        'name': 'fred'
                                                    }
                                                },
                                                homeaway: true
                                            },
                                            {
                                                'poulePlace': {
                                                    'number': 2,
                                                    'penaltyPoints': 0,
                                                    'competitor': {
                                                        'id': 4555,
                                                        'name': 'toon'
                                                    }
                                                },
                                                homeaway: false
                                            }
                                        ],
                                        'field': {
                                            'id': 2384,
                                            'name': '1',
                                            'number': 1
                                        },
                                        'state': 4,
                                        'scores': [
                                            {
                                                'id': 4347,
                                                'number': 1,
                                                'home': 1,
                                                'away': 0
                                            }
                                        ],
                                        'scoresMoment': 2
                                    }
                                ],
                                'id': 7432,
                                'number': 2
                            }
                        ]
                    }
                ],
                'poules': [
                    {
                        'places': [
                            {
                                'id': 21793,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4541,
                                    'name': 'maan'
                                }
                            },
                            {
                                'id': 21794,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4547,
                                    'name': 'stan'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76704,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 4,
                                'startDateTime': '2018-12-25T19:15:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4541,
                                                'name': 'maan'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4547,
                                                'name': 'stan'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4342,
                                        'number': 1,
                                        'home': 0,
                                        'away': 2
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7425,
                        'number': 1
                    },
                    {
                        'places': [
                            {
                                'id': 21795,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4552,
                                    'name': 'mila'
                                }
                            },
                            {
                                'id': 21796,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4556,
                                    'name': 'bram'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76705,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 3,
                                'startDateTime': '2018-12-25T18:50:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4552,
                                                'name': 'mila'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4556,
                                                'name': 'bram'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4341,
                                        'number': 1,
                                        'home': 0,
                                        'away': 2
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7426,
                        'number': 2
                    },
                    {
                        'places': [
                            {
                                'id': 21797,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4543,
                                    'name': 'noud'
                                }
                            },
                            {
                                'id': 21798,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4545,
                                    'name': 'fred'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76706,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 2,
                                'startDateTime': '2018-12-25T18:25:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4543,
                                                'name': 'noud'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4545,
                                                'name': 'fred'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4340,
                                        'number': 1,
                                        'home': 2,
                                        'away': 0
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7427,
                        'number': 3
                    },
                    {
                        'places': [
                            {
                                'id': 21799,
                                'number': 1,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4550,
                                    'name': 'mart'
                                }
                            },
                            {
                                'id': 21800,
                                'number': 2,
                                'penaltyPoints': 0,
                                'competitor': {
                                    'id': 4555,
                                    'name': 'toon'
                                }
                            }
                        ],
                        'games': [
                            {
                                'id': 76707,
                                'roundNumber': 1,
                                'subNumber': 1,
                                'resourceBatch': 1,
                                'startDateTime': '2018-12-25T18:00:00.000000Z',
                                'poulePlaces': [
                                    {
                                        'poulePlace': {
                                            'number': 1,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4550,
                                                'name': 'mart'
                                            }
                                        },
                                        homeaway: true
                                    },
                                    {
                                        'poulePlace': {
                                            'number': 2,
                                            'penaltyPoints': 0,
                                            'competitor': {
                                                'id': 4555,
                                                'name': 'toon'
                                            }
                                        },
                                        homeaway: false
                                    }
                                ],
                                'field': {
                                    'id': 2384,
                                    'name': '1',
                                    'number': 1
                                },
                                'state': 4,
                                'scores': [
                                    {
                                        'id': 4339,
                                        'number': 1,
                                        'home': 2,
                                        'away': 0
                                    }
                                ],
                                'scoresMoment': 2
                            }
                        ],
                        'id': 7428,
                        'number': 4
                    }
                ]
            }
        ],
        'poules': [
            {
                'places': [
                    {
                        'id': 21761,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4541,
                            'name': 'maan'
                        }
                    },
                    {
                        'id': 21762,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4542,
                            'name': 'tiem'
                        }
                    },
                    {
                        'id': 21763,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4543,
                            'name': 'noud'
                        }
                    },
                    {
                        'id': 21764,
                        'number': 4,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4544,
                            'name': 'nova'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 76676,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 1,
                        'startDateTime': '2018-12-25T08:00:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4541,
                                        'name': 'maan'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4544,
                                        'name': 'nova'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4315,
                                'number': 1,
                                'home': 0,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76677,
                        'roundNumber': 1,
                        'subNumber': 2,
                        'resourceBatch': 5,
                        'startDateTime': '2018-12-25T09:40:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4542,
                                        'name': 'tiem'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4543,
                                        'name': 'noud'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4319,
                                'number': 1,
                                'home': 2,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76678,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 9,
                        'startDateTime': '2018-12-25T11:20:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4541,
                                        'name': 'maan'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4542,
                                        'name': 'tiem'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4323,
                                'number': 1,
                                'home': 0,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76679,
                        'roundNumber': 2,
                        'subNumber': 2,
                        'resourceBatch': 13,
                        'startDateTime': '2018-12-25T13:00:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4543,
                                        'name': 'noud'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4544,
                                        'name': 'nova'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4327,
                                'number': 1,
                                'home': 2,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76680,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 17,
                        'startDateTime': '2018-12-25T14:40:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4543,
                                        'name': 'noud'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4541,
                                        'name': 'maan'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4331,
                                'number': 1,
                                'home': 2,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76681,
                        'roundNumber': 3,
                        'subNumber': 2,
                        'resourceBatch': 21,
                        'startDateTime': '2018-12-25T16:20:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4544,
                                        'name': 'nova'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4542,
                                        'name': 'tiem'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4335,
                                'number': 1,
                                'home': 1,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7413,
                'number': 1
            },
            {
                'places': [
                    {
                        'id': 21765,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4545,
                            'name': 'fred'
                        }
                    },
                    {
                        'id': 21766,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4546,
                            'name': 'bart'
                        }
                    },
                    {
                        'id': 21767,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4547,
                            'name': 'stan'
                        }
                    },
                    {
                        'id': 21768,
                        'number': 4,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4548,
                            'name': 'huub'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 76682,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 2,
                        'startDateTime': '2018-12-25T08:25:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4545,
                                        'name': 'fred'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4548,
                                        'name': 'huub'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4316,
                                'number': 1,
                                'home': 0,
                                'away': 1
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76683,
                        'roundNumber': 1,
                        'subNumber': 2,
                        'resourceBatch': 6,
                        'startDateTime': '2018-12-25T10:05:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4546,
                                        'name': 'bart'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4547,
                                        'name': 'stan'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4320,
                                'number': 1,
                                'home': 1,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76684,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 10,
                        'startDateTime': '2018-12-25T11:45:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4545,
                                        'name': 'fred'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4546,
                                        'name': 'bart'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4324,
                                'number': 1,
                                'home': 0,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76685,
                        'roundNumber': 2,
                        'subNumber': 2,
                        'resourceBatch': 14,
                        'startDateTime': '2018-12-25T13:25:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4547,
                                        'name': 'stan'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4548,
                                        'name': 'huub'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4328,
                                'number': 1,
                                'home': 2,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76686,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 18,
                        'startDateTime': '2018-12-25T15:05:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4547,
                                        'name': 'stan'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4545,
                                        'name': 'fred'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4332,
                                'number': 1,
                                'home': 3,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76687,
                        'roundNumber': 3,
                        'subNumber': 2,
                        'resourceBatch': 22,
                        'startDateTime': '2018-12-25T16:45:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4548,
                                        'name': 'huub'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4546,
                                        'name': 'bart'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4336,
                                'number': 1,
                                'home': 0,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7414,
                'number': 2
            },
            {
                'places': [
                    {
                        'id': 21769,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4549,
                            'name': 'luuk'
                        }
                    },
                    {
                        'id': 21770,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4550,
                            'name': 'mart'
                        }
                    },
                    {
                        'id': 21771,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4551,
                            'name': 'mats'
                        }
                    },
                    {
                        'id': 21772,
                        'number': 4,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4552,
                            'name': 'mila'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 76688,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 3,
                        'startDateTime': '2018-12-25T08:50:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4549,
                                        'name': 'luuk'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4552,
                                        'name': 'mila'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4317,
                                'number': 1,
                                'home': 1,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76689,
                        'roundNumber': 1,
                        'subNumber': 2,
                        'resourceBatch': 7,
                        'startDateTime': '2018-12-25T10:30:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4550,
                                        'name': 'mart'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4551,
                                        'name': 'mats'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4321,
                                'number': 1,
                                'home': 1,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76690,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 11,
                        'startDateTime': '2018-12-25T12:10:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4549,
                                        'name': 'luuk'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4550,
                                        'name': 'mart'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4325,
                                'number': 1,
                                'home': 2,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76691,
                        'roundNumber': 2,
                        'subNumber': 2,
                        'resourceBatch': 15,
                        'startDateTime': '2018-12-25T13:50:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4551,
                                        'name': 'mats'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4552,
                                        'name': 'mila'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4329,
                                'number': 1,
                                'home': 1,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76692,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 19,
                        'startDateTime': '2018-12-25T15:30:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4551,
                                        'name': 'mats'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4549,
                                        'name': 'luuk'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4333,
                                'number': 1,
                                'home': 0,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76693,
                        'roundNumber': 3,
                        'subNumber': 2,
                        'resourceBatch': 23,
                        'startDateTime': '2018-12-25T17:10:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4552,
                                        'name': 'mila'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4550,
                                        'name': 'mart'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4337,
                                'number': 1,
                                'home': 0,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7415,
                'number': 3
            },
            {
                'places': [
                    {
                        'id': 21773,
                        'number': 1,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4553,
                            'name': 'mira'
                        }
                    },
                    {
                        'id': 21774,
                        'number': 2,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4554,
                            'name': 'kira'
                        }
                    },
                    {
                        'id': 21775,
                        'number': 3,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4555,
                            'name': 'toon'
                        }
                    },
                    {
                        'id': 21776,
                        'number': 4,
                        'penaltyPoints': 0,
                        'competitor': {
                            'id': 4556,
                            'name': 'bram'
                        }
                    }
                ],
                'games': [
                    {
                        'id': 76694,
                        'roundNumber': 1,
                        'subNumber': 1,
                        'resourceBatch': 4,
                        'startDateTime': '2018-12-25T09:15:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4553,
                                        'name': 'mira'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4556,
                                        'name': 'bram'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4318,
                                'number': 1,
                                'home': 2,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76695,
                        'roundNumber': 1,
                        'subNumber': 2,
                        'resourceBatch': 8,
                        'startDateTime': '2018-12-25T10:55:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4554,
                                        'name': 'kira'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4555,
                                        'name': 'toon'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4322,
                                'number': 1,
                                'home': 2,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76696,
                        'roundNumber': 2,
                        'subNumber': 1,
                        'resourceBatch': 12,
                        'startDateTime': '2018-12-25T12:35:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4553,
                                        'name': 'mira'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4554,
                                        'name': 'kira'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4326,
                                'number': 1,
                                'home': 0,
                                'away': 2
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76697,
                        'roundNumber': 2,
                        'subNumber': 2,
                        'resourceBatch': 16,
                        'startDateTime': '2018-12-25T14:15:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4555,
                                        'name': 'toon'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4556,
                                        'name': 'bram'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4330,
                                'number': 1,
                                'home': 2,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76698,
                        'roundNumber': 3,
                        'subNumber': 1,
                        'resourceBatch': 20,
                        'startDateTime': '2018-12-25T15:55:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 3,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4555,
                                        'name': 'toon'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 1,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4553,
                                        'name': 'mira'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4334,
                                'number': 1,
                                'home': 0,
                                'away': 0
                            }
                        ],
                        'scoresMoment': 2
                    },
                    {
                        'id': 76699,
                        'roundNumber': 3,
                        'subNumber': 2,
                        'resourceBatch': 24,
                        'startDateTime': '2018-12-25T17:35:00.000000Z',
                        'poulePlaces': [
                            {
                                'poulePlace': {
                                    'number': 4,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4556,
                                        'name': 'bram'
                                    }
                                },
                                homeaway: true
                            },
                            {
                                'poulePlace': {
                                    'number': 2,
                                    'penaltyPoints': 0,
                                    'competitor': {
                                        'id': 4554,
                                        'name': 'kira'
                                    }
                                },
                                homeaway: false
                            }
                        ],
                        'field': {
                            'id': 2384,
                            'name': '1',
                            'number': 1
                        },
                        'state': 4,
                        'scores': [
                            {
                                'id': 4338,
                                'number': 1,
                                'home': 1,
                                'away': 3
                            }
                        ],
                        'scoresMoment': 2
                    }
                ],
                'id': 7416,
                'number': 4
            }
        ]
    }
};
