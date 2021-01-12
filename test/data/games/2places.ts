import { JsonGame } from "../../../public_api";


export const jsonGames2Places: JsonGame[] = [{
    id: 0,
    batchNr: 1,
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
    fieldPriority: 1,
    state: State.Created,
    startDateTime: undefined,
    refereePriority: undefined,
    refereePlaceLocId: undefined,
    scores: []
}];