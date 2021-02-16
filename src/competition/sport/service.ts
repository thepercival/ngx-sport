import { Injectable } from '@angular/core';

import { RoundNumber } from '../../round/number';
import { Structure } from '../../structure';

import { ScoreConfigService } from '../../score/config/service';
import { CompetitionSport } from '../sport';
import { GameAmountConfigService } from '../../planning/gameAmountConfig/service';
import { QualifyAgainstConfigService } from '../../qualify/againstConfig/service';
import { Round } from '../../qualify/group';

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
