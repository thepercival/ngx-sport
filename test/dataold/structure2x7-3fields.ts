import { JsonStructure } from '../../src/structure/mapper';

export const jsonStructureCompetitorAsReferee: JsonStructure = {
    "firstRoundNumber": {
        "id": 3611,
        "number": 1,
        "next": {
            "id": 3612,
            "number": 2,
            "config": {
                "id": 5691,
                "qualifyRule": 1,
                "nrOfHeadtoheadMatches": 1,
                "winPoints": 2.0,
                "drawPoints": 1.0,
                "hasExtension": false,
                "winPointsExt": 2.0,
                "drawPointsExt": 1.0,
                "minutesPerGameExt": 0,
                "enableTime": true,
                "minutesPerGame": 12,
                "minutesBetweenGames": 2,
                "minutesAfter": 6,
                "score": {
                    "id": 7506,
                    "parent": {
                        "id": 7505,
                        "name": "sets",
                        "direction": 1,
                        "maximum": 0
                    },
                    "name": "punten",
                    "direction": 1,
                    "maximum": 999
                },
                "teamup": false,
                "pointsCalculation": 0,
                "selfReferee": true
            }
        },
        "config": {
            "id": 5690,
            "qualifyRule": 1,
            "nrOfHeadtoheadMatches": 1,
            "winPoints": 2.0,
            "drawPoints": 1.0,
            "hasExtension": false,
            "winPointsExt": 2.0,
            "drawPointsExt": 1.0,
            "minutesPerGameExt": 0,
            "enableTime": true,
            "minutesPerGame": 12,
            "minutesBetweenGames": 2,
            "minutesAfter": 6,
            "score": {
                "id": 7504,
                "parent": {
                    "id": 7503,
                    "name": "sets",
                    "direction": 1,
                    "maximum": 0
                },
                "name": "punten",
                "direction": 1,
                "maximum": 999
            },
            "teamup": false,
            "pointsCalculation": 0,
            "selfReferee": true
        }
    },
    "rootRound": {
        "id": 6371,
        "winnersOrLosers": 0,
        "qualifyOrder": 1,
        "childRounds": [
            {
                "id": 6372,
                "winnersOrLosers": 1,
                "qualifyOrder": 2,
                "childRounds": [],
                "poules": [
                    {
                        "places": [
                            {
                                "id": 40274,
                                "number": 1,
                                "penaltyPoints": 0,
                                "competitor": {
                                    "id": 7115,
                                    "name": "No Name"
                                }
                            },
                            {
                                "id": 40275,
                                "number": 2,
                                "penaltyPoints": 0,
                                "competitor": {
                                    "id": 7121,
                                    "name": "KC & the Sunshineband"
                                }
                            }
                        ],
                        "games": [
                            {
                                "id": 127719,
                                "roundNumber": 1,
                                "subNumber": 1,
                                "resourceBatch": 2,
                                "startDateTime": "2019-03-09T21:34:00.000000Z",
                                "refereePoulePlaceId": 40277,
                                "fieldNr": 2,
                                "state": 4,
                                "scores": [
                                    {
                                        "id": 8048,
                                        "number": 1,
                                        "home": 18,
                                        "away": 23
                                    }
                                ],
                                "poulePlaces": [
                                    {
                                        "id": 90717,
                                        "homeaway": true,
                                        "poulePlaceNr": 1
                                    },
                                    {
                                        "id": 90718,
                                        "homeaway": false,
                                        "poulePlaceNr": 2
                                    }
                                ],
                                "scoresMoment": 2
                            }
                        ],
                        "id": 12731,
                        "number": 1
                    },
                    {
                        "places": [
                            {
                                "id": 40276,
                                "number": 1,
                                "penaltyPoints": 0,
                                "competitor": {
                                    "id": 7113,
                                    "name": "Bourgondi\u00eb Recreanten"
                                }
                            },
                            {
                                "id": 40277,
                                "number": 2,
                                "penaltyPoints": 0,
                                "competitor": {
                                    "id": 7114,
                                    "name": "Middelweerden"
                                }
                            }
                        ],
                        "games": [
                            {
                                "id": 127697,
                                "roundNumber": 1,
                                "subNumber": 1,
                                "resourceBatch": 1,
                                "startDateTime": "2019-03-09T21:20:00.000000Z",
                                "refereePoulePlaceId": 40275,
                                "fieldNr": 1,
                                "state": 4,
                                "scores": [
                                    {
                                        "id": 8047,
                                        "number": 1,
                                        "home": 25,
                                        "away": 18
                                    }
                                ],
                                "poulePlaces": [
                                    {
                                        "id": 90673,
                                        "homeaway": true,
                                        "poulePlaceNr": 1
                                    },
                                    {
                                        "id": 90674,
                                        "homeaway": false,
                                        "poulePlaceNr": 2
                                    }
                                ],
                                "scoresMoment": 2
                            }
                        ],
                        "id": 12732,
                        "number": 2
                    }
                ]
            }
        ],
        "poules": [
            {
                "places": [
                    {
                        "id": 40260,
                        "number": 1,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7113,
                            "name": "Bourgondi\u00eb Recreanten"
                        }
                    },
                    {
                        "id": 40261,
                        "number": 2,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7115,
                            "name": "No Name"
                        }
                    },
                    {
                        "id": 40262,
                        "number": 3,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7120,
                            "name": "Rijnweide"
                        }
                    },
                    {
                        "id": 40263,
                        "number": 4,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7119,
                            "name": "Op 't nippertje"
                        }
                    },
                    {
                        "id": 40264,
                        "number": 5,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7126,
                            "name": "Hofmannen"
                        }
                    },
                    {
                        "id": 40265,
                        "number": 6,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7122,
                            "name": "As ut moar Waiks is"
                        }
                    },
                    {
                        "id": 40266,
                        "number": 7,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7123,
                            "name": "Miribouw"
                        }
                    }
                ],
                "games": [
                    {
                        "id": 127676,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 1,
                        "startDateTime": "2019-03-09T18:00:00.000000Z",
                        "refereePoulePlaceId": 40273,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8005,
                                "number": 1,
                                "home": 32,
                                "away": 10
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90631,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90632,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127677,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 1,
                        "startDateTime": "2019-03-09T18:00:00.000000Z",
                        "refereePoulePlaceId": 40272,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8006,
                                "number": 1,
                                "home": 22,
                                "away": 10
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90633,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90634,
                                "homeaway": false,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127678,
                        "roundNumber": 1,
                        "subNumber": 3,
                        "resourceBatch": 1,
                        "startDateTime": "2019-03-09T18:00:00.000000Z",
                        "refereePoulePlaceId": 40271,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8007,
                                "number": 1,
                                "home": 21,
                                "away": 13
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90635,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            },
                            {
                                "id": 90636,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127679,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 3,
                        "startDateTime": "2019-03-09T18:28:00.000000Z",
                        "refereePoulePlaceId": 40270,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8011,
                                "number": 1,
                                "home": 16,
                                "away": 16
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90637,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90638,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127680,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 4,
                        "startDateTime": "2019-03-09T18:42:00.000000Z",
                        "refereePoulePlaceId": 40268,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8014,
                                "number": 1,
                                "home": 22,
                                "away": 15
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90639,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            },
                            {
                                "id": 90640,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127681,
                        "roundNumber": 2,
                        "subNumber": 3,
                        "resourceBatch": 3,
                        "startDateTime": "2019-03-09T18:28:00.000000Z",
                        "refereePoulePlaceId": 40269,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8013,
                                "number": 1,
                                "home": 21,
                                "away": 17
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90641,
                                "homeaway": true,
                                "poulePlaceNr": 5
                            },
                            {
                                "id": 90642,
                                "homeaway": false,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127682,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 5,
                        "startDateTime": "2019-03-09T18:56:00.000000Z",
                        "refereePoulePlaceId": 40267,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8017,
                                "number": 1,
                                "home": 15,
                                "away": 15
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90643,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90644,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127683,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 5,
                        "startDateTime": "2019-03-09T18:56:00.000000Z",
                        "refereePoulePlaceId": 40273,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8018,
                                "number": 1,
                                "home": 10,
                                "away": 23
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90646,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90645,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127684,
                        "roundNumber": 3,
                        "subNumber": 3,
                        "resourceBatch": 7,
                        "startDateTime": "2019-03-09T19:24:00.000000Z",
                        "refereePoulePlaceId": 40271,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8023,
                                "number": 1,
                                "home": 17,
                                "away": 20
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90647,
                                "homeaway": true,
                                "poulePlaceNr": 6
                            },
                            {
                                "id": 90648,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127685,
                        "roundNumber": 4,
                        "subNumber": 1,
                        "resourceBatch": 6,
                        "startDateTime": "2019-03-09T19:10:00.000000Z",
                        "refereePoulePlaceId": 40272,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8022,
                                "number": 1,
                                "home": 17,
                                "away": 13
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90649,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90650,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127686,
                        "roundNumber": 4,
                        "subNumber": 2,
                        "resourceBatch": 8,
                        "startDateTime": "2019-03-09T19:38:00.000000Z",
                        "refereePoulePlaceId": 40270,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8026,
                                "number": 1,
                                "home": 14,
                                "away": 17
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90652,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90651,
                                "homeaway": true,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127687,
                        "roundNumber": 4,
                        "subNumber": 3,
                        "resourceBatch": 8,
                        "startDateTime": "2019-03-09T19:38:00.000000Z",
                        "refereePoulePlaceId": 40269,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8028,
                                "number": 1,
                                "home": 12,
                                "away": 27
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90654,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90653,
                                "homeaway": true,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127688,
                        "roundNumber": 5,
                        "subNumber": 1,
                        "resourceBatch": 9,
                        "startDateTime": "2019-03-09T19:52:00.000000Z",
                        "refereePoulePlaceId": 40268,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8029,
                                "number": 1,
                                "home": 18,
                                "away": 10
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90655,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90656,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127689,
                        "roundNumber": 5,
                        "subNumber": 2,
                        "resourceBatch": 9,
                        "startDateTime": "2019-03-09T19:52:00.000000Z",
                        "refereePoulePlaceId": 40267,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8031,
                                "number": 1,
                                "home": 17,
                                "away": 20
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90658,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            },
                            {
                                "id": 90657,
                                "homeaway": true,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127690,
                        "roundNumber": 5,
                        "subNumber": 3,
                        "resourceBatch": 10,
                        "startDateTime": "2019-03-09T20:06:00.000000Z",
                        "refereePoulePlaceId": 40273,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8033,
                                "number": 1,
                                "home": 8,
                                "away": 20
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90660,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90659,
                                "homeaway": true,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127691,
                        "roundNumber": 6,
                        "subNumber": 1,
                        "resourceBatch": 12,
                        "startDateTime": "2019-03-09T20:34:00.000000Z",
                        "refereePoulePlaceId": 40271,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8040,
                                "number": 1,
                                "home": 22,
                                "away": 11
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90661,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90662,
                                "homeaway": false,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127692,
                        "roundNumber": 6,
                        "subNumber": 2,
                        "resourceBatch": 12,
                        "startDateTime": "2019-03-09T20:34:00.000000Z",
                        "refereePoulePlaceId": 40270,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8038,
                                "number": 1,
                                "home": 13,
                                "away": 27
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90664,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            },
                            {
                                "id": 90663,
                                "homeaway": true,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127693,
                        "roundNumber": 6,
                        "subNumber": 3,
                        "resourceBatch": 11,
                        "startDateTime": "2019-03-09T20:20:00.000000Z",
                        "refereePoulePlaceId": 40272,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8037,
                                "number": 1,
                                "home": 17,
                                "away": 15
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90665,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90666,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127694,
                        "roundNumber": 7,
                        "subNumber": 1,
                        "resourceBatch": 13,
                        "startDateTime": "2019-03-09T20:48:00.000000Z",
                        "refereePoulePlaceId": 40269,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8042,
                                "number": 1,
                                "home": 23,
                                "away": 9
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90667,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90668,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127695,
                        "roundNumber": 7,
                        "subNumber": 2,
                        "resourceBatch": 13,
                        "startDateTime": "2019-03-09T20:48:00.000000Z",
                        "refereePoulePlaceId": 40268,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8043,
                                "number": 1,
                                "home": 20,
                                "away": 11
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90669,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90670,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127696,
                        "roundNumber": 7,
                        "subNumber": 3,
                        "resourceBatch": 14,
                        "startDateTime": "2019-03-09T21:02:00.000000Z",
                        "refereePoulePlaceId": 40267,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8045,
                                "number": 1,
                                "home": 21,
                                "away": 11
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90671,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90672,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ],
                        "scoresMoment": 2
                    }
                ],
                "id": 12729,
                "number": 1
            },
            {
                "places": [
                    {
                        "id": 40267,
                        "number": 1,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7121,
                            "name": "KC & the Sunshineband"
                        }
                    },
                    {
                        "id": 40268,
                        "number": 2,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7118,
                            "name": "Riki's favoriete team"
                        }
                    },
                    {
                        "id": 40269,
                        "number": 3,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7124,
                            "name": "De Boerenbuddies"
                        }
                    },
                    {
                        "id": 40270,
                        "number": 4,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7125,
                            "name": "RZ Groep"
                        }
                    },
                    {
                        "id": 40271,
                        "number": 5,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7116,
                            "name": "iedereen leunt op Teus"
                        }
                    },
                    {
                        "id": 40272,
                        "number": 6,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7117,
                            "name": "Buurman en buurvrouw"
                        }
                    },
                    {
                        "id": 40273,
                        "number": 7,
                        "penaltyPoints": 0,
                        "competitor": {
                            "id": 7114,
                            "name": "Middelweerden"
                        }
                    }
                ],
                "games": [
                    {
                        "id": 127698,
                        "roundNumber": 1,
                        "subNumber": 1,
                        "resourceBatch": 2,
                        "startDateTime": "2019-03-09T18:14:00.000000Z",
                        "refereePoulePlaceId": 40266,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8008,
                                "number": 1,
                                "home": 13,
                                "away": 25
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90675,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90676,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127699,
                        "roundNumber": 1,
                        "subNumber": 2,
                        "resourceBatch": 2,
                        "startDateTime": "2019-03-09T18:14:00.000000Z",
                        "refereePoulePlaceId": 40265,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8009,
                                "number": 1,
                                "home": 25,
                                "away": 17
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90677,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90678,
                                "homeaway": false,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127700,
                        "roundNumber": 1,
                        "subNumber": 3,
                        "resourceBatch": 2,
                        "startDateTime": "2019-03-09T18:14:00.000000Z",
                        "refereePoulePlaceId": 40264,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8010,
                                "number": 1,
                                "home": 24,
                                "away": 15
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90679,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            },
                            {
                                "id": 90680,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127701,
                        "roundNumber": 2,
                        "subNumber": 1,
                        "resourceBatch": 3,
                        "startDateTime": "2019-03-09T18:28:00.000000Z",
                        "refereePoulePlaceId": 40263,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8012,
                                "number": 1,
                                "home": 24,
                                "away": 16
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90681,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90682,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127702,
                        "roundNumber": 2,
                        "subNumber": 2,
                        "resourceBatch": 4,
                        "startDateTime": "2019-03-09T18:42:00.000000Z",
                        "refereePoulePlaceId": 40262,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8015,
                                "number": 1,
                                "home": 13,
                                "away": 25
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90683,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            },
                            {
                                "id": 90684,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127703,
                        "roundNumber": 2,
                        "subNumber": 3,
                        "resourceBatch": 4,
                        "startDateTime": "2019-03-09T18:42:00.000000Z",
                        "refereePoulePlaceId": 40261,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8016,
                                "number": 1,
                                "home": 27,
                                "away": 18
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90685,
                                "homeaway": true,
                                "poulePlaceNr": 5
                            },
                            {
                                "id": 90686,
                                "homeaway": false,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127704,
                        "roundNumber": 3,
                        "subNumber": 1,
                        "resourceBatch": 6,
                        "startDateTime": "2019-03-09T19:10:00.000000Z",
                        "refereePoulePlaceId": 40266,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8020,
                                "number": 1,
                                "home": 27,
                                "away": 6
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90687,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90688,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127705,
                        "roundNumber": 3,
                        "subNumber": 2,
                        "resourceBatch": 5,
                        "startDateTime": "2019-03-09T18:56:00.000000Z",
                        "refereePoulePlaceId": 40260,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8019,
                                "number": 1,
                                "home": 17,
                                "away": 18
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90690,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90689,
                                "homeaway": true,
                                "poulePlaceNr": 4
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127706,
                        "roundNumber": 3,
                        "subNumber": 3,
                        "resourceBatch": 6,
                        "startDateTime": "2019-03-09T19:10:00.000000Z",
                        "refereePoulePlaceId": 40265,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8021,
                                "number": 1,
                                "home": 11,
                                "away": 31
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90691,
                                "homeaway": true,
                                "poulePlaceNr": 6
                            },
                            {
                                "id": 90692,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127707,
                        "roundNumber": 4,
                        "subNumber": 1,
                        "resourceBatch": 7,
                        "startDateTime": "2019-03-09T19:24:00.000000Z",
                        "refereePoulePlaceId": 40264,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8024,
                                "number": 1,
                                "home": 26,
                                "away": 9
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90693,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90694,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127708,
                        "roundNumber": 4,
                        "subNumber": 2,
                        "resourceBatch": 8,
                        "startDateTime": "2019-03-09T19:38:00.000000Z",
                        "refereePoulePlaceId": 40262,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8027,
                                "number": 1,
                                "home": 16,
                                "away": 28
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90696,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90695,
                                "homeaway": true,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127709,
                        "roundNumber": 4,
                        "subNumber": 3,
                        "resourceBatch": 7,
                        "startDateTime": "2019-03-09T19:24:00.000000Z",
                        "refereePoulePlaceId": 40263,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8025,
                                "number": 1,
                                "home": 15,
                                "away": 31
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90698,
                                "homeaway": false,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90697,
                                "homeaway": true,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127710,
                        "roundNumber": 5,
                        "subNumber": 1,
                        "resourceBatch": 9,
                        "startDateTime": "2019-03-09T19:52:00.000000Z",
                        "refereePoulePlaceId": 40261,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8030,
                                "number": 1,
                                "home": 26,
                                "away": 13
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90699,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90700,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127711,
                        "roundNumber": 5,
                        "subNumber": 2,
                        "resourceBatch": 10,
                        "startDateTime": "2019-03-09T20:06:00.000000Z",
                        "refereePoulePlaceId": 40260,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8032,
                                "number": 1,
                                "home": 14,
                                "away": 25
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90702,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            },
                            {
                                "id": 90701,
                                "homeaway": true,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127712,
                        "roundNumber": 5,
                        "subNumber": 3,
                        "resourceBatch": 11,
                        "startDateTime": "2019-03-09T20:20:00.000000Z",
                        "refereePoulePlaceId": 40265,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8035,
                                "number": 1,
                                "home": 24,
                                "away": 18
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90704,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90703,
                                "homeaway": true,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127713,
                        "roundNumber": 6,
                        "subNumber": 1,
                        "resourceBatch": 11,
                        "startDateTime": "2019-03-09T20:20:00.000000Z",
                        "refereePoulePlaceId": 40264,
                        "fieldNr": 2,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8036,
                                "number": 1,
                                "home": 27,
                                "away": 5
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90705,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90706,
                                "homeaway": false,
                                "poulePlaceNr": 6
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127714,
                        "roundNumber": 6,
                        "subNumber": 2,
                        "resourceBatch": 13,
                        "startDateTime": "2019-03-09T20:48:00.000000Z",
                        "refereePoulePlaceId": 40262,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8041,
                                "number": 1,
                                "home": 23,
                                "away": 10
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90708,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            },
                            {
                                "id": 90707,
                                "homeaway": true,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127715,
                        "roundNumber": 6,
                        "subNumber": 3,
                        "resourceBatch": 10,
                        "startDateTime": "2019-03-09T20:06:00.000000Z",
                        "refereePoulePlaceId": 40266,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8034,
                                "number": 1,
                                "home": 20,
                                "away": 16
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90709,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90710,
                                "homeaway": false,
                                "poulePlaceNr": 3
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127716,
                        "roundNumber": 7,
                        "subNumber": 1,
                        "resourceBatch": 12,
                        "startDateTime": "2019-03-09T20:34:00.000000Z",
                        "refereePoulePlaceId": 40263,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8039,
                                "number": 1,
                                "home": 24,
                                "away": 11
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90711,
                                "homeaway": true,
                                "poulePlaceNr": 1
                            },
                            {
                                "id": 90712,
                                "homeaway": false,
                                "poulePlaceNr": 7
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127717,
                        "roundNumber": 7,
                        "subNumber": 2,
                        "resourceBatch": 14,
                        "startDateTime": "2019-03-09T21:02:00.000000Z",
                        "refereePoulePlaceId": 40261,
                        "fieldNr": 1,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8044,
                                "number": 1,
                                "home": 21,
                                "away": 10
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90713,
                                "homeaway": true,
                                "poulePlaceNr": 2
                            },
                            {
                                "id": 90714,
                                "homeaway": false,
                                "poulePlaceNr": 5
                            }
                        ],
                        "scoresMoment": 2
                    },
                    {
                        "id": 127718,
                        "roundNumber": 7,
                        "subNumber": 3,
                        "resourceBatch": 14,
                        "startDateTime": "2019-03-09T21:02:00.000000Z",
                        "refereePoulePlaceId": 40260,
                        "fieldNr": 3,
                        "state": 4,
                        "scores": [
                            {
                                "id": 8046,
                                "number": 1,
                                "home": 22,
                                "away": 17
                            }
                        ],
                        "poulePlaces": [
                            {
                                "id": 90715,
                                "homeaway": true,
                                "poulePlaceNr": 3
                            },
                            {
                                "id": 90716,
                                "homeaway": false,
                                "poulePlaceNr": 4
                            }
                        ],
                        "scoresMoment": 2
                    }
                ],
                "id": 12730,
                "number": 2
            }
        ]
    }
};