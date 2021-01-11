import { JsonGame } from '../../../src/game/json';
import { State } from '../../../src/state';

export const jsonGames4Places: JsonGame[] = [
    {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: 11
        },
        places: [
            {
                id: 0,
                placeNr: 1,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 2,
                homeaway: false
            }
        ],
        batchNr: 1,
        fieldPriority: 1,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    },
    {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: 11
        },
        places: [
            {
                id: 0,
                placeNr: 3,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 4,
                homeaway: false
            }
        ],
        batchNr: 1,
        fieldPriority: 2,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    },
    {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: 11
        },
        places: [
            {
                id: 0,
                placeNr: 4,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 1,
                homeaway: false
            }
        ],
        batchNr: 2,
        fieldPriority: 1,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    }

    ,
    {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: 11
        },
        places: [
            {
                id: 0,
                placeNr: 3,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 2,
                homeaway: false
            }
        ],
        batchNr: 2,
        fieldPriority: 2,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    },
    {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: 11
        },
        places: [
            {
                id: 0,
                placeNr: 1,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 3,
                homeaway: false
            }
        ],
        batchNr: 3,
        fieldPriority: 1,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    },
    {
        id: 0,
        sport: {
            id: 0,
            name: 'voetbal',
            team: true,
            customId: 11
        },
        places: [
            {
                id: 0,
                placeNr: 2,
                homeaway: true
            },
            {
                id: 0,
                placeNr: 4,
                homeaway: false
            }
        ],
        batchNr: 3,
        fieldPriority: 2,
        state: State.Created,
        startDateTime: undefined,
        refereePriority: undefined,
        refereePlaceLocId: undefined,
        scores: []
    }
];
