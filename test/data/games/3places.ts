import { JsonGame } from '../../../src/game/json';
import { State } from '../../../src/state';

export const jsonGames3Places: JsonGame[] = [
    {
        places: [
            {
                placeNr: 2,
                homeaway: true
            },
            {
                placeNr: 3,
                homeaway: false
            }
        ],
        batchNr: 1,
        fieldPriority: 1,
        state: State.Created,
        scores: []
    },
    {
        places: [
            {
                placeNr: 1,
                homeaway: true
            },
            {
                placeNr: 2,
                homeaway: false
            }
        ],
        batchNr: 2,
        fieldPriority: 1,
        state: State.Created,
        scores: []
    },
    {
        places: [
            {
                placeNr: 3,
                homeaway: true
            },
            {
                placeNr: 1,
                homeaway: false
            }
        ],
        batchNr: 3,
        fieldPriority: 1,
        state: State.Created,
        scores: []
    }

];
