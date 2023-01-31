import { AgainstGpp } from "../against/gamesPerPlace";
import { AgainstGppWithPoule } from "./againstGamePerPlace";

export class EquallyAssignCalculator {

    public assignAgainstSportsEqually(nrOfPlaces: number, againstGppVariants: AgainstGpp[]): boolean {

        const againstGppsMap = new AgainstGppMap(againstGppVariants);
        const againstGppsPerGamePlaces = Array.from(againstGppsMap.values());
        return againstGppsPerGamePlaces.every((againstGpps: AgainstGpp[]): boolean => {
            let totalNrOfGames = 0;
            let uniqueNrOfCombinationsPerGame = undefined;
            let nrOfPossibleCombinations = undefined;
            againstGpps.forEach((againstGpp: AgainstGpp) => {
                uniqueNrOfCombinationsPerGame = againstGpp.getNrOfAgainstCombinationsPerGame();
                const againstGppWithPoule = new AgainstGppWithPoule(nrOfPlaces, againstGpp);
                nrOfPossibleCombinations = againstGppWithPoule.getNrOfPossibleAgainstCombinations();
                totalNrOfGames += againstGppWithPoule.getTotalNrOfGames();
            });
            return uniqueNrOfCombinationsPerGame === undefined
                || totalNrOfGames === 0 || nrOfPossibleCombinations === undefined 
                || this.assignEqually(totalNrOfGames,nrOfPossibleCombinations,uniqueNrOfCombinationsPerGame);
        });
    }


    private assignEqually(totalNrOfGames: number, nrOfPossibleCombinations: number, nrOfCombinationsPerGame: number): boolean
    {
        const nrOfCombinations = nrOfCombinationsPerGame * totalNrOfGames;
        return this.getNrOfDeficit(nrOfCombinations, nrOfPossibleCombinations) === 0;
    }

    private getNrOfDeficit(nrOfCombinations: number, nrOfPossibleCombinations: number ): number
    {
        if( nrOfPossibleCombinations === 0) {
            return 0;
        }
        const rest = nrOfCombinations % nrOfPossibleCombinations;
        return rest === 0 ? 0 : nrOfPossibleCombinations - rest;
    }

}

class AgainstGppMap extends Map<string, AgainstGpp[]> {

    constructor(againstGpps: AgainstGpp[]) {
        super();
        againstGpps.forEach((againstGpp: AgainstGpp) => {
            const id = againstGpp.getGamePlacesId();
            if( !this.has(id) ) {
                this.set(id, []);    
            } else {
                this.get(id).push(againstGpp);    
            }
        });
    }
}