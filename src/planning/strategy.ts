import { AgainstSportVariant } from "../sport/variant/against";
import { AllInOneGameSportVariant } from "../sport/variant/all";
import { SingleSportVariant } from "../sport/variant/single";

export enum GameCreationStrategy {
    Static = 1, Incremental
}

export class GameCreationStrategyCalculator {
    calculate(
        sportVariants: (SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant)[]): GameCreationStrategy {
        // let allSingle = true;
        // let hasAllInOneGame = true;
        // const sportVariants = paramSportVariants.slice();
        // let sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant | undefined;
        // while (sportVariant = sportVariants.pop()) {
        //     if (sportVariant instanceof AgainstSportVariant) {
        //         if (sportVariant.getNrOfGamePlaces() > 2) {
        //             return GameCreationStrategy.IncrementalRandom;
        //         }
        //         return GameCreationStrategy.Static;
        //     }
        //     if (sportVariant instanceof SingleSportVariant) {
        //         hasAllInOneGame = false;
        //     } else {
        //         allSingle = false;
        //     }
        //     if (!hasAllInOneGame && !allSingle) {
        //         return GameCreationStrategy.Static;
        //     }
        // }
        // return GameCreationStrategy.Incremental;

        // let allSingle = true;
        // let hasAllInOneGame = true;
        // const sportVariants = paramSportVariants.slice();
        // let  | undefined;

        return GameCreationStrategy.Static;
    }
}