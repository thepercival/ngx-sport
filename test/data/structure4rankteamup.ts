import { JsonStructure } from '../../src/structure/mapper';

export const jsonStructure4rankteamup: JsonStructure = {
    "firstRoundNumber": {
        "id": 2691,
        "number": 1,
        "config": {
            "id": 4770,
            "qualifyRule": 1,
            "nrOfHeadtoheadMatches": 2,
            "winPoints": 3.0,
            "drawPoints": 1.0,
            "hasExtension": false,
            "winPointsExt": 2.0,
            "drawPointsExt": 1.0,
            "minutesPerGameExt": 0,
            "enableTime": true,
            "minutesPerGame": 20,
            "minutesBetweenGames": 5,
            "minutesAfter": 5,
            "score": {
                "id": 6090,
                "parent": {
                    "id": 6089,
                    "name": "sets",
                    "direction": 1,
                    "maximum": 0
                },
                "name": "punten",
                "direction": 1,
                "maximum": 15
            },
            "teamup": true,
            "pointsCalculation": 0,
            'selfReferee': false
        }
    },
    "rootRound": {
        "id": 5068,
        "winnersOrLosers": 0,
        "qualifyOrder": 1,
        "childRounds": [],
        "poules": [
            {
                "places": [
                    {
                        "id": 29105,
                        "number": 1,
                        "penaltyPoints": 0,
                        "team": {
                            "id": 5882,
                            "name": "rank4"
                        }
                    },
                    {
                        "id": 29106,
                        "number": 2,
                        "penaltyPoints": 0,
                        "team": {
                            "id": 5884,
                            "name": "rank3"
                        }
                    },
                    {
                        "id": 29107,
                        "number": 3,
                        "penaltyPoints": 0,
                        "team": {
                            "id": 5883,
                            "name": "rank2"
                        }
                    },
                    {
                        "id": 29108,
                        "number": 4,
                        "penaltyPoints": 0,
                        "team": {
                            "id": 5885,
                            "name": "rank1"
                        }
                    }
                ],
                "games": [
                    {
                        "id": 101838,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 1,
                        "startDateTime": "2019-02-02T19:00:00.000000Z",
                        "field": {
                            "id": 3127,
                            "name": "1",
                            "number": 1
                        },
                        "state": 4,
                        "scores": [
                            {
                                "id": 6058,
                                "number": 1,
                                "home": 2,
                                "away": 2
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 68687,
                                "poulePlace": {
                                    "id": 29105,
                                    "number": 1,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5882,
                                        "name": "rank4"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68689,
                                "poulePlace": {
                                    "id": 29106,
                                    "number": 2,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5884,
                                        "name": "rank3"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68690,
                                "poulePlace": {
                                    "id": 29107,
                                    "number": 3,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5883,
                                        "name": "rank2"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68688,
                                "poulePlace": {
                                    "id": 29108,
                                    "number": 4,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5885,
                                        "name": "rank1"
                                    }
                                },
                                "homeaway": true
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 101839,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 2,
                        "startDateTime": "2019-02-02T19:25:00.000000Z",
                        "field": {
                            "id": 3127,
                            "name": "1",
                            "number": 1
                        },
                        "state": 4,
                        "scores": [
                            {
                                "id": 6064,
                                "number": 1,
                                "home": 2,
                                "away": 3
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 68691,
                                "poulePlace": {
                                    "id": 29105,
                                    "number": 1,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5882,
                                        "name": "rank4"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68692,
                                "poulePlace": {
                                    "id": 29106,
                                    "number": 2,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5884,
                                        "name": "rank3"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68693,
                                "poulePlace": {
                                    "id": 29107,
                                    "number": 3,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5883,
                                        "name": "rank2"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68694,
                                "poulePlace": {
                                    "id": 29108,
                                    "number": 4,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5885,
                                        "name": "rank1"
                                    }
                                },
                                "homeaway": false
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 101840,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 3,
                        "startDateTime": "2019-02-02T19:50:00.000000Z",
                        "field": {
                            "id": 3127,
                            "name": "1",
                            "number": 1
                        },
                        "state": 4,
                        "scores": [
                            {
                                "id": 6059,
                                "number": 1,
                                "home": 1,
                                "away": 1
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 68695,
                                "poulePlace": {
                                    "id": 29105,
                                    "number": 1,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5882,
                                        "name": "rank4"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68697,
                                "poulePlace": {
                                    "id": 29106,
                                    "number": 2,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5884,
                                        "name": "rank3"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68696,
                                "poulePlace": {
                                    "id": 29107,
                                    "number": 3,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5883,
                                        "name": "rank2"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68698,
                                "poulePlace": {
                                    "id": 29108,
                                    "number": 4,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5885,
                                        "name": "rank1"
                                    }
                                },
                                "homeaway": false
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 101841,
                        "roundNumber": 4,
                        "subNumber": 1,
                        "resourceBatch": 4,
                        "startDateTime": "2019-02-02T20:15:00.000000Z",
                        "field": {
                            "id": 3127,
                            "name": "1",
                            "number": 1
                        },
                        "state": 4,
                        "scores": [
                            {
                                "id": 6065,
                                "number": 1,
                                "home": 3,
                                "away": 3
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 68700,
                                "poulePlace": {
                                    "id": 29105,
                                    "number": 1,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5882,
                                        "name": "rank4"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68702,
                                "poulePlace": {
                                    "id": 29106,
                                    "number": 2,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5884,
                                        "name": "rank3"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68701,
                                "poulePlace": {
                                    "id": 29107,
                                    "number": 3,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5883,
                                        "name": "rank2"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68699,
                                "poulePlace": {
                                    "id": 29108,
                                    "number": 4,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5885,
                                        "name": "rank1"
                                    }
                                },
                                "homeaway": false
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 101842,
                        "roundNumber": 5,
                        "subNumber": 1,
                        "resourceBatch": 5,
                        "startDateTime": "2019-02-02T20:40:00.000000Z",
                        "field": {
                            "id": 3127,
                            "name": "1",
                            "number": 1
                        },
                        "state": 4,
                        "scores": [
                            {
                                "id": 6056,
                                "number": 1,
                                "home": 2,
                                "away": 0
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 68704,
                                "poulePlace": {
                                    "id": 29105,
                                    "number": 1,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5882,
                                        "name": "rank4"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68703,
                                "poulePlace": {
                                    "id": 29106,
                                    "number": 2,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5884,
                                        "name": "rank3"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68706,
                                "poulePlace": {
                                    "id": 29107,
                                    "number": 3,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5883,
                                        "name": "rank2"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68705,
                                "poulePlace": {
                                    "id": 29108,
                                    "number": 4,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5885,
                                        "name": "rank1"
                                    }
                                },
                                "homeaway": true
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 101843,
                        "roundNumber": 6,
                        "subNumber": 1,
                        "resourceBatch": 6,
                        "startDateTime": "2019-02-02T21:05:00.000000Z",
                        "field": {
                            "id": 3127,
                            "name": "1",
                            "number": 1
                        },
                        "state": 4,
                        "scores": [
                            {
                                "id": 6063,
                                "number": 1,
                                "home": 2,
                                "away": 1
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 68708,
                                "poulePlace": {
                                    "id": 29105,
                                    "number": 1,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5882,
                                        "name": "rank4"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68710,
                                "poulePlace": {
                                    "id": 29106,
                                    "number": 2,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5884,
                                        "name": "rank3"
                                    }
                                },
                                "homeaway": true
                            },
                            {
                                "id": 68707,
                                "poulePlace": {
                                    "id": 29107,
                                    "number": 3,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5883,
                                        "name": "rank2"
                                    }
                                },
                                "homeaway": false
                            },
                            {
                                "id": 68709,
                                "poulePlace": {
                                    "id": 29108,
                                    "number": 4,
                                    "penaltyPoints": 0,
                                    "team": {
                                        "id": 5885,
                                        "name": "rank1"
                                    }
                                },
                                "homeaway": true
                            }
                        ],
                        "scoresMoment": 2
                    }
                ],
                "id": 9502,
                "number": 1
            }
        ]
    }
};