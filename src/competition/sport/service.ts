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
    private scoreConfigService: ScoreConfigService;
    private gameAmountConfigService: GameAmountConfigService;
    private qualifyAgainstConfigService: QualifyAgainstConfigService;

    constructor(
        scoreConfigService: ScoreConfigService,
        gameAmountConfigService: GameAmountConfigService,
        qualifyAgainstConfigService: QualifyAgainstConfigService/*,
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
        let roundNumber: RoundNumber | undefined = structure.getFirstRoundNumber();
        while (roundNumber !== undefined) {
            if (roundNumber.hasPrevious() === false || roundNumber.getGameAmountConfigs().length > 0) {
                this.gameAmountConfigService.createDefault(competitionSport, roundNumber);
            }
            roundNumber = roundNumber.getNext();
        }

        const addToRounds = (rounds: Round[]) => {
            rounds.forEach(round => {
                if (round.isRoot() || round.getScoreConfigs().length > 0) {
                    this.scoreConfigService.createDefault(competitionSport, round);
                }
                if (round.isRoot() || round.getQualifyAgainstConfigs().length > 0) {
                    this.qualifyAgainstConfigService.createDefault(competitionSport, round);
                }
            });
        };
        addToRounds([structure.getRootRound()]);
    }

    // remove(config: SportConfig, structure: Structure) {
    //     const competition = config.getCompetition();
    //     const sportConfigs = competition.getSportConfigs();
    //     const index = sportConfigs.indexOf(config);
    //     if (index > -1) {
    //         sportConfigs.splice(index, 1);
    //     }
    //     const sport = config.getSport();

    //     let roundNumber: RoundNumber | undefined = structure.getFirstRoundNumber();
    //     while (roundNumber) {
    //         const scoreConfigs = roundNumber.getSportScoreConfigs();
    //         const scoreConfig = scoreConfigs.find(scoreConfigIt => scoreConfigIt.getSport() === sport);
    //         if (scoreConfig !== undefined) {
    //             const idxScore = scoreConfigs.indexOf(scoreConfig);
    //             if (idxScore >= 0) {
    //                 scoreConfigs.splice(idxScore, 1);
    //             }
    //         }
    //         roundNumber = roundNumber.getNext();
    //     }
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
