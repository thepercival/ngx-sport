import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { Structure } from '../../structure';

import { ScoreConfigService } from '../../score/config/service';
import { CompetitionSport } from '../sport';
import { GameAmountConfigService } from '../../planning/gameAmountConfig/service';
import { QualifyAgainstConfigService } from '../../qualify/againstConfig/service';
import { AgainstSportVariant } from '../../sport/variant/against';
import { AllInOneGameSportVariant } from '../../sport/variant/all';
import { SingleSportVariant } from '../../sport/variant/single';
import { VoetbalRange } from '../../range';
import { PlaceRanges } from '../../structure/placeRanges';

@Injectable({
    providedIn: 'root'
})
export class CompetitionSportService {
    constructor(
        private scoreConfigService: ScoreConfigService,
        private gameAmountConfigService: GameAmountConfigService,
        private qualifyAgainstConfigService: QualifyAgainstConfigService/*,
        competitionSportMapper: CompetitionSportMapper,
        sportMapper: SportMapper,*/
    ) {
        this.scoreConfigService = scoreConfigService;
        this.gameAmountConfigService = gameAmountConfigService;
        this.qualifyAgainstConfigService = qualifyAgainstConfigService;
        // this.competitionSportMapper = competitionSportMapper;
        // this.sportMapper = sportMapper;
    }

    getMinNrOfPlacesPerPoule(
        sportVariants: (SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant)[]): number {
        const minNrOfPlacesPerPoule = sportVariants.map((sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant) => {
            return this.getMinNrOfPlacesPerPouleHelper(sportVariant);
        });
        return Math.max.apply(Math, minNrOfPlacesPerPoule);
    }

    getMinNrOfPlacesPerPouleHelper(sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant): number {
        if (sportVariant instanceof AgainstSportVariant) {
            return sportVariant.getNrOfGamePlaces();
        } else if (sportVariant instanceof SingleSportVariant) {
            return sportVariant.getNrOfGamePlaces();
        }
        return PlaceRanges.MinNrOfPlacesPerPoule;
    }

    getMinNrOfPlacesPerRound(
        sportVariants: (SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant)[]): number {
        const sportsMinNrOfPlaces = sportVariants.map((sportVariant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant) => {
            if (sportVariant instanceof SingleSportVariant) {
                return sportVariant.getNrOfGamePlaces();
            }
            return this.getMinNrOfPlacesPerPouleHelper(sportVariant);
        });
        return Math.max.apply(Math, sportsMinNrOfPlaces);
    }

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
        this.gameAmountConfigService.createDefault(competitionSport, structure.getFirstRoundNumber());
        this.scoreConfigService.createDefault(competitionSport, structure.getRootRound());
        this.qualifyAgainstConfigService.createDefault(competitionSport, structure.getRootRound());
    }

    removeFromStructure(competitionSport: CompetitionSport, structure: Structure) {
        this.gameAmountConfigService.removeFromRoundNumber(competitionSport, structure.getFirstRoundNumber());
        this.scoreConfigService.removeFromRound(competitionSport, structure.getRootRound());
        this.qualifyAgainstConfigService.removeFromRound(competitionSport, structure.getRootRound());
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
