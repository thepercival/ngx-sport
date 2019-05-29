import { JsonStructure } from '../../../../src/structure/mapper';

/**
 * rondenummer 1 : 1 ronde, 10 poules van 4
 * kwalificatie : alle nrs1, 2, 3 en 4 tegen elkaar
 * rondenummer 2 : 4 rondes, per ronde 2 poules van 5
 * kwalificatie : alle nrs1 en laatst van alle ronden tegen elkaar
 * rondenummer 3 : 1 vs 2, 9 vs 10, 11 vs 12, 19 vs 20, ... 39 vs 40
 */
export const jsonStructure1: JsonStructure = {
    "firstRoundNumber": {
        "id": 8093,
        "number": 1,
        "next": {
            "id": 8094,
            "number": 2,
            "next": {
                "id": 8095,
                "number": 3,
                "config": {
                    "id": 10174,
                    "qualifyRule": 1,
                    "nrOfHeadtoheadMatches": 1,
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
                        "id": 13354,
                        "parent": {
                            "id": 13353,
                            "name": "sets",
                            "direction": 1,
                            "maximum": 0
                        },
                        "name": "punten",
                        "direction": 1,
                        "maximum": 0
                    },
                    "teamup": false,
                    "pointsCalculation": 0,
                    "selfReferee": false
                }
            },
            "config": {
                "id": 10173,
                "qualifyRule": 1,
                "nrOfHeadtoheadMatches": 1,
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
                    "id": 13352,
                    "parent": {
                        "id": 13351,
                        "name": "sets",
                        "direction": 1,
                        "maximum": 0
                    },
                    "name": "punten",
                    "direction": 1,
                    "maximum": 0
                },
                "teamup": false,
                "pointsCalculation": 0,
                "selfReferee": false
            }
        },
        "config": {
            "id": 10172,
            "qualifyRule": 1,
            "nrOfHeadtoheadMatches": 1,
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
                "id": 13350,
                "parent": {
                    "id": 13349,
                    "name": "sets",
                    "direction": 1,
                    "maximum": 0
                },
                "name": "punten",
                "direction": 1,
                "maximum": 0
            },
            "teamup": false,
            "pointsCalculation": 0,
            "selfReferee": false
        }
    },
    "rootRound": {
        "id": 12598,
        "poules": [
            {
                "places": [
                    {
                        "id": 90840,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90841,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90842,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90843,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259317,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 1,
                        "startDateTime": "2019-05-28T08:00:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354177,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354178,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259318,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 11,
                        "startDateTime": "2019-05-28T12:10:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354179,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354180,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259319,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 21,
                        "startDateTime": "2019-05-28T16:20:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354182,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354181,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259320,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 31,
                        "startDateTime": "2019-05-28T20:30:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354184,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354183,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259321,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 41,
                        "startDateTime": "2019-05-29T00:40:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354186,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354185,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259322,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 51,
                        "startDateTime": "2019-05-29T04:50:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354188,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354187,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 26998,
                "number": 1
            },
            {
                "places": [
                    {
                        "id": 90844,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90845,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90846,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90847,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259311,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 2,
                        "startDateTime": "2019-05-28T08:25:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354165,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354166,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259312,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 12,
                        "startDateTime": "2019-05-28T12:35:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354167,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354168,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259313,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 22,
                        "startDateTime": "2019-05-28T16:45:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354170,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354169,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259314,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 32,
                        "startDateTime": "2019-05-28T20:55:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354172,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354171,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259315,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 42,
                        "startDateTime": "2019-05-29T01:05:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354174,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354173,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259316,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 52,
                        "startDateTime": "2019-05-29T05:15:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354176,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354175,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 26999,
                "number": 2
            },
            {
                "places": [
                    {
                        "id": 90848,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90849,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90850,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90851,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259323,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 3,
                        "startDateTime": "2019-05-28T08:50:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354189,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354190,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259324,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 13,
                        "startDateTime": "2019-05-28T13:00:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354191,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354192,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259325,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 23,
                        "startDateTime": "2019-05-28T17:10:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354194,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354193,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259326,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 33,
                        "startDateTime": "2019-05-28T21:20:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354196,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354195,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259327,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 43,
                        "startDateTime": "2019-05-29T01:30:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354198,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354197,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259328,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 53,
                        "startDateTime": "2019-05-29T05:40:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354200,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354199,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27000,
                "number": 3
            },
            {
                "places": [
                    {
                        "id": 90852,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90853,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90854,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90855,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259329,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 4,
                        "startDateTime": "2019-05-28T09:15:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354201,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354202,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259330,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 14,
                        "startDateTime": "2019-05-28T13:25:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354203,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354204,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259331,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 24,
                        "startDateTime": "2019-05-28T17:35:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354206,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354205,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259332,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 34,
                        "startDateTime": "2019-05-28T21:45:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354208,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354207,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259333,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 44,
                        "startDateTime": "2019-05-29T01:55:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354210,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354209,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259334,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 54,
                        "startDateTime": "2019-05-29T06:05:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354212,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354211,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27001,
                "number": 4
            },
            {
                "places": [
                    {
                        "id": 90856,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90857,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90858,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90859,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259335,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 5,
                        "startDateTime": "2019-05-28T09:40:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354213,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354214,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259336,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 15,
                        "startDateTime": "2019-05-28T13:50:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354215,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354216,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259337,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 25,
                        "startDateTime": "2019-05-28T18:00:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354218,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354217,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259338,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 35,
                        "startDateTime": "2019-05-28T22:10:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354220,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354219,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259339,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 45,
                        "startDateTime": "2019-05-29T02:20:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354222,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354221,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259340,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 55,
                        "startDateTime": "2019-05-29T06:30:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354224,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354223,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27002,
                "number": 5
            },
            {
                "places": [
                    {
                        "id": 90860,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90861,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90862,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90863,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259341,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 6,
                        "startDateTime": "2019-05-28T10:05:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354225,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354226,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259342,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 16,
                        "startDateTime": "2019-05-28T14:15:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354227,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354228,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259343,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 26,
                        "startDateTime": "2019-05-28T18:25:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354230,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354229,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259344,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 36,
                        "startDateTime": "2019-05-28T22:35:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354232,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354231,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259345,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 46,
                        "startDateTime": "2019-05-29T02:45:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354234,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354233,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259346,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 56,
                        "startDateTime": "2019-05-29T06:55:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354236,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354235,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27003,
                "number": 6
            },
            {
                "places": [
                    {
                        "id": 90864,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90865,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90866,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90867,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259347,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 7,
                        "startDateTime": "2019-05-28T10:30:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354237,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354238,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259348,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 17,
                        "startDateTime": "2019-05-28T14:40:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354239,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354240,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259349,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 27,
                        "startDateTime": "2019-05-28T18:50:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354242,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354241,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259350,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 37,
                        "startDateTime": "2019-05-28T23:00:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354244,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354243,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259351,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 47,
                        "startDateTime": "2019-05-29T03:10:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354246,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354245,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259352,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 57,
                        "startDateTime": "2019-05-29T07:20:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354248,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354247,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27004,
                "number": 7
            },
            {
                "places": [
                    {
                        "id": 90868,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90869,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90870,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90871,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259353,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 8,
                        "startDateTime": "2019-05-28T10:55:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354249,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354250,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259354,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 18,
                        "startDateTime": "2019-05-28T15:05:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354251,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354252,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259355,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 28,
                        "startDateTime": "2019-05-28T19:15:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354254,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354253,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259356,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 38,
                        "startDateTime": "2019-05-28T23:25:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354256,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354255,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259357,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 48,
                        "startDateTime": "2019-05-29T03:35:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354258,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354257,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259358,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 58,
                        "startDateTime": "2019-05-29T07:45:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354260,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354259,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27005,
                "number": 8
            },
            {
                "places": [
                    {
                        "id": 90872,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90873,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90874,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90875,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259359,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 9,
                        "startDateTime": "2019-05-28T11:20:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354261,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354262,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259360,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 19,
                        "startDateTime": "2019-05-28T15:30:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354263,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354264,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259361,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 29,
                        "startDateTime": "2019-05-28T19:40:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354266,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354265,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259362,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 39,
                        "startDateTime": "2019-05-28T23:50:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354268,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354267,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259363,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 49,
                        "startDateTime": "2019-05-29T04:00:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354270,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354269,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259364,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 59,
                        "startDateTime": "2019-05-29T08:10:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354272,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354271,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27006,
                "number": 9
            },
            {
                "places": [
                    {
                        "id": 90876,
                        "number": 1,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90877,
                        "number": 2,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90878,
                        "number": 3,
                        "penaltyPoints": 0
                    },
                    {
                        "id": 90879,
                        "number": 4,
                        "penaltyPoints": 0
                    }
                ],
                "games": [
                    {
                        "id": 259365,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 10,
                        "startDateTime": "2019-05-28T11:45:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354273,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354274,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259366,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 20,
                        "startDateTime": "2019-05-28T15:55:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354275,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354276,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259367,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 30,
                        "startDateTime": "2019-05-28T20:05:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354278,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354277,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            }
                        ]
                    },
                    {
                        "id": 259368,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 40,
                        "startDateTime": "2019-05-29T00:15:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354280,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 354279,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    },
                    {
                        "id": 259369,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 50,
                        "startDateTime": "2019-05-29T04:25:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354282,
                                "homeaway": false,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 354281,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            }
                        ]
                    },
                    {
                        "id": 259370,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 60,
                        "startDateTime": "2019-05-29T08:35:00.000000Z",
                        "fieldNr": 1,
                        "state": 1,
                        "scores": [],
                        "poulePlaces": [
                            {
                                "id": 354284,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 354283,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ]
                    }
                ],
                "id": 27007,
                "number": 10
            }
        ],
        "qualifyGroups": [
            {
                "id": 8,
                "winnersOrLosers": 1,
                "number": 1,
                "childRound": {
                    "id": 12599,
                    "poules": [
                        {
                            "places": [
                                {
                                    "id": 90880,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90881,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90882,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90883,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90884,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259371,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 2,
                                    "startDateTime": "2019-05-29T09:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354285,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354286,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259372,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 10,
                                    "startDateTime": "2019-05-29T12:45:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354287,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354288,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259373,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 18,
                                    "startDateTime": "2019-05-29T16:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354289,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354290,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259374,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 26,
                                    "startDateTime": "2019-05-29T19:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354292,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354291,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259375,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 34,
                                    "startDateTime": "2019-05-29T22:45:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354293,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354294,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259376,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 42,
                                    "startDateTime": "2019-05-30T02:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354296,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354295,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259377,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 50,
                                    "startDateTime": "2019-05-30T05:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354297,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354298,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        }
                                    ]
                                },
                                {
                                    "id": 259378,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 58,
                                    "startDateTime": "2019-05-30T08:45:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354299,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354300,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259379,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 66,
                                    "startDateTime": "2019-05-30T12:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354302,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354301,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259380,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 74,
                                    "startDateTime": "2019-05-30T15:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354303,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354304,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27008,
                            "number": 1
                        },
                        {
                            "places": [
                                {
                                    "id": 90885,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90886,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90887,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90888,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90889,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259381,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 1,
                                    "startDateTime": "2019-05-29T09:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354305,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354306,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259382,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 9,
                                    "startDateTime": "2019-05-29T12:20:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354307,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354308,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259383,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 17,
                                    "startDateTime": "2019-05-29T15:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354309,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354310,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259384,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 25,
                                    "startDateTime": "2019-05-29T19:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354312,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354311,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259385,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 33,
                                    "startDateTime": "2019-05-29T22:20:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354313,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354314,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259386,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 41,
                                    "startDateTime": "2019-05-30T01:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354316,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354315,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259387,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 49,
                                    "startDateTime": "2019-05-30T05:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354318,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354317,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259388,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 57,
                                    "startDateTime": "2019-05-30T08:20:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354319,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354320,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259389,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 65,
                                    "startDateTime": "2019-05-30T11:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354322,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354321,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259390,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 73,
                                    "startDateTime": "2019-05-30T15:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354323,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354324,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27009,
                            "number": 2
                        }
                    ],
                    "qualifyGroups": [
                        {
                            "id": 9,
                            "winnersOrLosers": 1,
                            "number": 1,
                            "childRound": {
                                "id": 12600,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90890,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90891,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259451,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 1,
                                                "startDateTime": "2019-05-30T18:20:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354445,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354446,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27010,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        },
                        {
                            "id": 10,
                            "winnersOrLosers": 3,
                            "number": 1,
                            "childRound": {
                                "id": 12601,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90892,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90893,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259452,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 2,
                                                "startDateTime": "2019-05-30T18:45:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354447,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354448,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27011,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        }
                    ]
                }
            },
            {
                "id": 11,
                "winnersOrLosers": 1,
                "number": 2,
                "childRound": {
                    "id": 12602,
                    "poules": [
                        {
                            "places": [
                                {
                                    "id": 90894,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90895,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90896,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90897,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90898,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259391,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 4,
                                    "startDateTime": "2019-05-29T10:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354325,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354326,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259392,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 12,
                                    "startDateTime": "2019-05-29T13:35:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354327,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354328,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259393,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 20,
                                    "startDateTime": "2019-05-29T16:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354329,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354330,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259394,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 28,
                                    "startDateTime": "2019-05-29T20:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354332,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354331,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259395,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 36,
                                    "startDateTime": "2019-05-29T23:35:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354333,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354334,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259396,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 44,
                                    "startDateTime": "2019-05-30T02:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354336,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354335,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259397,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 52,
                                    "startDateTime": "2019-05-30T06:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354338,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354337,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259398,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 60,
                                    "startDateTime": "2019-05-30T09:35:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354339,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354340,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259399,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 68,
                                    "startDateTime": "2019-05-30T12:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354342,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354341,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259400,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 76,
                                    "startDateTime": "2019-05-30T16:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354343,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354344,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27012,
                            "number": 1
                        },
                        {
                            "places": [
                                {
                                    "id": 90899,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90900,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90901,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90902,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90903,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259401,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 3,
                                    "startDateTime": "2019-05-29T09:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354345,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354346,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259402,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 11,
                                    "startDateTime": "2019-05-29T13:10:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354347,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354348,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259403,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 19,
                                    "startDateTime": "2019-05-29T16:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354349,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354350,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259404,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 27,
                                    "startDateTime": "2019-05-29T19:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354352,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354351,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259405,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 35,
                                    "startDateTime": "2019-05-29T23:10:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354353,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354354,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259406,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 43,
                                    "startDateTime": "2019-05-30T02:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354356,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354355,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259407,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 51,
                                    "startDateTime": "2019-05-30T05:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354358,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354357,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259408,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 59,
                                    "startDateTime": "2019-05-30T09:10:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354359,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354360,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259409,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 67,
                                    "startDateTime": "2019-05-30T12:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354362,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354361,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259410,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 75,
                                    "startDateTime": "2019-05-30T15:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354363,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354364,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27013,
                            "number": 2
                        }
                    ],
                    "qualifyGroups": [
                        {
                            "id": 12,
                            "winnersOrLosers": 1,
                            "number": 1,
                            "childRound": {
                                "id": 12603,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90904,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90905,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259453,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 3,
                                                "startDateTime": "2019-05-30T19:10:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354449,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354450,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27014,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        },
                        {
                            "id": 13,
                            "winnersOrLosers": 3,
                            "number": 1,
                            "childRound": {
                                "id": 12604,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90906,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90907,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259454,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 4,
                                                "startDateTime": "2019-05-30T19:35:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354451,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354452,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27015,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        }
                    ]
                }
            },
            {
                "id": 14,
                "winnersOrLosers": 1,
                "number": 3,
                "childRound": {
                    "id": 12605,
                    "poules": [
                        {
                            "places": [
                                {
                                    "id": 90908,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90909,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90910,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90911,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90912,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259411,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 6,
                                    "startDateTime": "2019-05-29T11:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354365,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354366,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259412,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 14,
                                    "startDateTime": "2019-05-29T14:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354367,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354368,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259413,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 22,
                                    "startDateTime": "2019-05-29T17:45:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354369,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354370,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259414,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 30,
                                    "startDateTime": "2019-05-29T21:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354372,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354371,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259415,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 38,
                                    "startDateTime": "2019-05-30T00:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354373,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354374,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259416,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 46,
                                    "startDateTime": "2019-05-30T03:45:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354376,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354375,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259417,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 54,
                                    "startDateTime": "2019-05-30T07:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354378,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354377,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259418,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 62,
                                    "startDateTime": "2019-05-30T10:25:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354379,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354380,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259419,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 70,
                                    "startDateTime": "2019-05-30T13:45:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354382,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354381,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259420,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 78,
                                    "startDateTime": "2019-05-30T17:05:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354383,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354384,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27016,
                            "number": 1
                        },
                        {
                            "places": [
                                {
                                    "id": 90913,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90914,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90915,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90916,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90917,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259421,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 5,
                                    "startDateTime": "2019-05-29T10:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354385,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354386,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259422,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 13,
                                    "startDateTime": "2019-05-29T14:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354387,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354388,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259423,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 21,
                                    "startDateTime": "2019-05-29T17:20:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354389,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354390,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259424,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 29,
                                    "startDateTime": "2019-05-29T20:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354392,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354391,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259425,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 37,
                                    "startDateTime": "2019-05-30T00:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354393,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354394,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259426,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 45,
                                    "startDateTime": "2019-05-30T03:20:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354396,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354395,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259427,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 53,
                                    "startDateTime": "2019-05-30T06:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354398,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354397,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259428,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 61,
                                    "startDateTime": "2019-05-30T10:00:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354399,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354400,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259429,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 69,
                                    "startDateTime": "2019-05-30T13:20:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354402,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354401,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259430,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 77,
                                    "startDateTime": "2019-05-30T16:40:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354403,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354404,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27017,
                            "number": 2
                        }
                    ],
                    "qualifyGroups": [
                        {
                            "id": 15,
                            "winnersOrLosers": 1,
                            "number": 1,
                            "childRound": {
                                "id": 12606,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90918,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90919,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259455,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 5,
                                                "startDateTime": "2019-05-30T20:00:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354453,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354454,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27018,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        },
                        {
                            "id": 16,
                            "winnersOrLosers": 3,
                            "number": 1,
                            "childRound": {
                                "id": 12607,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90920,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90921,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259456,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 6,
                                                "startDateTime": "2019-05-30T20:25:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354455,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354456,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27019,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        }
                    ]
                }
            },
            {
                "id": 17,
                "winnersOrLosers": 1,
                "number": 4,
                "childRound": {
                    "id": 12608,
                    "poules": [
                        {
                            "places": [
                                {
                                    "id": 90922,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90923,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90924,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90925,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90926,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259431,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 8,
                                    "startDateTime": "2019-05-29T11:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354405,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354406,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259432,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 16,
                                    "startDateTime": "2019-05-29T15:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354407,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354408,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259433,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 24,
                                    "startDateTime": "2019-05-29T18:35:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354409,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354410,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259434,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 32,
                                    "startDateTime": "2019-05-29T21:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354412,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354411,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259435,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 40,
                                    "startDateTime": "2019-05-30T01:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354413,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354414,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259436,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 48,
                                    "startDateTime": "2019-05-30T04:35:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354416,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354415,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259437,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 56,
                                    "startDateTime": "2019-05-30T07:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354418,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354417,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259438,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 64,
                                    "startDateTime": "2019-05-30T11:15:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354419,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354420,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259439,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 72,
                                    "startDateTime": "2019-05-30T14:35:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354422,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354421,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259440,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 80,
                                    "startDateTime": "2019-05-30T17:55:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354423,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354424,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27020,
                            "number": 1
                        },
                        {
                            "places": [
                                {
                                    "id": 90927,
                                    "number": 1,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90928,
                                    "number": 2,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90929,
                                    "number": 3,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90930,
                                    "number": 4,
                                    "penaltyPoints": 0
                                },
                                {
                                    "id": 90931,
                                    "number": 5,
                                    "penaltyPoints": 0
                                }
                            ],
                            "games": [
                                {
                                    "id": 259441,
                                    "roundNumber": 1,
                                    "subNumber": 1,
                                    "resourceBatch": 7,
                                    "startDateTime": "2019-05-29T11:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354425,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354426,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259442,
                                    "roundNumber": 1,
                                    "subNumber": 2,
                                    "resourceBatch": 15,
                                    "startDateTime": "2019-05-29T14:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354427,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354428,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259443,
                                    "roundNumber": 2,
                                    "subNumber": 1,
                                    "resourceBatch": 23,
                                    "startDateTime": "2019-05-29T18:10:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354429,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354430,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        }
                                    ]
                                },
                                {
                                    "id": 259444,
                                    "roundNumber": 2,
                                    "subNumber": 2,
                                    "resourceBatch": 31,
                                    "startDateTime": "2019-05-29T21:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354432,
                                            "homeaway": false,
                                            "poulePlaceNr": 4
                                        },
                                        {
                                            "id": 354431,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259445,
                                    "roundNumber": 3,
                                    "subNumber": 1,
                                    "resourceBatch": 39,
                                    "startDateTime": "2019-05-30T00:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354433,
                                            "homeaway": true,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354434,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                },
                                {
                                    "id": 259446,
                                    "roundNumber": 3,
                                    "subNumber": 2,
                                    "resourceBatch": 47,
                                    "startDateTime": "2019-05-30T04:10:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354436,
                                            "homeaway": false,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354435,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259447,
                                    "roundNumber": 4,
                                    "subNumber": 1,
                                    "resourceBatch": 55,
                                    "startDateTime": "2019-05-30T07:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354438,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354437,
                                            "homeaway": true,
                                            "poulePlaceNr": 4
                                        }
                                    ]
                                },
                                {
                                    "id": 259448,
                                    "roundNumber": 4,
                                    "subNumber": 2,
                                    "resourceBatch": 63,
                                    "startDateTime": "2019-05-30T10:50:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354439,
                                            "homeaway": true,
                                            "poulePlaceNr": 3
                                        },
                                        {
                                            "id": 354440,
                                            "homeaway": false,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259449,
                                    "roundNumber": 5,
                                    "subNumber": 1,
                                    "resourceBatch": 71,
                                    "startDateTime": "2019-05-30T14:10:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354442,
                                            "homeaway": false,
                                            "poulePlaceNr": 1
                                        },
                                        {
                                            "id": 354441,
                                            "homeaway": true,
                                            "poulePlaceNr": 5
                                        }
                                    ]
                                },
                                {
                                    "id": 259450,
                                    "roundNumber": 5,
                                    "subNumber": 2,
                                    "resourceBatch": 79,
                                    "startDateTime": "2019-05-30T17:30:00.000000Z",
                                    "fieldNr": 1,
                                    "state": 1,
                                    "scores": [],
                                    "poulePlaces": [
                                        {
                                            "id": 354443,
                                            "homeaway": true,
                                            "poulePlaceNr": 2
                                        },
                                        {
                                            "id": 354444,
                                            "homeaway": false,
                                            "poulePlaceNr": 3
                                        }
                                    ]
                                }
                            ],
                            "id": 27021,
                            "number": 2
                        }
                    ],
                    "qualifyGroups": [
                        {
                            "id": 18,
                            "winnersOrLosers": 1,
                            "number": 1,
                            "childRound": {
                                "id": 12609,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90932,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90933,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259457,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 7,
                                                "startDateTime": "2019-05-30T20:50:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354457,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354458,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27022,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        },
                        {
                            "id": 19,
                            "winnersOrLosers": 3,
                            "number": 1,
                            "childRound": {
                                "id": 12610,
                                "poules": [
                                    {
                                        "places": [
                                            {
                                                "id": 90934,
                                                "number": 1,
                                                "penaltyPoints": 0
                                            },
                                            {
                                                "id": 90935,
                                                "number": 2,
                                                "penaltyPoints": 0
                                            }
                                        ],
                                        "games": [
                                            {
                                                "id": 259458,
                                                "roundNumber": 1,
                                                "subNumber": 1,
                                                "resourceBatch": 8,
                                                "startDateTime": "2019-05-30T21:15:00.000000Z",
                                                "fieldNr": 1,
                                                "state": 1,
                                                "scores": [],
                                                "poulePlaces": [
                                                    {
                                                        "id": 354459,
                                                        "homeaway": true,
                                                        "poulePlaceNr": 1
                                                    },
                                                    {
                                                        "id": 354460,
                                                        "homeaway": false,
                                                        "poulePlaceNr": 2
                                                    }
                                                ]
                                            }
                                        ],
                                        "id": 27023,
                                        "number": 1
                                    }
                                ],
                                "qualifyGroups": []
                            }
                        }
                    ]
                }
            }
        ]
    }
};
