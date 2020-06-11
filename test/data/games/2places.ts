import { JsonGame } from '../../../src/game/json';
import { State } from '../../../src/state';

export const jsonGames2Places: JsonGame[] = [{
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
    batchNr: 1,
    fieldNr: 1,
    state: State.Created,
    scores: []
}];
