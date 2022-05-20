import { Injectable } from '@angular/core';

import { Structure } from '../../structure';

import { ScoreConfigService } from '../../score/config/service';
import { CompetitionSport } from '../sport';
import { GameAmountConfigService } from '../../planning/gameAmountConfig/service';
import { AgainstQualifyConfigService } from '../../qualify/againstConfig/service';
import { PlaceRanges } from '../../structure/placeRanges';
import { AgainstGpp } from '../../sport/variant/against/gamesPerPlace';
import { AgainstH2h } from '../../sport/variant/against/h2h';
import { AllInOneGame } from '../../sport/variant/allInOneGame';
import { Single } from '../../sport/variant/single';
import { GameAmountConfig } from '../../planning/gameAmountConfig';
import { Round } from '../../qualify/group';
import { Category } from '../../category';

@Injectable({
    providedIn: 'root'
})
export class CompetitionSportService {
    constructor(
        private scoreConfigService: ScoreConfigService,
        private gameAmountConfigService: GameAmountConfigService,
        private againstQualifyConfigService: AgainstQualifyConfigService/*,
        competitionSportMapper: CompetitionSportMapper,
        sportMapper: SportMapper,*/
    ) {
        this.scoreConfigService = scoreConfigService;
        this.gameAmountConfigService = gameAmountConfigService;
        this.againstQualifyConfigService = againstQualifyConfigService;
        // this.competitionSportMapper = competitionSportMapper;
        // this.sportMapper = sportMapper;
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
    // createDefault(sport: Sport, competition: Competition, structure?: Structure): CompetitionSport {
    //     const config = this.competitionSportMapper.toObject(this.createDefaultJson(sport, []), competition);
    //     if (structure) {
    //         this.addToStructure(config, structure);
    //     }
    //     return config;
    // }

    // copy(sourceConfig: SportConfig, competition: Competition): SportConfig {
    //     const newConfig = new SportConfig(sourceConfig.getSport(), competition);

    //     newConfig.setNrOfGamePlaces(sourceConfig.getNrOfGamePlaces());
    //     return newConfig;
    // }

    addToStructure(competitionSport: CompetitionSport, structure: Structure) {

        const variant = competitionSport.getVariant();
        const amount = (variant instanceof AgainstH2h) ? variant.getNrOfH2H() : variant.getNrOfGamesPerPlace();
        new GameAmountConfig(competitionSport, structure.getFirstRoundNumber(), amount);

        structure.getCategories().forEach((category: Category) => {
            this.addToCategory(competitionSport, category);
        });
    }

    addToCategory(competitionSport: CompetitionSport, category: Category) {

        // const variant = competitionSport.getVariant();
        // const amount = (variant instanceof AgainstH2h) ? variant.getNrOfH2H() : variant.getNrOfGamesPerPlace();
        // new GameAmountConfig(competitionSport, structure.getFirstRoundNumber(), amount);
        const rootRound = category.getRootRound();
        this.scoreConfigService.createDefault(competitionSport, rootRound);
        this.againstQualifyConfigService.createDefault(competitionSport, rootRound);
    }

    removeFromStructure(competitionSport: CompetitionSport, structure: Structure) {
        this.gameAmountConfigService.removeFromRoundNumber(competitionSport, structure.getFirstRoundNumber());
        structure.getRootRounds().forEach((rootRound: Round) => {
            this.scoreConfigService.removeFromRound(competitionSport, rootRound);
            this.againstQualifyConfigService.removeFromRound(competitionSport, rootRound);
        });

    }

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
