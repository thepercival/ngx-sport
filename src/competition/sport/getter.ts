import { PlaceRanges } from '../../structure/placeRanges';
import { AgainstGpp } from '../../sport/variant/against/gamesPerPlace';
import { AgainstH2h } from '../../sport/variant/against/h2h';
import { AllInOneGame } from '../../sport/variant/allInOneGame';
import { Single } from '../../sport/variant/single';

export class CompetitionSportGetter {
    constructor(
    ) {
    }

    getMinNrOfPlacesPerPoule(
        sportVariants: (Single | AgainstH2h | AgainstGpp | AllInOneGame)[]): number {
        let minNrOfPlacesPerPouleForSports = sportVariants.map((sportVariant: Single | AgainstH2h | AgainstGpp | AllInOneGame) => {
            return this.getMinNrOfPlacesPerPouleForSport(sportVariant);
        });
        let minimum = Math.min.apply(Math, minNrOfPlacesPerPouleForSports);

        if (minimum < PlaceRanges.MinNrOfPlacesPerPoule) {
            minimum = PlaceRanges.MinNrOfPlacesPerPoule;
        }
        return minimum;
        // return Math.max.apply(Math, minNrOfPlacesPerPouleForSports);
    }

    getMinNrOfPlacesPerPouleForSport(sportVariant: Single | AgainstH2h | AgainstGpp | AllInOneGame): number {
        if (sportVariant instanceof AllInOneGame) {
            return PlaceRanges.MinNrOfPlacesPerPoule;
        }
        return sportVariant.getNrOfGamePlaces();
    }

    /*getMinNrOfPlacesPerRound(
        sportVariants: (SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant)[]): number {
        const sportsMinNrOfPlaces = sportVariants.map((sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant) => {
            if (sportVariant instanceof SingleSportVariant) {
                return sportVariant.getNrOfGamePlaces();
            }
            return this.getMinNrOfPlacesPerPouleHelper(sportVariant);
        });
        return Math.max.apply(Math, sportsMinNrOfPlaces);
    }*/

    // getPlacesPerPouleRange(
    //     maxNrOfPlacesPerPoule: number,
    //     sportVariants: (SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant)[]): VoetbalRange {
    //     const sportsMinNrOfPlaces = sportVariants.map((sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant) => {
    //         if (sportVariant instanceof AgainstSportVariant) {
    //             return sportVariant.getNrOfGamePlaces();
    //         }
    //         return 2;
    //     });
    //     const minNrOfPlacesPerPoule = Math.max.apply(Math, sportsMinNrOfPlaces);
    //     if (maxNrOfPlacesPerPoule < minNrOfPlacesPerPoule) {
    //         maxNrOfPlacesPerPoule = minNrOfPlacesPerPoule;
    //     }
    //     return { min: minNrOfPlacesPerPoule, max: maxNrOfPlacesPerPoule };
    // }

    // getPlacesPerRoundRange(
    //     minNrOfPlacesPerPoule: number,
    //     sportVariants: (SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant)[]): VoetbalRange {
    //     const sportsMinNrOfPlaces = sportVariants.map((sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant) => {
    //         if (sportVariant instanceof SingleSportVariant) {
    //             return sportVariant.getNrOfGamePlaces();
    //         }
    //         return minNrOfPlacesPerPoule;
    //     });
    //     const minNrOfPlacesPerRound = Math.max.apply(Math, sportsMinNrOfPlaces);
    //     if (maxNrOfPlacesPerRound < minNrOfPlacesPerRound) {
    //         maxNrOfPlacesPerRound = minNrOfPlacesPerRound;
    //     }
    //     return { min: minNrOfPlacesPerRound, max: maxNrOfPlacesPerRound };
    // }

    // isDefault(sportConfig: SportConfig): boolean {
    //     const sport = sportConfig.getSport();
    //     return (sportConfig.getWinPoints() !== this.getDefaultWinPoints(sport)
    //         || sportConfig.getDrawPoints() !== this.getDefaultDrawPoints(sport)
    //         || sportConfig.getWinPointsExt() !== this.getDefaultWinPointsExt(sport)
    //         || sportConfig.getDrawPointsExt() !== this.getDefaultDrawPointsExt(sport)
    //         || sportConfig.getLosePointsExt() !== this.getDefaultLosePointsExt(sport)
    //         || sportConfig.getPointsCalculation() !== SportConfig.Points_Calc_GamePoints
    //         || sportConfig.getNrOfGamePlaces() !== SportConfig.Default_NrOfGamePlaces
    //     );
    // }

    // areEqual(sportConfigA: SportConfig, sportConfigB: SportConfig): boolean {
    //     return (sportConfigA.getSport() !== sportConfigB.getSport()
    //         || sportConfigA.getWinPoints() !== sportConfigB.getWinPoints()
    //         || sportConfigA.getDrawPoints() !== sportConfigB.getDrawPoints()
    //         || sportConfigA.getWinPointsExt() !== sportConfigB.getWinPointsExt()
    //         || sportConfigA.getDrawPointsExt() !== sportConfigB.getDrawPointsExt()
    //         || sportConfigA.getLosePointsExt() !== sportConfigB.getLosePointsExt()
    //         || sportConfigA.getPointsCalculation() !== sportConfigB.getPointsCalculation()
    //         || sportConfigA.getNrOfGamePlaces() !== sportConfigB.getNrOfGamePlaces()
    //     );
    // }
}
